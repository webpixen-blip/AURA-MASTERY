import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Headphones, MessageSquare, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Support() {
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
            Customer <span className="text-cyan-400">Support</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            We're here to help you with any questions or issues you may have. 
            Choose the best way to get in touch with our team.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: <MessageSquare className="h-8 w-8 text-cyan-400" />,
              title: "Direct Contact",
              desc: "Send us a message through our contact form for any specific inquiries.",
              link: "/contact",
              label: "Go to Contact"
            },
            {
              icon: <BookOpen className="h-8 w-8 text-violet-400" />,
              title: "Knowledge Base",
              desc: "Browse our documentation and FAQs for quick answers to common questions.",
              link: "/faq",
              label: "View FAQs"
            },
            {
              icon: <Clock className="h-8 w-8 text-fuchsia-400" />,
              title: "Response Time",
              desc: "Our typical response time is within 24-48 hours during business days.",
              link: "#",
              label: "24/7 Monitoring"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl flex flex-col"
            >
              <div className="mb-6 inline-block rounded-2xl bg-white/5 p-4 w-fit">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-4 text-neutral-400 leading-relaxed flex-grow">
                {item.desc}
              </p>
              {item.link !== "#" ? (
                <Link 
                  to={item.link}
                  className="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {item.label} →
                </Link>
              ) : (
                <span className="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-neutral-600">
                  {item.label}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <section className="mt-32 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-16 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Need Immediate Help?</h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-400">
                If you're experiencing a technical issue or have a question about a specific product, 
                our support team is ready to assist. We prioritize high-priority inquiries and 
                partnership requests.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link 
                  to="/contact"
                  className="rounded-2xl bg-cyan-600 px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500"
                >
                  Open Support Ticket
                </Link>
                <Link 
                  to="/documentation"
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
                >
                  Read Documentation
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
                <Headphones className="relative h-48 w-48 text-cyan-400 opacity-20" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
