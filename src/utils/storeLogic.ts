import type {Product} from '../data/products';

export type SortOption = 'featured' | 'low' | 'high';

export interface CartItem {
  id: number;
  qty: number;
}

export interface DeliveryDetails {
  name: string;
  phone: string;
  address: string;
}

export interface PersistedStoreState {
  cart: CartItem[];
  wishlist: number[];
  delivery: DeliveryDetails;
}

export interface ValidationErrors {
  name: boolean;
  phone: boolean;
  address: boolean;
}

export const STORAGE_KEY = 'bloomie_store_v1';

export function formatTk(amount: number): string {
  return `৳${amount}`;
}

export function getCategories(products: Product[]): string[] {
  return ['All', ...new Set(products.map((p) => p.cat))];
}

export function filterAndSortProducts(
  products: Product[],
  category: string,
  query: string,
  sortBy: SortOption,
): Product[] {
  const q = query.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchesCat = category === 'All' || p.cat === category;
    const matchesQuery =
      !q || `${p.name} ${p.cat} ${p.desc}`.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  if (sortBy === 'low') {
    return [...filtered].sort((a, b) => a.price - b.price);
  }
  if (sortBy === 'high') {
    return [...filtered].sort((a, b) => b.price - a.price);
  }
  return filtered;
}

export function addCartItem(cart: CartItem[], productId: number): CartItem[] {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    return cart.map((item) =>
      item.id === productId ? {...item, qty: item.qty + 1} : item,
    );
  }
  return [...cart, {id: productId, qty: 1}];
}

export function updateCartItemQty(
  cart: CartItem[],
  productId: number,
  delta: number,
): CartItem[] {
  return cart
    .map((item) =>
      item.id === productId ? {...item, qty: item.qty + delta} : item,
    )
    .filter((item) => item.qty > 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal(cart: CartItem[], products: Product[]): number {
  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

export function toggleWishlistId(wishlist: number[], productId: number): number[] {
  if (wishlist.includes(productId)) {
    return wishlist.filter((id) => id !== productId);
  }
  return [...wishlist, productId];
}

export function validateDeliveryDetails(delivery: DeliveryDetails): {
  valid: boolean;
  errors: ValidationErrors;
} {
  const nameValid = delivery.name.trim().length > 1;
  const phoneDigits = delivery.phone.replace(/\D/g, '');
  const phoneValid = phoneDigits.length >= 10;
  const addressValid = delivery.address.trim().length > 5;

  return {
    valid: nameValid && phoneValid && addressValid,
    errors: {
      name: !nameValid,
      phone: !phoneValid,
      address: !addressValid,
    },
  };
}

export function buildWhatsAppOrderUrl(
  whatsappNumber: string,
  cart: CartItem[],
  products: Product[],
  delivery: DeliveryDetails,
): string {
  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      return `- ${product.name} x${item.qty} = ${formatTk(product.price * item.qty)}`;
    })
    .filter((line): line is string => Boolean(line))
    .join('\n');

  const total = formatTk(getCartTotal(cart, products));
  const message = [
    'Hello Bloomie! I would like to place an order.',
    '',
    lines,
    '',
    `Total: ${total}`,
    '',
    `Name: ${delivery.name.trim()}`,
    `Phone: ${delivery.phone.trim()}`,
    `Address: ${delivery.address.trim()}`,
  ].join('\n');

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_PERSISTED_STATE: PersistedStoreState = {
  cart: [],
  wishlist: [],
  delivery: {name: '', phone: '', address: ''},
};

export function parsePersistedState(
  raw: string | null,
  validProductIds: Set<number>,
): PersistedStoreState {
  if (!raw) return DEFAULT_PERSISTED_STATE;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedStoreState>;
    const cart = Array.isArray(parsed.cart)
      ? parsed.cart.filter(
          (item): item is CartItem =>
            typeof item?.id === 'number' &&
            validProductIds.has(item.id) &&
            typeof item?.qty === 'number' &&
            item.qty > 0,
        )
      : [];
    const wishlist = Array.isArray(parsed.wishlist)
      ? parsed.wishlist.filter(
          (id): id is number => typeof id === 'number' && validProductIds.has(id),
        )
      : [];
    const delivery: DeliveryDetails = {
      name: typeof parsed.delivery?.name === 'string' ? parsed.delivery.name : '',
      phone:
        typeof parsed.delivery?.phone === 'string' ? parsed.delivery.phone : '',
      address:
        typeof parsed.delivery?.address === 'string'
          ? parsed.delivery.address
          : '',
    };
    return {cart, wishlist, delivery};
  } catch {
    return DEFAULT_PERSISTED_STATE;
  }
}
