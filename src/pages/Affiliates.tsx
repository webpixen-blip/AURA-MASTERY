import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DollarSign, BarChart, Rocket, ShieldCheck } from 'lucide-react';

export function Affiliates() {
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
            Affiliate <span className="text-cyan-400">Program</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Join the Aura Mastery network and earn competitive commissions by promoting 
            the world's most advanced tech gear.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 rounded-2xl bg-cyan-600 px-10 py-5 text-lg font-black uppercase tracking-tighter text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:bg-cyan-500"
          >
            Apply to Join
          </motion.button>
        </motion.div>

        <div className="mt-32 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <DollarSign className="h-8 w-8 text-cyan-400" />,
              title: "High Commission",
              desc: "Earn up to 15% commission on every successful referral through our network."
            },
            {
              icon: <BarChart className="h-8 w-8 text-violet-400" />,
              title: "Real-time Tracking",
              desc: "Access your personalized dashboard to track clicks, conversions, and earnings in real-time."
            },
            {
              icon: <Rocket className="h-8 w-8 text-fuchsia-400" />,
              title: "Fast Payouts",
              desc: "Get paid monthly via your preferred method once you reach the minimum threshold."
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-emerald-400" />,
              title: "Trusted Brand",
              desc: "Partner with a brand that tech enthusiasts trust for quality and curation."
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
            <h2 className="text-4xl font-black tracking-tighter uppercase">How it Works</h2>
            <div className="mt-10 space-y-8">
              {[
                { step: "01", title: "Sign Up", desc: "Apply for our affiliate program by filling out a simple form." },
                { step: "02", title: "Promote", desc: "Share your unique affiliate links on your blog, social media, or website." },
                { step: "03", title: "Earn", desc: "Earn commissions for every purchase made through your links." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <span className="text-4xl font-black text-white/10">{item.step}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-neutral-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
