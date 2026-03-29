import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, LogOut, LayoutDashboard, Package, BarChart3, Upload, Loader2, X, Menu, Mail, Megaphone, TrendingUp, Users, MousePointer2, MessageSquare, AlertTriangle, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, ProductInsert, Blog, BlogInsert } from '../types';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../lib/utils';
import { Navbar } from '../components/Navbar';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';

export function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentView, setCurrentView] = useState<'products' | 'analytics' | 'messages' | 'media' | 'blogs'>('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [mediaRequests, setMediaRequests] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'product' | 'message' | 'media' | 'blog' } | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProductInsert & { images?: string[] }>({
    title: '',
    description: '',
    price: 0,
    affiliate_url: '',
    image_url: '',
    category: '',
    images: [],
  });

  const [blogFormData, setBlogFormData] = useState<BlogInsert>({
    title: '',
    content: '',
    image_url: '',
    author: '',
    category: '',
    slug: '',
  });

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const isConfigured = (import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchMessages();
      fetchMediaRequests();
      fetchBlogs();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
    setMessagesLoading(false);
  };

  const fetchMediaRequests = async () => {
    setMediaLoading(true);
    const { data, error } = await supabase
      .from('media_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMediaRequests(data);
    setMediaLoading(false);
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBlogs(data);
    setBlogsLoading(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back, Admin!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => supabase.auth.signOut();

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const apiKey = (import.meta as any).env.VITE_IMGBB_API_KEY;
      if (!apiKey) throw new Error('ImageBB API key missing');

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();
      if (result.success) {
        if (isGallery) {
          setFormData(prev => ({ 
            ...prev, 
            images: [...(prev.images || []), result.data.url] 
          }));
        } else {
          setFormData(prev => ({ ...prev, image_url: result.data.url }));
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed. Please check your API key.');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        if (error) throw error;
        toast.success('Product added successfully');
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ title: '', description: '', price: 0, affiliate_url: '', image_url: '', category: '', images: [] });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    setLoading(true);
    try {
      let error;
      if (deleteConfirm.type === 'product') {
        const res = await supabase.from('products').delete().eq('id', deleteConfirm.id);
        error = res.error;
        if (!error) fetchProducts();
      } else if (deleteConfirm.type === 'message') {
        const res = await supabase.from('contacts').delete().eq('id', deleteConfirm.id);
        error = res.error;
        if (!error) fetchMessages();
      } else if (deleteConfirm.type === 'media') {
        const res = await supabase.from('media_requests').delete().eq('id', deleteConfirm.id);
        error = res.error;
        if (!error) fetchMediaRequests();
      } else if (deleteConfirm.type === 'blog') {
        const res = await supabase.from('blogs').delete().eq('id', deleteConfirm.id);
        error = res.error;
        if (!error) fetchBlogs();
      }

      if (error) throw error;
      toast.success(`${deleteConfirm.type.charAt(0).toUpperCase() + deleteConfirm.type.slice(1)} deleted successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      affiliate_url: product.affiliate_url,
      image_url: product.image_url,
      category: product.category,
      images: product.images || [],
    });
    setIsModalOpen(true);
  };

  const openBlogModal = (blog: Blog | null = null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogFormData({
        title: blog.title,
        content: blog.content,
        image_url: blog.image_url,
        author: blog.author,
        category: blog.category,
        slug: blog.slug,
      });
    } else {
      setEditingBlog(null);
      setBlogFormData({
        title: '',
        content: '',
        image_url: '',
        author: '',
        category: '',
        slug: '',
      });
    }
    setIsBlogModalOpen(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogsLoading(true);

    try {
      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogFormData)
          .eq('id', editingBlog.id);
        if (error) throw error;
        toast.success('Blog updated successfully');
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogFormData]);
        if (error) throw error;
        toast.success('Blog published successfully');
      }
      
      setIsBlogModalOpen(false);
      fetchBlogs();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast.error(error.message || 'Error saving blog');
    } finally {
      setBlogsLoading(false);
    }
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">Loading...</div>;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          {!isConfigured && (
            <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-400">
              <p className="font-bold">Configuration Missing</p>
              <p>Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Secrets panel.</p>
            </div>
          )}
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tighter text-white">
              ADMIN LOGIN
            </h2>
            <p className="mt-2 text-neutral-400">
              Secure access to Aura Mastery dashboard
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
              />
            </div>
            <button
              disabled={loginLoading || !isConfigured}
              className="w-full rounded-xl bg-cyan-600 py-4 font-bold text-white transition-all hover:bg-cyan-500 disabled:opacity-50"
            >
              {loginLoading ? 'Processing...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-20 left-4 z-[60] md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-xl border border-white/10 bg-black/50 p-3 text-white backdrop-blur-xl transition-all hover:bg-white/5"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar / Nav */}
      <nav className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-white/10 bg-black/50 p-6 pt-24 backdrop-blur-xl transition-transform duration-300 flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : 'max-md:-translate-x-full'
      } md:translate-x-0`}>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
          <div className="text-2xl font-black tracking-tighter text-white">
            AURA<span className="text-cyan-400">ADMIN</span>
          </div>
          <div className="mt-12 space-y-2">
            <button 
              onClick={() => {
                setCurrentView('products');
                setIsSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                currentView === 'products' ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="h-5 w-5" />
              Products
            </button>
            <button 
              onClick={() => {
                setCurrentView('analytics');
                setIsSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                currentView === 'analytics' ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </button>
            <button 
              onClick={() => {
                setCurrentView('messages');
                setIsSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                currentView === 'messages' ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Mail className="h-5 w-5" />
              Messages
            </button>
            <button 
              onClick={() => {
                setCurrentView('media');
                setIsSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                currentView === 'media' ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Megaphone className="h-5 w-5" />
              Media Kit
            </button>
            <button 
              onClick={() => {
                setCurrentView('blogs');
                setIsSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                currentView === 'blogs' ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              Blogs
            </button>
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-neutral-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen pt-36 pb-20 md:ml-64 p-4 md:p-8 md:pt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={currentView + '-header'}
          >
            <h1 className="text-3xl font-black tracking-tighter md:text-4xl uppercase">
              {currentView}
            </h1>
            <p className="text-neutral-400">
              {currentView === 'products' && 'Manage and edit your product catalog.'}
              {currentView === 'analytics' && 'Detailed insights into product engagement.'}
              {currentView === 'messages' && 'View and manage contact form submissions.'}
              {currentView === 'media' && 'Manage incoming media kit and advertising requests.'}
              {currentView === 'blogs' && 'Create and manage your blog articles.'}
            </p>
          </motion.div>
          {currentView === 'products' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingProduct(null);
                setFormData({ 
                  title: '', 
                  description: '', 
                  price: 0, 
                  affiliate_url: '', 
                  image_url: '', 
                  category: '',
                  images: [] 
                });
                setIsModalOpen(true);
              }}
              className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-4 md:py-3 font-bold text-white transition-all hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </motion.button>
          )}
          {currentView === 'blogs' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openBlogModal()}
              className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-4 md:py-3 font-bold text-white transition-all hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Plus className="h-5 w-5" />
              Add Blog
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {currentView === 'products' && (
            <motion.div
              key="products-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-12"
            >
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-neutral-500">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Clicks</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {products.map((product) => (
                      <tr key={product.id} className="group hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.image_url} className="h-10 w-10 rounded-lg object-cover" alt="" />
                            <span className="font-bold">{product.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-400">{product.category}</td>
                        <td className="px-6 py-4 font-bold">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                            {product.click_count || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="rounded-lg p-2 text-neutral-500 hover:bg-white/10 hover:text-cyan-400"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ id: product.id, type: 'product' })}
                              className="rounded-lg p-2 text-neutral-500 hover:bg-white/10 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-4">
                      <img src={product.image_url} className="h-16 w-16 rounded-xl object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{product.title}</h3>
                        <p className="text-sm text-neutral-400">{product.category}</p>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="font-bold text-cyan-400">{formatCurrency(product.price)}</span>
                          <span className="text-xs text-neutral-500">{product.click_count || 0} clicks</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 border-t border-white/5 pt-4">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-bold text-cyan-400 transition-all hover:bg-white/10"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: product.id, type: 'product' })}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'analytics' && (
            <motion.div
              key="analytics-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-12 space-y-8"
            >
              {/* Stats Overview */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Products', value: products.length, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { label: 'Total Clicks', value: products.reduce((acc, p) => acc + (p.click_count || 0), 0), icon: MousePointer2, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                  { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Media Requests', value: mediaRequests.length, icon: Megaphone, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-neutral-500">{stat.label}</p>
                        <h3 className="mt-2 text-3xl font-black text-white">{stat.value}</h3>
                      </div>
                      <div className={`rounded-xl ${stat.bg} p-3`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Click Performance Chart */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <h3 className="mb-8 text-xl font-black tracking-tighter uppercase flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                    Product Click Performance
                  </h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={products
                          .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
                          .slice(0, 8)
                          .map(p => ({ name: p.title.substring(0, 15) + '...', clicks: p.click_count || 0 }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#737373" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#737373" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                        />
                        <Bar 
                          dataKey="clicks" 
                          fill="url(#colorClicks)" 
                          radius={[6, 6, 0, 0]} 
                        />
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <h3 className="mb-8 text-xl font-black tracking-tighter uppercase flex items-center gap-3">
                    <Package className="h-6 w-6 text-violet-400" />
                    Category Engagement
                  </h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Array.from(new Set(products.map(p => p.category))).map(cat => ({
                            name: cat,
                            value: products.filter(p => p.category === cat).reduce((acc, p) => acc + (p.click_count || 0), 0)
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-4">
                    {Array.from(new Set(products.map(p => p.category))).map((cat, i) => (
                      <div key={cat} className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5] }} />
                        <span className="text-neutral-400">{cat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Chart (Product Additions) */}
                <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <h3 className="mb-8 text-xl font-black tracking-tighter uppercase flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                    Inventory Growth (Last 30 Days)
                  </h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={Array.from({ length: 30 }).map((_, i) => {
                          const date = subDays(new Date(), 29 - i);
                          const count = products.filter(p => 
                            isWithinInterval(new Date(p.created_at), {
                              start: startOfDay(date),
                              end: new Date(date.setHours(23, 59, 59, 999))
                            })
                          ).length;
                          return {
                            date: format(date, 'MMM dd'),
                            count
                          };
                        })}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#737373" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#737373" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#10b981" 
                          fillOpacity={1} 
                          fill="url(#colorCount)" 
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {currentView === 'blogs' && (
            <motion.div
              key="blogs-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-12"
            >
              {blogsLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : blogs.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-500">
                  <BookOpen className="mb-4 h-12 w-12 opacity-20" />
                  <p>No blogs yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      layout
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={blog.image_url} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cyan-400">
                          <span>{blog.category}</span>
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="mt-2 text-xl font-bold text-white line-clamp-2">{blog.title}</h3>
                        <div className="mt-6 flex gap-2">
                          <button
                            onClick={() => openBlogModal(blog)}
                            className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold text-cyan-400 transition-all hover:bg-white/10"
                          >
                            <Edit2 className="h-4 w-4 mx-auto" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: blog.id, type: 'blog' })}
                            className="flex-1 rounded-xl bg-red-500/10 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {currentView === 'messages' && (
            <motion.div
              key="messages-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-12 space-y-6"
            >
              {messagesLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-500">
                  <Mail className="mb-4 h-12 w-12 opacity-20" />
                  <p>No messages yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      layout
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{msg.subject}</h3>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">From:</span> {msg.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">Email:</span> {msg.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">Date:</span> {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm({ id: msg.id, type: 'message' })}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-6 rounded-xl bg-black/30 p-4 text-neutral-300 leading-relaxed">
                        {msg.message}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {currentView === 'media' && (
            <motion.div
              key="media-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-12 space-y-6"
            >
              {mediaLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : mediaRequests.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-500">
                  <Megaphone className="mb-4 h-12 w-12 opacity-20" />
                  <p>No media kit requests yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {mediaRequests.map((req) => (
                    <motion.div
                      key={req.id}
                      layout
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{req.company_name}</h3>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">Contact:</span> {req.contact_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">Email:</span> {req.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">Website:</span> {req.website || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">Budget:</span> {req.budget_range || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-bold text-cyan-400">Date:</span> {new Date(req.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm({ id: req.id, type: 'media' })}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      {req.message && (
                        <div className="mt-6 rounded-xl bg-black/30 p-4 text-neutral-300 leading-relaxed">
                          {req.message}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-8 shadow-2xl text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Confirm Deletion</h2>
              <p className="mt-4 text-neutral-400">
                Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
              </p>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-4 font-bold text-white transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isBlogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-black tracking-tighter">
                  {editingBlog ? 'EDIT BLOG' : 'PUBLISH NEW BLOG'}
                </h2>
                <button onClick={() => setIsBlogModalOpen(false)} className="text-neutral-500 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleBlogSubmit} className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Title</label>
                  <input
                    required
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="Blog Title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Author</label>
                  <input
                    required
                    value={blogFormData.author}
                    onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="Author Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Category</label>
                  <input
                    required
                    value={blogFormData.category}
                    onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="e.g. Technology, Lifestyle"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Slug (URL Part)</label>
                  <input
                    required
                    value={blogFormData.slug}
                    onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="e.g. my-first-blog"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Image URL</label>
                  <input
                    required
                    value={blogFormData.image_url}
                    onChange={(e) => setBlogFormData({ ...blogFormData, image_url: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="Image URL"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Content</label>
                  <textarea
                    required
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    className="h-64 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="Write your blog content here..."
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setIsBlogModalOpen(false)}
                    className="flex-1 rounded-xl border border-white/10 py-4 font-bold text-neutral-400 transition-all hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={blogsLoading}
                    className="flex-1 rounded-xl bg-cyan-600 py-4 font-bold text-white transition-all hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                  >
                    {blogsLoading ? 'Publishing...' : (editingBlog ? 'Update Blog' : 'Publish Blog')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-black tracking-tighter">
                  {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="Product Title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Category</label>
                  <input
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="e.g. Tech, Audio"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Affiliate URL</label>
                  <input
                    required
                    value={formData.affiliate_url}
                    onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="https://amazon.com/..."
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Main Image</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                        placeholder="Main Image URL"
                      />
                    </div>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/5 px-6 py-4 sm:py-0 font-bold transition-all hover:bg-white/10">
                      {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                      Upload
                      <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, false)} accept="image/*" />
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Gallery Images</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images?.map((img, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img src={img} className="h-full w-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-cyan-500/50 hover:bg-white/10">
                      <Plus className="h-6 w-6 text-neutral-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Add</span>
                      <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, true)} accept="image/*" />
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-32 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                    placeholder="Product details..."
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-white/10 py-4 font-bold text-neutral-400 transition-all hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-cyan-600 py-4 font-bold text-white transition-all hover:bg-cyan-500"
                  >
                    {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mock for sparklines icon which was missing from lucide-react in my thought process but I'll use Activity
const sparklines = BarChart3;
