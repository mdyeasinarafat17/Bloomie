import test from 'node:test';
import assert from 'node:assert/strict';
import {PRODUCTS} from '../data/products';
import {
  addCartItem,
  buildWhatsAppOrderUrl,
  filterAndSortProducts,
  getCartCount,
  getCartTotal,
  getCategories,
  parsePersistedState,
  toggleWishlistId,
  updateCartItemQty,
  validateDeliveryDetails,
} from './storeLogic';

test('getCategories returns All plus unique product categories', () => {
  assert.deepEqual(getCategories(PRODUCTS), ['All', 'Hair Clips', 'Keychains']);
});

test('filterAndSortProducts filters by category and search query and sorts by price', () => {
  const clips = filterAndSortProducts(PRODUCTS, 'Hair Clips', '', 'low');
  assert.deepEqual(
    clips.map((p) => p.id),
    [1, 3],
  );

  const tulip = filterAndSortProducts(PRODUCTS, 'All', 'tulip', 'featured');
  assert.deepEqual(
    tulip.map((p) => p.id),
    [2],
  );

  const high = filterAndSortProducts(PRODUCTS, 'All', '', 'high');
  assert.deepEqual(
    high.map((p) => p.price),
    [450, 400, 350],
  );
});

test('cart mutations add, increment, decrement, remove, and compute totals', () => {
  let cart = addCartItem([], 1);
  cart = addCartItem(cart, 1);
  cart = addCartItem(cart, 2);
  assert.equal(getCartCount(cart), 3);
  assert.equal(getCartTotal(cart, PRODUCTS), 350 * 2 + 450);

  cart = updateCartItemQty(cart, 1, -1);
  assert.equal(getCartCount(cart), 2);

  cart = updateCartItemQty(cart, 1, -1);
  assert.deepEqual(cart, [{id: 2, qty: 1}]);
});

test('toggleWishlistId adds and removes product IDs cleanly', () => {
  const added = toggleWishlistId([], 2);
  assert.deepEqual(added, [2]);
  const removed = toggleWishlistId(added, 2);
  assert.deepEqual(removed, []);
});

test('validateDeliveryDetails checks name, >=10 digit phone, and address length', () => {
  const invalid = validateDeliveryDetails({name: 'A', phone: '123', address: 'Dhaka'});
  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.errors, {name: true, phone: true, address: true});

  const valid = validateDeliveryDetails({
    name: 'Nadia Rahman',
    phone: '+880 1834-163007',
    address: 'House 12, Road 4, Dhanmondi, Dhaka',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {name: false, phone: false, address: false});
});

test('buildWhatsAppOrderUrl encodes order summary and delivery info', () => {
  const url = buildWhatsAppOrderUrl(
    '8801834163007',
    [{id: 1, qty: 2}],
    PRODUCTS,
    {name: 'Nadia', phone: '01834163007', address: 'Dhanmondi 27, Dhaka'},
  );
  assert.ok(url.startsWith('https://wa.me/8801834163007?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.ok(decoded.includes('Pink Bow Hair Clips (Set of 4) x2 = ৳700'));
  assert.ok(decoded.includes('Total: ৳700'));
  assert.ok(decoded.includes('Name: Nadia'));
});

test('parsePersistedState safely recovers valid state and ignores corrupted data', () => {
  const validIds = new Set(PRODUCTS.map((p) => p.id));
  const good = parsePersistedState(
    JSON.stringify({
      cart: [
        {id: 2, qty: 2},
        {id: 999, qty: 1},
      ],
      wishlist: [1, 999],
      delivery: {name: 'Sara', phone: '01711223344', address: 'Banani, Dhaka'},
    }),
    validIds,
  );
  assert.deepEqual(good.cart, [{id: 2, qty: 2}]);
  assert.deepEqual(good.wishlist, [1]);
  assert.equal(good.delivery.name, 'Sara');

  const bad = parsePersistedState('{not-json', validIds);
  assert.deepEqual(bad, {
    cart: [],
    wishlist: [],
    delivery: {name: '', phone: '', address: ''},
  });
});
