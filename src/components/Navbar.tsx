import {useEffect, useRef, useState} from 'react';
import {Menu, Search, ShoppingCart, X} from 'lucide-react';
import type {Product} from '../data/products';
import {formatTk} from '../utils/storeLogic';

interface NavbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  suggestions: Product[];
  cartCount: number;
  scrolled: boolean;
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onSelectSuggestion: (product: Product) => void;
}

export function Navbar({
  query,
  onQueryChange,
  suggestions,
  cartCount,
  scrolled,
  onOpenMenu,
  onOpenCart,
  onSelectSuggestion,
}: NavbarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [badgePop, setBadgePop] = useState(false);
  const prevCount = useRef(cartCount);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBadgePop(true);
      const timer = setTimeout(() => setBadgePop(false), 280);
      prevCount.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        setShowSuggest(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const openMobileSearch = () => {
    setMobileSearchOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
  };

  const closeAndClearSearch = () => {
    onQueryChange('');
    setShowSuggest(false);
    setMobileSearchOpen(false);
    inputRef.current?.blur();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-[max(10px,env(safe-area-inset-top))] pointer-events-none">
      <nav
        aria-label="Main navigation"
        className={`pointer-events-auto relative flex items-center gap-2 sm:gap-3 rounded-full border border-white/80 bg-gradient-to-br from-white/75 to-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_0_rgba(255,255,255,0.95),0_10px_30px_rgba(214,61,130,0.2)] transition-all duration-300 ${
          scrolled
            ? 'w-full max-w-[780px] px-2.5 py-1.5'
            : 'w-full max-w-[980px] px-2.5 sm:px-3.5 py-2'
        }`}
      >
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/50 text-[#d63d82] shadow-sm transition-transform hover:scale-105 hover:bg-white/80 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#ee5a9b] ${
            mobileSearchOpen ? 'invisible sm:visible' : ''
          }`}
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Balanced hanging logo: noticeable on desktop, compact on mobile so hero text stays clear */}
        <a
          href="#home"
          aria-label="Bloomie! home"
          className={`relative z-10 shrink-0 transition-all duration-300 ${
            scrolled
              ? '-my-3 mr-1 sm:-my-6 sm:mr-3'
              : '-my-4 mr-1 sm:-my-10 md:-my-12 sm:mr-4'
          } ${mobileSearchOpen ? 'invisible sm:visible' : ''}`}
        >
          <img
            src="/assets/aistudio/Bloomie_logo_transparent_HD_0c88d81c.png"
            alt="Bloomie! – Making Moments Bloom"
            className={`w-auto object-contain drop-shadow-[0_6px_14px_rgba(214,61,130,0.32)] transition-all duration-300 ${
              scrolled
                ? 'h-14 sm:h-20 md:h-24'
                : 'h-17 sm:h-28 md:h-36'
            }`}
          />
        </a>

        {/* Search container: inline on >=640px, full-navbar overlay on mobile with dedicated X close button */}
        <div ref={searchWrapRef} className="sm:relative flex-1 min-w-0 flex justify-end sm:justify-stretch">
          {!mobileSearchOpen && (
            <button
              type="button"
              onClick={openMobileSearch}
              aria-label="Open search"
              className="sm:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/85 bg-white/60 text-[#d63d82] shadow-sm active:scale-95 focus-visible:outline-2 focus-visible:outline-[#ee5a9b]"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          <div
            role="search"
            className={`${
              mobileSearchOpen
                ? 'absolute inset-1 z-30 flex items-center gap-2 rounded-full border border-white bg-white px-3.5 shadow-[0_14px_34px_rgba(214,61,130,0.24)] sm:static sm:inset-auto sm:h-11 sm:w-full sm:bg-white/60 sm:shadow-inner'
                : 'hidden sm:flex h-11 w-full items-center gap-2 rounded-full border border-white/85 bg-white/55 px-3.5 shadow-inner focus-within:bg-white/90 focus-within:ring-2 focus-within:ring-[#ee5a9b]/35'
            } text-[#d63d82] transition-all`}
          >
            <Search className="h-4 w-4 shrink-0 text-[#d63d82]" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                onQueryChange(e.target.value);
                setShowSuggest(Boolean(e.target.value.trim()));
              }}
              onFocus={() => {
                if (query.trim()) setShowSuggest(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSuggest(false);
                  setMobileSearchOpen(false);
                  document.getElementById('products')?.scrollIntoView({behavior: 'smooth'});
                  inputRef.current?.blur();
                } else if (e.key === 'Escape') {
                  closeAndClearSearch();
                }
              }}
              placeholder="Search hair clips, keychains..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-base sm:text-sm text-[#4a2036] placeholder:text-[#4a2036]/55 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {(query.length > 0 || mobileSearchOpen) && (
              <button
                type="button"
                onClick={closeAndClearSearch}
                aria-label={mobileSearchOpen ? 'Close search' : 'Clear search'}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe3ef] text-[#d63d82] transition-colors hover:bg-[#ee5a9b] hover:text-white active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {showSuggest && query.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/90 bg-white/95 shadow-[0_14px_34px_rgba(214,61,130,0.24)] backdrop-blur-xl">
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-[#ffe3ef]">
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSuggest(false);
                            setMobileSearchOpen(false);
                            onSelectSuggestion(p);
                          }}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-[#fff0f6]"
                        >
                          <img
                            src={p.img}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-[#4a2036]">
                              {p.name}
                            </span>
                            <span className="block text-xs font-semibold tabular-nums text-[#d63d82]">
                              {formatTk(p.price)}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-3.5 text-center text-sm text-[#4a2036]/75">
                    No products found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Open cart (${cartCount} items)`}
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/50 text-[#d63d82] shadow-sm transition-transform hover:scale-105 hover:bg-white/80 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#ee5a9b] ${
            mobileSearchOpen ? 'invisible sm:visible' : ''
          }`}
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={2} />
          <span
            data-testid="cart-count"
            className={`absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ee5a9b] px-1 text-[11px] font-semibold tabular-nums text-white shadow-md transition-transform duration-200 ${
              badgePop ? 'scale-125' : 'scale-100'
            }`}
          >
            {cartCount}
          </span>
        </button>
      </nav>
    </header>
  );
}
