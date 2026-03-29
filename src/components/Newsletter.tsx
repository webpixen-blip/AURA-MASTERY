import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewsletterProps {
  title?: string;
  description?: string;
}

export function Newsletter({ 
  title = "Enjoyed this article?", 
  description = "Subscribe to our newsletter for more tech insights." 
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          // Unique violation - already subscribed
          setSubscribed(true);
        } else {
          throw error;
        }
      } else {
        setSubscribed(true);
      }
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-xl relative overflow-hidden w-full"
    >
      <div className="absolute top-0 right-0 -z-10 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
      
      <div className="max-w-2xl">
        <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase">
          {title.includes('?') ? (
            <>
              {title.split('?')[0]} <span className="text-cyan-400">?</span>
            </>
          ) : (
            title
          )}
        </h2>
        <p className="mt-4 text-neutral-400">
          {description}
        </p>
        
        <form className="mt-8 flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
          <input 
            type="email" 
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-cyan-500/50 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || subscribed}
            className={`rounded-xl px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 ${
              subscribed ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            {loading ? (
              'Subscribing...'
            ) : subscribed ? (
              'Subscribed!'
            ) : (
              <>
                Subscribe
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>
        {subscribed && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-cyan-400 font-medium"
          >
            Welcome to the inner circle! Check your inbox soon.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
