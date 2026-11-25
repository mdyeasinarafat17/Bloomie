import {useState, type FocusEvent, type MouseEvent} from 'react';
import {Check, Copy, MessageCircle, Minus, Plus, ShoppingCart, X} from 'lucide-react';
import type {Product} from '../data/products';
import {
  buildWhatsAppOrderUrl,
  formatTk,
  getCartTotal,
  validateDeliveryDetails,
  type CartItem,
  type DeliveryDetails,
  type ValidationErrors,
} from '../utils/storeLogic';

interface CartDrawerProps {
  open: boolean;
  cart: CartItem[];
  products: Product[];
  whatsappNumber: string;
  delivery: DeliveryDetails;
  onClose: () => void;
  onChangeQty: (productId: number, delta: number) => void;
  onUpdateDelivery: (patch: Partial<DeliveryDetails>) => void;
  onToast: (message: string) => void;
}

export function CartDrawer({
  open,
  cart,
  products,
  whatsappNumber,
  delivery,
  onClose,
  onChangeQty,
  onUpdateDelivery,
  onToast,
}: CartDrawerProps) {
  const [errors, setErrors] = useState<ValidationErrors>({
    name: false,
    phone: false,
    address: false,
  });
  const [copied, setCopied] = useState(false);

  const total = getCartTotal(cart, products);
  const validation = validateDeliveryDetails(delivery);
  const waUrl = buildWhatsAppOrderUrl(whatsappNumber, cart, products, delivery);

  const handleFieldFocus = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // Keep active input visible above the mobile virtual keyboard
    setTimeout(() => {
      e.target.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }, 150);
  };

  const handleCheckoutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (cart.length === 0) {
      e.preventDefault();
      onToast('Your cart is empty');
      return;
    }
    if (!validation.valid) {
      e.preventDefault();
      setErrors(validation.errors);
      onToast('Please fill in your name, phone and address');
    }
  };

  const handleCopySummary = async () => {
    if (!validation.valid) {
      setErrors(validation.errors);
      onToast('Please fill in your name, phone and address');
      return;
    }
    const text = decodeURIComponent(waUrl.split('?text=')[1] ?? '');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onToast('Order summary copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Tap Order on WhatsApp to send');
    }
  };

  return (
    <aside
      aria-label="Cart"
      aria-hidden={!open}
      className={`fixed top-2 right-2 bottom-2 z-[70] flex h-[calc(100dvh-16px)] w-[min(390px,calc(100vw-16px))] flex-col overflow-hidden rounded-3xl border border-white/95 bg-gradient-to-b from-white/95 to-[#ffebf4]/92 shadow-[0_20px_50px_rgba(214,61,130,0.3)] backdrop-blur-2xl transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-[115%]'
      }`}
    >
      {/* Fixed Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#ffd8ea] px-5 py-4">
        <span className="font-display text-2xl font-bold text-[#d63d82]">
          Your Cart
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cart"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe3ef] text-[#d63d82] transition-colors hover:bg-[#ee5a9b] hover:text-white active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Single Scrollable Body: Cart items + Delivery form share one scroll area so mobile keyboard never traps fields */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3.5 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-[#ee5a9b]" />
            <p className="text-base font-medium text-[#4a2036]">
              Your cart is empty
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                document.getElementById('products')?.scrollIntoView({behavior: 'smooth'});
              }}
              className="min-h-[44px] rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b] px-6 py-2.5 text-sm font-semibold text-white shadow-md active:scale-95"
            >
              Browse products
            </button>
          </div>
        ) : (
          <>
            <div data-testid="cart-items" className="space-y-2.5">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.id);
                if (!product) return null;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 p-2.5 shadow-sm"
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[#4a2036]">
                        {product.name}
                      </span>
                      <span className="block text-sm font-bold tabular-nums text-[#d63d82]">
                        {formatTk(product.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onChangeQty(product.id, -1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe3ef] text-[#d63d82] hover:bg-[#ee5a9b] hover:text-white active:scale-90"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-5 text-center text-sm font-semibold tabular-nums text-[#4a2036]">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onChangeQty(product.id, 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe3ef] text-[#d63d82] hover:bg-[#ee5a9b] hover:text-white active:scale-90"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white bg-white/75 p-3.5 space-y-2.5">
              <h3 className="font-display text-base font-bold text-[#d63d82]">
                Delivery details
              </h3>

              <div>
                <label htmlFor="fName" className="sr-only">
                  Full name
                </label>
                <input
                  id="fName"
                  type="text"
                  value={delivery.name}
                  onFocus={handleFieldFocus}
                  onChange={(e) => {
                    onUpdateDelivery({name: e.target.value});
                    if (errors.name) setErrors((prev) => ({...prev, name: false}));
                  }}
                  placeholder="Full name"
                  autoComplete="name"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-base sm:text-sm text-[#4a2036] placeholder:text-[#4a2036]/50 outline-none transition-colors ${
                    errors.name
                      ? 'border-[#e5484d] bg-[#fff0f0]'
                      : 'border-[#f2bfd6] bg-white focus:border-[#ee5a9b] focus:ring-2 focus:ring-[#ee5a9b]/20'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-[#c82333]">
                    Please enter your full name
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fPhone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="fPhone"
                  type="tel"
                  inputMode="tel"
                  value={delivery.phone}
                  onFocus={handleFieldFocus}
                  onChange={(e) => {
                    onUpdateDelivery({phone: e.target.value});
                    if (errors.phone) setErrors((prev) => ({...prev, phone: false}));
                  }}
                  placeholder="Phone number (e.g. 01834163007)"
                  autoComplete="tel"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-base sm:text-sm text-[#4a2036] placeholder:text-[#4a2036]/50 outline-none transition-colors ${
                    errors.phone
                      ? 'border-[#e5484d] bg-[#fff0f0]'
                      : 'border-[#f2bfd6] bg-white focus:border-[#ee5a9b] focus:ring-2 focus:ring-[#ee5a9b]/20'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-[#c82333]">
                    Please enter a valid 10+ digit phone number
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fAddr" className="sr-only">
                  Full delivery address
                </label>
                <textarea
                  id="fAddr"
                  rows={2}
                  value={delivery.address}
                  onFocus={handleFieldFocus}
                  onChange={(e) => {
                    onUpdateDelivery({address: e.target.value});
                    if (errors.address) {
                      setErrors((prev) => ({...prev, address: false}));
                    }
                  }}
                  placeholder="Full delivery address"
                  autoComplete="street-address"
                  className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-base sm:text-sm text-[#4a2036] placeholder:text-[#4a2036]/50 outline-none transition-colors ${
                    errors.address
                      ? 'border-[#e5484d] bg-[#fff0f0]'
                      : 'border-[#f2bfd6] bg-white focus:border-[#ee5a9b] focus:ring-2 focus:ring-[#ee5a9b]/20'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-[#c82333]">
                    Please enter your complete delivery address
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Footer: always pinned at the bottom above mobile keyboard */}
      <div className="shrink-0 border-t border-[#ffd8ea] bg-white/90 px-4 py-3.5 backdrop-blur-md">
        <div className="mb-2.5 flex items-center justify-between text-lg font-semibold">
          <span className="text-[#4a2036]">Total</span>
          <span
            data-testid="cart-total"
            className="font-display text-2xl font-bold tabular-nums text-[#d63d82]"
          >
            {formatTk(total)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={validation.valid && cart.length > 0 ? waUrl : '#checkout'}
            target={validation.valid && cart.length > 0 ? '_blank' : undefined}
            rel={validation.valid && cart.length > 0 ? 'noopener noreferrer' : undefined}
            onClick={handleCheckoutClick}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(214,61,130,0.35)] transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Order on WhatsApp</span>
          </a>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={handleCopySummary}
              aria-label="Copy order summary"
              title="Copy order summary"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ffd0e4] bg-white text-[#d63d82] hover:bg-[#fff0f6] active:scale-95"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
