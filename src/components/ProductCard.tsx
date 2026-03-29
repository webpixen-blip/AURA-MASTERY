import { motion } from 'motion/react';
import { ExternalLink, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      layout="position"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:border-cyan-500/50 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)]"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-900">
          <img
            src={product.image_url || 'https://picsum.photos/seed/product/400/400'}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              {product.category}
            </span>
            <span className="text-lg font-bold text-white">
              {formatCurrency(product.price)}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white line-clamp-1 transition-colors group-hover:text-cyan-400">
            {product.title}
          </h3>
          
          <p className="text-sm text-neutral-400 line-clamp-2">
            {product.description}
          </p>

          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: "#0891b2" }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-bold text-white transition-all"
          >
            <Eye className="h-4 w-4" />
            View Details
          </motion.div>
        </div>
      </Link>

      {/* Neon Glow Accent */}
      <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
