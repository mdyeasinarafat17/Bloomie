import {Heart, Search, ShoppingCart} from 'lucide-react';
import type {Product} from '../data/products';
import {formatTk, type SortOption} from '../utils/storeLogic';

interface ProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  wishlist: number[];
  onToggleWish: (id: number) => void;
  onAddToCart: (id: number) => void;
  onOpenModal: (product: Product) => void;
  onResetFilters: () => void;
}

export function ProductGrid({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  wishlist,
  onToggleWish,
  onAddToCart,
  onOpenModal,
  onResetFilters,
}: ProductGridProps) {
  return (
    <section id="products" className="mx-auto max-w-6xl px-3.5 sm:px-6 py-10 sm:py-16">
      <h2 className="font-display text-center text-3xl sm:text-4xl font-bold text-[#d63d82] mb-2">
        All Products
      </h2>
      <div className="mx-auto mb-7 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b]" />

      {/* Filter & Sort toolbar */}
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((c) => {
            const active = c === selectedCategory;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onSelectCategory(c)}
                aria-pressed={active}
                className={`min-h-[40px] rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-[#ee5a9b] bg-[#ee5a9b] text-white shadow-[0_6px_16px_rgba(214,61,130,0.3)]'
                    : 'border-white bg-white/70 text-[#d63d82] hover:bg-white'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#d63d82]">
          <span>Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="min-h-[40px] rounded-full border border-white bg-white/80 px-3.5 py-1.5 text-xs sm:text-sm text-[#4a2036] shadow-sm focus:outline-2 focus:outline-[#ee5a9b]"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </label>
      </div>

      {/* 2-column compact grid on mobile, 3-column spacious grid on desktop */}
      {products.length > 0 ? (
        <div
          data-testid="product-grid"
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6"
        >
          {products.map((product) => {
            const wished = wishlist.includes(product.id);
            return (
              <article
                key={product.id}
                id={`p${product.id}`}
                className="group flex flex-col rounded-2xl sm:rounded-3xl border border-white/95 bg-white/75 p-2.5 sm:p-3.5 backdrop-blur-md shadow-[0_10px_28px_rgba(214,61,130,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(214,61,130,0.24)]"
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#fff4f9]">
                  <button
                    type="button"
                    onClick={() => onOpenModal(product)}
                    aria-label={`View details for ${product.name}`}
                    className="block w-full focus-visible:outline-2 focus-visible:outline-[#ee5a9b]"
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>

                  {product.badge && (
                    <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-[#ee5a9b] px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onToggleWish(product.id)}
                    aria-label={
                      wished
                        ? `Remove ${product.name} from wishlist`
                        : `Save ${product.name} to wishlist`
                    }
                    aria-pressed={wished}
                    className={`absolute top-1.5 right-1.5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white transition-all active:scale-90 ${
                      wished
                        ? 'bg-[#ee5a9b] text-white shadow-md'
                        : 'bg-white/80 text-[#ee5a9b] hover:bg-white'
                    }`}
                  >
                    <Heart
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill={wished ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <div className="flex flex-1 flex-col pt-2.5 sm:pt-3.5 px-0.5 sm:px-1">
                  <span className="text-[11px] sm:text-xs font-medium text-[#d63d82]/80">
                    {product.cat}
                  </span>
                  <h3 className="mt-0.5 line-clamp-2 font-display text-sm sm:text-lg font-semibold leading-snug text-[#4a2036]">
                    <button
                      type="button"
                      onClick={() => onOpenModal(product)}
                      className="text-left hover:text-[#d63d82] transition-colors"
                    >
                      {product.name}
                    </button>
                  </h3>

                  <div className="mt-auto pt-2.5 sm:pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="font-display text-lg sm:text-2xl font-bold tabular-nums text-[#d63d82]">
                      {formatTk(product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product.id)}
                      aria-label={`Add ${product.name} to cart`}
                      className="inline-flex min-h-[40px] sm:min-h-[42px] w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_6px_14px_rgba(214,61,130,0.28)] transition-transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sm:hidden">Add</span>
                      <span className="hidden sm:inline">Add to Cart</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/90 bg-white/70 px-6 py-12 text-center backdrop-blur-md">
          <Search className="h-10 w-10 text-[#ee5a9b]" />
          <p className="text-lg font-medium text-[#4a2036]">No products found</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="min-h-[44px] rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b] px-6 py-2.5 text-sm font-semibold text-white shadow-md active:scale-95"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
