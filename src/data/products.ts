export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  cat: string;
  desc: string;
  badge?: string;
}

export const WHATSAPP_NUMBER = '8801834163007';
export const WHATSAPP_DISPLAY = '+880 1834-163007';
export const INSTAGRAM_HANDLE = '@_.bloom.ie_';
export const INSTAGRAM_URL = 'https://www.instagram.com/_.bloom.ie_/';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pink Bow Hair Clips (Set of 4)',
    price: 350,
    img: '/assets/aistudio/Screenshot_2026-11-24_172254_eaef3379.png',
    cat: 'Hair Clips',
    desc: 'Four cute dotted bow clips in soft and bright pinks. Perfect for everyday looks and gifts.',
    badge: 'New',
  },
  {
    id: 2,
    name: 'Tulip Bouquet Keychain Charm',
    price: 450,
    img: '/assets/aistudio/Screenshot_2026-11-24_172156_64054222.png',
    cat: 'Keychains',
    desc: 'A tiny tulip bouquet with a love letter and strawberry charm. Hang it on your bag or keys.',
    badge: 'Bestseller',
  },
  {
    id: 3,
    name: 'Water Lily Hair Clips (Pair)',
    price: 400,
    img: '/images/lily-clips.svg',
    cat: 'Hair Clips',
    desc: 'Pretty pink water lily clips on green lily pads. A little pond of flowers for your hair.',
    badge: 'New',
  },
];

export const REVIEWS = [
  {
    quote: 'So cute! The bow clips look even prettier in real life.',
    author: 'Happy customer',
  },
  {
    quote: 'The tulip keychain looks perfect on my bag.',
    author: 'Happy customer',
  },
  {
    quote: 'Lovely packaging and quick delivery.',
    author: 'Happy customer',
  },
];
