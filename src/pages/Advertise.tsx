import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Megaphone, Target, BarChart, Users, X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Advertise() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    website: '',
    budget_range: '',
    message: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('media_requests')
        .insert([formData]);

      if (error) throw error;
      
      setStatus('success');
      setFormData({
        company_name: '',
        contact_name: '',
        email: '',
        website: '',
        budget_range: '',
        message: ''
      });
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error sending request:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl uppercase">
            Advertise with <span className="text-cyan-400">Us</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Reach a highly engaged audience of tech enthusiasts, developers, and early adopters. 
            Partner with Aura Mastery to showcase your brand.
          </p>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Users className="h-8 w-8 text-cyan-400" />,
              title: "Targeted Audience",
              desc: "Connect with tech-savvy individuals actively looking for the latest gear and software."
            },
            {
              icon: <Target className="h-8 w-8 text-violet-400" />,
              title: "High Intent",
              desc: "Our users are in the discovery and purchasing phase of their tech journey."
            },
            {
              icon: <BarChart className="h-8 w-8 text-fuchsia-400" />,
              title: "Data Driven",
              desc: "Get detailed insights and performance metrics for your advertising campaigns."
            },
            {
              icon: <Megaphone className="h-8 w-8 text-emerald-400" />,
              title: "Brand Visibility",
              desc: "Place your products front and center in a premium, curated tech environment."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >
              <div className="mb-6 inline-block rounded-2xl bg-white/5 p-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <section className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-16 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Ad Placements</h2>
            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-cyan-400 shrink-0" />
                <p className="text-neutral-400"><span className="font-bold text-white">Featured Products:</span> Premium placement at the top of our homepage and category grids.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-violet-400 shrink-0" />
                <p className="text-neutral-400"><span className="font-bold text-white">Newsletter Sponsorship:</span> Reach our subscribers directly in their inbox with dedicated spots.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-fuchsia-400 shrink-0" />
                <p className="text-neutral-400"><span className="font-bold text-white">Social Media Promotion:</span> Coordinated campaigns across our Instagram, Twitter, and YouTube channels.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-12 rounded-2xl bg-cyan-600 px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500"
            >
              Request Media Kit
            </button>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter uppercase">
                  Request <span className="text-cyan-400">Media Kit</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Company Name</label>
                    <input
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                      placeholder="Your Company"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Contact Name</label>
                    <input
                      required
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Business Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                      placeholder="email@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Website URL</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Estimated Monthly Budget</label>
                  <select
                    value={formData.budget_range}
                    onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50 appearance-none"
                  >
                    <option value="" className="bg-[#111]">Select a range</option>
                    <option value="<$1k" className="bg-[#111]">Less than $1,000</option>
                    <option value="$1k-$5k" className="bg-[#111]">$1,000 - $5,000</option>
                    <option value="$5k-$10k" className="bg-[#111]">$5,000 - $10,000</option>
                    <option value="$10k+" className="bg-[#111]">$10,000+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Additional Details</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50 resize-none"
                    placeholder="Tell us about your campaign goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-4 font-bold text-white transition-all hover:bg-cyan-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Submit Request
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-xl bg-green-500/10 p-4 text-green-400"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Request sent! We'll send the media kit to your email shortly.
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-red-400"
                    >
                      <AlertCircle className="h-5 w-5" />
                      Something went wrong. Please try again later.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
