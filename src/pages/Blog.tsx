import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowRight, Loader2, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Blog } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20">
        {/* Header */}
        <div className="relative mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[100px]"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tighter md:text-6xl"
          >
            AURA <span className="text-cyan-400">INSIGHTS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-neutral-400"
          >
            Discover the latest in tech, lifestyle, and innovation.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5">
            <BookOpen className="mb-4 h-12 w-12 opacity-20" />
            <p className="text-neutral-500">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:bg-white/10"
              >
                <Link to={`/blog/${blog.slug}`} className="aspect-video w-full overflow-hidden">
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400">
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Link to={`/blog/${blog.slug}`}>
                    <h2 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-400 line-clamp-2">
                      {blog.title}
                    </h2>
                  </Link>
                  
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-400 line-clamp-3">
                    {blog.content}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <User className="h-4 w-4 text-cyan-400" />
                      {blog.author}
                    </div>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="flex items-center gap-2 text-sm font-bold text-cyan-400 transition-all hover:gap-3"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
