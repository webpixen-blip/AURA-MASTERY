import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Shield, Zap, Users, Target } from 'lucide-react';

export function About() {
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
            About <span className="text-cyan-400">Aura Mastery</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            We are more than just a directory. We are a curated ecosystem of high-performance technology, 
            vetted for those who build the future.
          </p>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Shield className="h-8 w-8 text-cyan-400" />,
              title: "Vetted Quality",
              desc: "Every product in our catalog undergoes rigorous testing for performance and reliability."
            },
            {
              icon: <Zap className="h-8 w-8 text-violet-400" />,
              title: "Cutting Edge",
              desc: "We focus on the latest tech trends, from mechanical keyboards to AI-powered workstations."
            },
            {
              icon: <Users className="h-8 w-8 text-fuchsia-400" />,
              title: "Community First",
              desc: "Built by tech enthusiasts, for tech enthusiasts. We prioritize user feedback and real-world testing."
            },
            {
              icon: <Target className="h-8 w-8 text-emerald-400" />,
              title: "Curated Experience",
              desc: "No clutter. Just the best gear, handpicked to elevate your setup and productivity."
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
            <h2 className="text-4xl font-black tracking-tighter uppercase">Our Mission</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-400">
              At Aura Mastery, we believe that the right tools can unlock human potential. 
              Our mission is to bridge the gap between complex technology and the people who use it 
              to create, innovate, and build. We simplify the discovery process by providing 
              honest reviews, expert curation, and direct access to the world's most advanced gear.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-neutral-400">
              Whether you're a developer, designer, gamer, or tech enthusiast, we're here to help 
              you find the perfect additions to your digital arsenal.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
