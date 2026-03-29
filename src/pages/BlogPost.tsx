import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowLeft, Loader2, Share2, Facebook, Twitter, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Blog } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Newsletter } from '../components/Newsletter';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (data) setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <BookOpen className="mb-4 h-12 w-12 opacity-20" />
        <h1 className="text-2xl font-bold">Article not found.</h1>
        <Link to="/blog" className="mt-4 text-cyan-400 hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-20">
        {/* Back Button */}
        <Link
          to="/blog"
          className="mb-12 flex items-center gap-2 text-sm font-bold text-neutral-400 transition-all hover:gap-3 hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Insights
        </Link>

        {/* Article Header */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-cyan-400">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1">{blog.category}</span>
            <div className="flex items-center gap-2 text-neutral-500">
              <Calendar className="h-3 w-3" />
              {new Date(blog.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-6xl">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-between border-y border-white/5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{blog.author}</p>
                <p className="text-xs text-neutral-500">Aura Mastery Contributor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-neutral-400 transition-colors hover:text-cyan-400">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="text-neutral-400 transition-colors hover:text-cyan-400">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-neutral-400 transition-colors hover:text-cyan-400">
                <Mail className="h-5 w-5" />
              </button>
              <button className="text-neutral-400 transition-colors hover:text-cyan-400">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-16 overflow-hidden rounded-3xl border border-white/10">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-neutral-300">
            {blog.content}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-20 border-t border-white/10 pt-12">
          <Newsletter />
        </div>
      </main>

      <Footer />
    </div>
  );
}
