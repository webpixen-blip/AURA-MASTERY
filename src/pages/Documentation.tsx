import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Book, Code, Terminal, Layers } from 'lucide-react';

export function Documentation() {
  const sections = [
    {
      icon: <Book className="h-6 w-6 text-cyan-400" />,
      title: "Getting Started",
      desc: "Learn how to navigate Aura Mastery and find the best tech gear for your needs.",
      items: ["Introduction", "How it Works", "Finding Products", "Affiliate Links"]
    },
    {
      icon: <Code className="h-6 w-6 text-violet-400" />,
      title: "For Brands",
      desc: "Information for tech brands and creators looking to list their products.",
      items: ["Submission Guidelines", "Product Requirements", "Listing Process", "Brand Partnerships"]
    },
    {
      icon: <Terminal className="h-6 w-6 text-fuchsia-400" />,
      title: "Affiliate Program",
      desc: "Detailed documentation for our affiliate partners and network.",
      items: ["Program Overview", "Commission Structure", "Tracking & Analytics", "Payout Methods"]
    },
    {
      icon: <Layers className="h-6 w-6 text-emerald-400" />,
      title: "Technical Info",
      desc: "Information about our platform's technology and data handling.",
      items: ["Data Sources", "Security Measures", "Privacy Compliance", "Platform Updates"]
    }
  ];

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
            Platform <span className="text-cyan-400">Documentation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Everything you need to know about using, partnering with, and building on Aura Mastery.
          </p>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-2">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  {section.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{section.title}</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                {section.desc}
              </p>
              <ul className="mt-8 space-y-3">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-neutral-500 hover:text-cyan-400 transition-colors cursor-pointer">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <section className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-16 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Still Need Help?</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-400">
              If you can't find what you're looking for in our documentation, 
              our support team is always available to help you.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-2xl bg-cyan-600 px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500">
                Contact Support
              </button>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10">
                Join Discord
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
