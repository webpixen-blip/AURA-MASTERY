import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function PrivacyPolicy() {
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
            Privacy <span className="text-cyan-400">Policy</span>
          </h1>
          <p className="mt-6 text-neutral-400">Last updated: March 29, 2026</p>
        </motion.div>

        <section className="mt-20 space-y-12 text-neutral-400 leading-relaxed">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us, such as when you subscribe to our newsletter, 
              contact us for support, or interact with our affiliate links. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address (for newsletters and contact)</li>
              <li>Name (if provided in contact forms)</li>
              <li>Usage data (how you interact with our website)</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Personalize your experience on our website</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4">3. Affiliate Disclosure</h2>
            <p>
              Aura Mastery is a participant in various affiliate marketing programs. This means we may earn 
              a commission on products purchased through our links. This does not affect the price you pay 
              and helps us maintain and improve our platform. We only recommend products we believe in.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, 
              and unauthorized access, disclosure, alteration, and destruction. However, no internet 
              transmission is ever fully secure or error-free.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              <span className="text-cyan-400 ml-1">privacy@neonaffiliate.com</span>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
