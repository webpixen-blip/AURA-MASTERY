import { useState, useEffect, FormEvent, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Preloader } from '../components/Preloader';
import { TypingText } from '../components/TypingText';
import { Newsletter } from '../components/Newsletter';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [visibleCount, setVisibleCount] = useState(10);
  const deferredSearch = useDeferredValue(search);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(10);
  }, [deferredSearch, selectedCategory]);

  useEffect(() => {
    fetchProducts();
    // Hide preloader after 2 seconds
    const timer = setTimeout(() => setShowPreloader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setProducts(data);
        const uniqueCategories = ['All', ...new Set(data.map((p: Product) => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };


  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Apply Search Filter
    const searchTrimmed = deferredSearch.trim().toLowerCase();
    if (searchTrimmed) {
      const searchTerms = searchTrimmed.split(/\s+/);
      result = result.filter(product => {
        const productData = `${product.title} ${product.description} ${product.category}`.toLowerCase();
        return searchTerms.every(term => productData.includes(term));
      });

      // Apply Relevance Sorting
      result.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        // Exact title match gets highest priority
        const aExact = aTitle === searchTrimmed;
        const bExact = bTitle === searchTrimmed;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // Title starting with search gets second priority
        const aStarts = aTitle.startsWith(searchTrimmed);
        const bStarts = bTitle.startsWith(searchTrimmed);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // Title containing search gets third priority
        const aContains = aTitle.includes(searchTrimmed);
        const bContains = bTitle.includes(searchTrimmed);
        if (aContains && !bContains) return -1;
        if (!aContains && bContains) return 1;

        return 0;
      });
    }

    return result;
  }, [products, deferredSearch, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyan-500/30">
      <AnimatePresence>
        {showPreloader && <Preloader />}
      </AnimatePresence>
      
      <Navbar />
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
          <div className="absolute h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-400 backdrop-blur-xl"
        >
          <Sparkles className="h-4 w-4" />
          Next-Gen Affiliate Tech
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-4xl font-black tracking-tighter sm:text-5xl md:text-7xl lg:text-8xl"
          >
            CURATED <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">GEAR</span> <TypingText text="FOR THE FUTURE" delay={1.2} />
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-lg text-neutral-400 md:text-xl"
        >
          Discover high-performance tools and gadgets handpicked for developers, creators, and tech enthusiasts.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 w-full max-w-2xl px-4"
        >
          <div className="group relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-neutral-500 transition-colors group-focus-within:text-cyan-400" />
            <input
              type="text"
              placeholder="Search products, categories, tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-white outline-none backdrop-blur-xl transition-all focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  className="absolute right-4 rounded-full p-1 text-neutral-500 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          {search || selectedCategory !== 'All' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-4 text-sm"
            >
              <span className="text-neutral-500">
                Found <span className="font-bold text-cyan-400">{filteredProducts.length}</span> results
              </span>
              {(search || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('All');
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Filter className="h-3 w-3" />
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">Popular:</span>
              {['Mechanical Keyboard', 'Gaming Mouse', 'Monitor', 'Desk Setup'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearch(term);
                    setSelectedCategory('All');
                  }}
                  className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-400 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  {term}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-20">
        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
        >
          <Filter className="mr-2 h-5 w-5 text-neutral-500" />
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More Button */}
        {!loading && filteredProducts.length > visibleCount && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="group relative flex items-center gap-3 rounded-2xl bg-white/5 px-10 py-5 font-black tracking-tighter uppercase text-white transition-all hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] border border-white/10 hover:border-cyan-500/50"
            >
              <span className="relative z-10">Load More Products</span>
              <div className="relative z-10 rounded-full bg-cyan-500/20 p-1 group-hover:bg-cyan-500/40 transition-colors">
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20" />
              <div className="relative rounded-full bg-white/5 p-8">
                <Search className="h-12 w-12 text-neutral-600" />
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase">No results for "{deferredSearch}"</h3>
            <p className="mt-2 text-neutral-500 max-w-md">
              We couldn't find any products matching your search. Try checking your spelling or using more general terms.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setSearch('')}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                Clear Search
              </button>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                View All Products
              </button>
            </div>
          </motion.div>
        )}

        {/* Category Showcase */}
        <section className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-black tracking-tighter uppercase sm:text-5xl">
              Shop by <span className="text-cyan-400">Category</span>
            </h2>
            <p className="mt-4 text-neutral-400">Explore our curated collections across different tech and lifestyle sectors.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Home & Appliances",
                color: "from-cyan-500 to-blue-600",
                items: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
              },
              {
                title: "Fashion & Clothing",
                color: "from-violet-500 to-fuchsia-600",
                items: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
              },
              {
                title: "Computer & Laptops",
                color: "from-emerald-500 to-teal-600",
                items: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
              }
            ].map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-cyan-500/30"
              >
                <div className={`mb-6 h-1 w-20 rounded-full bg-gradient-to-r ${section.color}`} />
                <h3 className="text-2xl font-black tracking-tighter uppercase text-white">{section.title}</h3>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        if (['Electronics', 'Furniture', 'Gadgets'].includes(item)) {
                          setSelectedCategory(item);
                          window.scrollTo({ top: 800, behavior: 'smooth' });
                        } else if (item === 'Flash') {
                          setSearch('Flash');
                          setSelectedCategory('All');
                          window.scrollTo({ top: 800, behavior: 'smooth' });
                        } else {
                          // For Blog, Fullpage, etc. - just show a toast or placeholder for now
                          alert(`${item} for ${section.title} coming soon!`);
                        }
                      }}
                      className="text-left text-sm font-medium text-neutral-500 transition-colors hover:text-cyan-400"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mt-32">
          <Newsletter 
            title="Stay in the Loop" 
            description="Get notified about the latest tech drops and exclusive affiliate deals. No spam, just pure gear." 
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
