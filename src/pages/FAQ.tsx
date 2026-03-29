import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Aura Mastery?",
      a: "Aura Mastery is a curated tech directory that handpicks the best gear, from mechanical keyboards to high-performance workstations, and provides direct affiliate links to purchase them."
    },
    {
      q: "How do you choose products?",
      a: "Our team of tech enthusiasts rigorously vets every product for performance, build quality, and value. We only feature gear we believe in and would use ourselves."
    },
    {
      q: "Are the prices higher because of affiliate links?",
      a: "No. The price you pay is exactly the same as if you went directly to the store. We earn a small commission from the retailer at no extra cost to you."
    },
    {
      q: "How can I submit my product?",
      a: "If you're a brand or creator with a high-quality tech product, you can reach out to us through our Advertise or Contact page for review and potential listing."
    },
    {
      q: "Do you offer international shipping?",
      a: "Aura Mastery is a directory, not a store. Shipping depends on the retailer (like Amazon or specialized tech shops) you are redirected to."
    },
    {
      q: "How can I track my order?",
      a: "Since you purchase directly from the retailer, you should check the confirmation email or account on the site where you completed the purchase."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(search.toLowerCase()) || 
    faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl uppercase">
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Everything you need to know about Aura Mastery and how we work.
          </p>
        </motion.div>

        <div className="mt-16 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 pl-12 text-white outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        <div className="mt-12 space-y-4">
          {filteredFaqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
              >
                <span className="text-lg font-bold text-white">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5"
                  >
                    <div className="p-6 text-neutral-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-20 text-neutral-500">
              <HelpCircle className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No questions found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
