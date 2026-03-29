import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  RotateCcw, 
  Headphones, 
  MapPin, 
  Phone, 
  Facebook, 
  Music, 
  Youtube, 
  Mail, 
  Globe,
  Apple,
  Play
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-cyan-400" />,
      title: "Message via WhatsApp",
      desc: "Send instant messages & product details through Whatsapp."
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-violet-400" />,
      title: "Money Back",
      desc: "If goods have problem we'll return your good."
    },
    {
      icon: <Headphones className="h-8 w-8 text-fuchsia-400" />,
      title: "24/7 Support",
      desc: "Our dedicated support is available to help you."
    }
  ];

  const footerLinks = {
    company: [
      { name: "About", href: "/about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Contact Us", href: "/contact" },
      { name: "Affiliates", href: "/affiliates" }
    ],
    support: [
      { name: "Advertise", href: "/advertise" },
      { name: "FAQ", href: "/faq" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Support", href: "/support" },
      { name: "Documentation", href: "/documentation" }
    ]
  };

  const categories = [
    {
      title: "Home & Appliances",
      links: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
    },
    {
      title: "Fashion & Clothing",
      links: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
    },
    {
      title: "Computer & Laptops",
      links: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
    }
  ];

  return (
    <footer className="mt-20 border-t border-white/10 bg-black/50 backdrop-blur-xl">
      {/* Top Features Section */}
      <div className="border-b border-white/10 bg-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="rounded-2xl bg-white/5 p-3 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 font-black text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                A
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                AURA<span className="text-cyan-400">MASTERY</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Keep surfing Aura Mastery to find your best product. Handpicked tech gear for the modern enthusiast.
            </p>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-cyan-400" />
                <span>Nikiniyawa, Kekirawa</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>+94 74 221 0092</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-neutral-400 transition-colors hover:text-cyan-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Help & Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-neutral-400 transition-colors hover:text-cyan-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Apps */}
          <div className="space-y-8">
            <div>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Our Social Profile</h4>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, href: "https://facebook.com/auramastery" },
                  { Icon: Music, href: "https://www.tiktok.com/@slwetm" },
                  { Icon: Youtube, href: "https://www.youtube.com/@slwordecho" },
                  { Icon: Mail, href: "mailto:supportusslam@gmail.com" },
                  { Icon: Globe, href: "#" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="rounded-lg bg-white/5 p-2 text-neutral-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                  >
                    <social.Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Download Apps</h4>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  <Apple className="h-5 w-5" />
                  iOS App
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Android App
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Categorized Links */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <div className="space-y-6">
            {categories.map((cat, i) => (
              <div key={i} className="flex flex-col gap-2 md:flex-row md:items-center">
                <span className="min-w-[180px] text-sm font-bold text-white">{cat.title}:</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {cat.links.map((link, j) => (
                    link === "Blog" ? (
                      <Link key={j} to="/blog" className="text-sm text-neutral-500 transition-colors hover:text-cyan-400">
                        {link}
                      </Link>
                    ) : (
                      <a key={j} href="#" className="text-sm text-neutral-500 transition-colors hover:text-cyan-400">
                        {link}
                      </a>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 text-center text-xs text-neutral-600">
          © {currentYear} Aura Mastery. All rights reserved. Designed for the future.
        </div>
      </div>
    </footer>
  );
}
