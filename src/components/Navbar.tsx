import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Home as HomeIcon, Menu, X, ChevronDown, ShoppingBag } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);

  const shopCategories = [
    {
      title: "Home & Appliances",
      items: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
    },
    {
      title: "Fashion & Clothing",
      items: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
    },
    {
      title: "Computer & Laptops",
      items: ["Blog", "Electronics", "Flash", "Fullpage", "Furniture", "Gadgets"]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(event.target as Node)) {
        setIsShopOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? 'border-white/10 bg-black/80 py-2 backdrop-blur-xl' 
          : 'border-transparent bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 font-black text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            A
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            AURA<span className="text-cyan-400">MASTERY</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-neutral-400 transition-colors hover:text-white">
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>
          
          {/* Shop Dropdown */}
          <div className="relative" ref={shopRef}>
            <button 
              onClick={() => setIsShopOpen(!isShopOpen)}
              className="flex items-center gap-1 text-sm font-bold text-neutral-400 transition-colors hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop
              <ChevronDown className={`h-3 w-3 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isShopOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-1/2 mt-4 w-[90vw] max-w-[600px] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/90 p-8 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="grid grid-cols-3 gap-8">
                    {shopCategories.map((cat) => (
                      <div key={cat.title}>
                        <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-cyan-400">{cat.title}</h4>
                        <div className="space-y-2">
                          {cat.items.map((item) => (
                            item === "Blog" ? (
                              <Link
                                key={item}
                                to="/blog"
                                onClick={() => setIsShopOpen(false)}
                                className="block text-sm font-medium text-neutral-500 transition-colors hover:text-white"
                              >
                                {item}
                              </Link>
                            ) : (
                              <button
                                key={item}
                                onClick={() => {
                                  setIsShopOpen(false);
                                  navigate('/');
                                }}
                                className="block text-sm font-medium text-neutral-500 transition-colors hover:text-white"
                              >
                                {item}
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/about" className="text-sm font-bold text-neutral-400 transition-colors hover:text-white">
            About
          </Link>
          <Link to="/contact" className="text-sm font-bold text-neutral-400 transition-colors hover:text-white">
            Contact
          </Link>
          <Link to="/admin" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-neutral-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400">
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white md:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-black/95 md:hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl p-4 text-lg font-bold text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>

              {/* Mobile Shop Section */}
              <div className="px-4 py-2">
                <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-cyan-400">Shop Categories</h4>
                <div className="space-y-2">
                  {shopCategories.map((cat) => (
                    <div key={cat.title} className="overflow-hidden rounded-xl border border-white/5 bg-white/5">
                      <button
                        onClick={() => setActiveMobileCategory(activeMobileCategory === cat.title ? null : cat.title)}
                        className="flex w-full items-center justify-between p-4 text-left text-sm font-bold text-white transition-colors hover:bg-white/5"
                      >
                        {cat.title}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeMobileCategory === cat.title ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {activeMobileCategory === cat.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="grid grid-cols-2 gap-2 border-t border-white/5 p-4">
                              {cat.items.map((item) => (
                                item === "Blog" ? (
                                  <Link
                                    key={item}
                                    to="/blog"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg bg-white/5 p-3 text-left text-xs font-medium text-neutral-400 transition-colors hover:text-cyan-400"
                                  >
                                    {item}
                                  </Link>
                                ) : (
                                  <button
                                    key={item}
                                    onClick={() => {
                                      setIsOpen(false);
                                      navigate('/');
                                    }}
                                    className="rounded-lg bg-white/5 p-3 text-left text-xs font-medium text-neutral-400 transition-colors hover:text-cyan-400"
                                  >
                                    {item}
                                  </button>
                                )
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                to="/about" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl p-4 text-lg font-bold text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl p-4 text-lg font-bold text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                Contact
              </Link>
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl p-4 text-lg font-bold text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                <ShieldCheck className="h-5 w-5" />
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
