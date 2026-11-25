import {Heart, ShoppingCart, X} from 'lucide-react';
import type {Product} from '../data/products';
import {formatTk} from '../utils/storeLogic';

interface ProductModalProps {
  product: Product | null;
  wished: boolean;
  onClose: () => void;
  onToggleWish: (id: number) => void;
  onAddToCart: (id: number) => void;
}

export function ProductModal({
  product,
  wished,
  onClose,
  onToggleWish,
  onAddToCart,
}: ProductModalProps) {
  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#4a2036]/45 p-3.5 sm:p-6 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl border border-white bg-white/95 p-4 sm:p-7 shadow-[0_24px_60px_rgba(74,32,54,0.3)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe3ef] text-[#d63d82] transition-colors hover:bg-[#ee5a9b] hover:text-white active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
          <img
            src={product.img}
            alt={product.name}
            className="aspect-square w-full rounded-2xl object-cover bg-[#fff4f9]"
          />

          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide text-[#d63d82]">
              {product.cat}
            </span>
            <h2
              id="modal-product-title"
              className="mt-1 font-display text-2xl sm:text-3xl font-bold leading-tight text-[#4a2036]"
            >
              {product.name}
            </h2>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-[#d63d82]">
              {formatTk(product.price)}
            </p>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4a2036]/85">
              {product.desc}
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product.id);
                  onClose();
                }}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(214,61,130,0.35)] transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWish(product.id)}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={wished}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  wished
                    ? 'border-[#ee5a9b] bg-[#ee5a9b] text-white'
                    : 'border-[#ffd0e4] bg-[#fff5f9] text-[#ee5a9b]'
                }`}
              >
                <Heart className="h-5 w-5" fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
