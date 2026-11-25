import {useEffect, useMemo, useRef, useState} from 'react';
import {MessageCircle} from 'lucide-react';
import {CartDrawer} from './components/CartDrawer';
import {HeroSlider} from './components/HeroSlider';
import {InfoSections} from './components/InfoSections';
import {Navbar} from './components/Navbar';
import {ProductGrid} from './components/ProductGrid';
import {ProductModal} from './components/ProductModal';
import {SidebarDrawer} from './components/SidebarDrawer';
import {PRODUCTS, WHATSAPP_NUMBER, type Product} from './data/products';
import {
  addCartItem,
  filterAndSortProducts,
  getCartCount,
  getCategories,
  parsePersistedState,
  STORAGE_KEY,
  toggleWishlistId,
  updateCartItemQty,
  type DeliveryDetails,
  type PersistedStoreState,
  type SortOption,
} from './utils/storeLogic';

export default function App() {
  const validProductIds = useMemo(() => new Set(PRODUCTS.map((p) => p.id)), []);

  const [storeState, setStoreState] = useState<PersistedStoreState>(() => {
    try {
      return parsePersistedState(localStorage.getItem(STORAGE_KEY), validProductIds);
    } catch {
      return parsePersistedState(null, validProductIds);
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hideFloatWa, setHideFloatWa] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist cart, wishlist, and delivery details across reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [storeState]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 56);
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setScrollProgress((window.scrollY / maxScroll) * 100);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tuck away floating WhatsApp button on narrow mobile screens while browsing products
  useEffect(() => {
    const target = document.querySelector('[data-testid="product-grid"]');
    if (!target) return;
    let isIntersecting = false;
    const sync = () => {
      setHideFloatWa(isIntersecting && window.innerWidth < 768);
    };
    const io = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0].isIntersecting;
        sync();
      },
      {threshold: 0.01, rootMargin: '0px 0px 40px 0px'},
    );
    io.observe(target);
    window.addEventListener('resize', sync);
    return () => {
      io.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setCartOpen(false);
        setActiveProduct(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 2200);
  };

  const categories = useMemo(() => getCategories(PRODUCTS), []);

  const visibleProducts = useMemo(
    () => filterAndSortProducts(PRODUCTS, selectedCategory, query, sortBy),
    [selectedCategory, query, sortBy],
  );

  const searchSuggestions = useMemo(
    () => filterAndSortProducts(PRODUCTS, 'All', query, 'featured'),
    [query],
  );

  const cartCount = useMemo(
    () => getCartCount(storeState.cart),
    [storeState.cart],
  );

  const handleAddToCart = (id: number) => {
    setStoreState((prev) => ({
      ...prev,
      cart: addCartItem(prev.cart, id),
    }));
    showToast('Added to cart');
  };

  const handleChangeQty = (id: number, delta: number) => {
    setStoreState((prev) => ({
      ...prev,
      cart: updateCartItemQty(prev.cart, id, delta),
    }));
  };

  const handleToggleWish = (id: number) => {
    setStoreState((prev) => {
      const nextWish = toggleWishlistId(prev.wishlist, id);
      const isAdded = nextWish.includes(id);
      showToast(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
      return {...prev, wishlist: nextWish};
    });
  };

  const handleUpdateDelivery = (patch: Partial<DeliveryDetails>) => {
    setStoreState((prev) => ({
      ...prev,
      delivery: {...prev.delivery, ...patch},
    }));
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  const anyDrawerOpen = menuOpen || cartOpen;

  return (
    <div id="home" className="relative min-h-screen">
      {/* Scroll progress indicator */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-[100] h-1">
        <div
          className="h-full rounded-r bg-gradient-to-r from-[#ff8fbf] to-[#d63d82] transition-[width] duration-75"
          style={{width: `${scrollProgress}%`}}
        />
      </div>

      {/* Ambient pastel background blobs */}
      <div className="bloom-bg" aria-hidden="true">
        <div className="bloom-blob -top-24 -left-24 h-96 w-96 bg-[#ff8fbf]" />
        <div
          className="bloom-blob top-[45%] -right-28 h-80 w-80 bg-[#ffc2dc]"
          style={{animationDelay: '-5s'}}
        />
        <div
          className="bloom-blob -bottom-28 left-[25%] h-88 w-88 bg-[#f9a8d4]"
          style={{animationDelay: '-9s'}}
        />
      </div>

      <Navbar
        query={query}
        onQueryChange={setQuery}
        suggestions={searchSuggestions}
        cartCount={cartCount}
        scrolled={scrolled}
        onOpenMenu={() => {
          setToastMsg('');
          setMenuOpen(true);
        }}
        onOpenCart={() => {
          setToastMsg('');
          setCartOpen(true);
        }}
        onSelectSuggestion={(product) => setActiveProduct(product)}
      />

      {/* Drawer overlay */}
      <div
        onClick={() => {
          setMenuOpen(false);
          setCartOpen(false);
        }}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-[#4a2036]/35 backdrop-blur-xs transition-opacity duration-300 ${
          anyDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <SidebarDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <CartDrawer
        open={cartOpen}
        cart={storeState.cart}
        products={PRODUCTS}
        whatsappNumber={WHATSAPP_NUMBER}
        delivery={storeState.delivery}
        onClose={() => setCartOpen(false)}
        onChangeQty={handleChangeQty}
        onUpdateDelivery={handleUpdateDelivery}
        onToast={showToast}
      />

      <main>
        <HeroSlider products={PRODUCTS} />

        {/* Marquee ribbon */}
        <div
          aria-hidden="true"
          className="relative z-10 -my-2 overflow-hidden bg-gradient-to-r from-[#ee5a9b] via-[#ff8fbf] to-[#ee5a9b] py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_6px_18px_rgba(214,61,130,0.28)]"
        >
          <div className="bloom-marquee-track">
            <span className="px-4">
              Making Moments Bloom &nbsp;•&nbsp; Cute Bows &nbsp;•&nbsp; Pretty
              Flowers &nbsp;•&nbsp; Bloomie! &nbsp;•&nbsp;
            </span>
            <span className="px-4">
              Making Moments Bloom &nbsp;•&nbsp; Cute Bows &nbsp;•&nbsp; Pretty
              Flowers &nbsp;•&nbsp; Bloomie! &nbsp;•&nbsp;
            </span>
            <span className="px-4">
              Making Moments Bloom &nbsp;•&nbsp; Cute Bows &nbsp;•&nbsp; Pretty
              Flowers &nbsp;•&nbsp; Bloomie! &nbsp;•&nbsp;
            </span>
            <span className="px-4">
              Making Moments Bloom &nbsp;•&nbsp; Cute Bows &nbsp;•&nbsp; Pretty
              Flowers &nbsp;•&nbsp; Bloomie! &nbsp;•&nbsp;
            </span>
          </div>
        </div>

        <ProductGrid
          products={visibleProducts}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          wishlist={storeState.wishlist}
          onToggleWish={handleToggleWish}
          onAddToCart={handleAddToCart}
          onOpenModal={(product) => setActiveProduct(product)}
          onResetFilters={handleResetFilters}
        />

        <InfoSections />
      </main>

      <ProductModal
        product={activeProduct}
        wished={activeProduct ? storeState.wishlist.includes(activeProduct.id) : false}
        onClose={() => setActiveProduct(null)}
        onToggleWish={handleToggleWish}
        onAddToCart={handleAddToCart}
      />

      {/* Top toast notification */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed top-[calc(14px+env(safe-area-inset-top))] left-1/2 z-[90] -translate-x-1/2 rounded-full bg-[#4a2036]/92 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
          toastMsg
            ? 'translate-y-0 opacity-100'
            : '-translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        {toastMsg}
      </div>

      {/* Floating WhatsApp CTA */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`fixed right-4 bottom-[calc(18px+env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90 bg-gradient-to-br from-[#4ee68a] to-[#1fb855] text-white shadow-[0_10px_26px_rgba(31,184,85,0.4)] transition-all duration-300 hover:scale-110 ${
          hideFloatWa || anyDrawerOpen
            ? 'scale-0 opacity-0 pointer-events-none'
            : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
