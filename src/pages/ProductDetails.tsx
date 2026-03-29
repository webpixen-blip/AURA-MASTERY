import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, ExternalLink, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      setActiveImage(data.image_url);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPrice = async () => {
    if (!product) return;
    
    // Increment click count
    await supabase
      .from('products')
      .update({ click_count: (product.click_count || 0) + 1 })
      .eq('id', product.id);
    
    window.open(product.affiliate_url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!product) return null;

  const allImages = [product.image_url, ...(product.images || [])];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyan-500/30">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-neutral-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Store
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <div className="space-y-4">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
            >
              <img
                src={activeImage || 'https://picsum.photos/seed/product/800/800'}
                alt={product.title}
                className="h-full w-full rounded-2xl object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8 flex gap-2">
                <span className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-4 py-1 text-xs font-bold text-cyan-400 backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-4">
                {allImages.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === img ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="h-full w-full object-cover" alt="" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3
                }
              }
            }}
            className="flex flex-col justify-center space-y-8"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
                <Tag className="h-4 w-4" />
                {product.category}
              </div>
              <h1 className="text-4xl font-black tracking-tighter md:text-6xl">
                {product.title}
              </h1>
              <div className="text-3xl font-black text-white">
                {formatCurrency(product.price)}
              </div>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-lg leading-relaxed text-neutral-400">
                {product.description}
              </p>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckPrice}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 py-5 text-xl font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
              >
                <ShoppingCart className="h-6 w-6" />
                CHECK PRICE & BUY
                <ExternalLink className="h-5 w-5" />
              </motion.button>
              
              <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Verified Affiliate Link
                </div>
                <div className="h-1 w-1 rounded-full bg-neutral-700" />
                <div>Secure Transaction</div>
              </div>
            </motion.div>

            {/* Features/Trust Badges */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-4 pt-8"
            >
              {[
                { title: 'High Quality', desc: 'Handpicked tech gear' },
                { title: 'Best Price', desc: 'Real-time price check' },
              ].map((badge, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5, borderColor: "rgba(6,182,212,0.5)" }}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors"
                >
                  <div className="font-bold text-white">{badge.title}</div>
                  <div className="text-sm text-neutral-500">{badge.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
