import {useEffect, useState} from 'react';
import {
  ArrowUp,
  Heart,
  Instagram,
  MessageCircle,
  Package,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  REVIEWS,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from '../data/products';

const STEPS = [
  {
    step: 1,
    title: 'Choose',
    desc: 'Pick your favourites and add them to the cart.',
    icon: ShoppingBag,
  },
  {
    step: 2,
    title: 'Check Cart',
    desc: 'Review quantity, total and add your delivery details.',
    icon: ShoppingCart,
  },
  {
    step: 3,
    title: 'Confirm on WhatsApp',
    desc: 'Send the ready-made order message to us. Done.',
    icon: MessageCircle,
  },
];

const WHY_ITEMS = [
  {
    title: 'Cute & Unique',
    desc: 'Designs you won’t find everywhere.',
    icon: Sparkles,
  },
  {
    title: 'Picked with Care',
    desc: 'Every piece is chosen with love.',
    icon: Heart,
  },
  {
    title: 'Safe Packaging',
    desc: 'Arrives neat and ready to gift.',
    icon: Package,
  },
  {
    title: 'Friendly Support',
    desc: 'Message us on WhatsApp anytime.',
    icon: MessageCircle,
  },
];

export function InfoSections() {
  const [igLabel, setIgLabel] = useState('Follow us on Instagram');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = ['Follow us on Instagram', INSTAGRAM_HANDLE];
    let wordIdx = 0;
    let charIdx = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentWord = words[wordIdx];
      setIgLabel(currentWord.slice(0, charIdx));
      if (!deleting && charIdx === currentWord.length) {
        deleting = true;
        timer = setTimeout(tick, 2200);
        return;
      }
      if (deleting && charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        timer = setTimeout(tick, 350);
        return;
      }
      charIdx += deleting ? -1 : 1;
      timer = setTimeout(tick, deleting ? 35 : 70);
    };

    timer = setTimeout(tick, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section id="how" className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="font-display text-center text-3xl sm:text-4xl font-bold text-[#d63d82] mb-2">
          How to Order
        </h2>
        <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b]" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STEPS.map(({step, title, desc, icon: Icon}) => (
            <div
              key={step}
              className="relative rounded-3xl border border-white/95 bg-white/65 px-5 pt-9 pb-6 text-center backdrop-blur-md shadow-[0_10px_28px_rgba(214,61,130,0.12)]"
            >
              <span className="font-display absolute -top-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff8fbf] to-[#ee5a9b] text-sm font-bold text-white shadow-md">
                {step}
              </span>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[#ffd0e4] text-[#d63d82] shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#4a2036]">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4a2036]/80">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="font-display text-center text-3xl sm:text-4xl font-bold text-[#d63d82] mb-2">
          Reviews
        </h2>
        <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b]" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {REVIEWS.map((review) => (
            <div
              key={review.quote}
              className="rounded-3xl border border-white/95 bg-white/65 p-6 text-center backdrop-blur-md shadow-[0_10px_28px_rgba(214,61,130,0.12)]"
            >
              <div
                className="mb-3 flex justify-center gap-1 text-[#f5a623]"
                aria-label="5 out of 5 stars"
              >
                {Array.from({length: 5}).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[#4a2036]">
                “{review.quote}”
              </p>
              <strong className="mt-3 block text-xs font-semibold text-[#d63d82]">
                {review.author}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="font-display text-center text-3xl sm:text-4xl font-bold text-[#d63d82] mb-2">
          About Us
        </h2>
        <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b]" />

        <div className="rounded-3xl border border-white/95 bg-white/65 p-6 sm:p-8 text-center backdrop-blur-md shadow-[0_10px_28px_rgba(214,61,130,0.12)]">
          <p className="text-base sm:text-lg leading-relaxed text-[#4a2036]">
            Bloomie! is all about tiny, pretty things that make your day brighter:
            hair clips, charms and keychains with flowers, bows and lots of love.
          </p>
          <p className="mt-3 font-display text-lg font-bold text-[#d63d82]">
            Making Moments Bloom
          </p>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="font-display text-center text-3xl sm:text-4xl font-bold text-[#d63d82] mb-2">
          Why Us
        </h2>
        <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b]" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {WHY_ITEMS.map(({title, desc, icon: Icon}) => (
            <div
              key={title}
              className="rounded-2xl sm:rounded-3xl border border-white/95 bg-white/65 p-4 sm:p-6 text-center backdrop-blur-md shadow-[0_10px_28px_rgba(214,61,130,0.12)] transition-transform hover:-translate-y-1"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[#ffd0e4] text-[#d63d82] shadow-sm">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#4a2036]">
                {title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#4a2036]/80">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 rounded-t-[32px] sm:rounded-t-[44px] bg-gradient-to-br from-[#ee5a9b] to-[#ff7fb3] px-5 pt-12 pb-[calc(24px+env(safe-area-inset-bottom))] text-white shadow-[0_-10px_40px_rgba(214,61,130,0.25)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/assets/aistudio/Bloomie_logo_transparent_HD_0c88d81c.png"
              alt="Bloomie!"
              className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_8px_18px_rgba(150,20,80,0.3)]"
            />
            <p className="font-script tagline-shine mt-3 text-3xl sm:text-4xl">
              Making Moments Bloom
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Bloomie on Instagram"
              className="mt-4 inline-flex items-center gap-3 rounded-full bg-white/95 py-2 pr-5 pl-2 text-[#4a2036] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
                <Instagram className="h-5 w-5" />
              </span>
              <span className="min-w-[172px] text-left text-sm font-semibold">
                {igLabel}
              </span>
            </a>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-white/95">
              <li>
                <a href="#products" className="hover:underline">
                  All Products
                </a>
              </li>
              <li>
                <a href="#how" className="hover:underline">
                  How to Order
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:underline">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#why" className="hover:underline">
                  Why Us
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-display text-xl font-bold mb-2">Order with us</h3>
            <p className="text-sm text-white/90 mb-4">
              Message us directly on WhatsApp
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] items-center gap-2.5 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-[#d63d82] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/35 pt-5 text-sm">
          <span>© {new Date().getFullYear()} Bloomie! All rights reserved.</span>
          <a
            href="#home"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/70 bg-white/20 px-4 py-1.5 text-xs font-semibold hover:bg-white/35"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Back to top</span>
          </a>
        </div>
      </footer>
    </>
  );
}
