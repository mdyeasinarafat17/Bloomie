import {useCallback, useEffect, useRef, useState} from 'react';
import {ArrowRight, ChevronLeft, ChevronRight} from 'lucide-react';
import type {Product} from '../data/products';
import {formatTk} from '../utils/storeLogic';

interface HeroSliderProps {
  products: Product[];
}

interface SlideItem {
  isBrand?: boolean;
  name: string;
  price: number | null;
  img: string;
  tag: string;
}

export function HeroSlider({products}: HeroSliderProps) {
  const slides: SlideItem[] = [
    {
      isBrand: true,
      name: 'Welcome to Bloomie!',
      price: null,
      img: '/assets/aistudio/Bloomie_logo_transparent_HD_0c88d81c.png',
      tag: 'Welcome',
    },
    ...products.map((p) => ({
      name: p.name,
      price: p.price,
      img: p.img,
      tag: p.badge ?? 'New Arrival',
    })),
  ];

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const go = useCallback(
    (index: number) => {
      setCurrent(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const slide = slides[current];
  const slideDurationMs = slide.isBrand ? 10000 : 4800;

  useEffect(() => {
    const timer = setTimeout(() => {
      go(current + 1);
    }, slideDurationMs);
    return () => clearTimeout(timer);
  }, [current, go, slideDurationMs]);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <section
      id="hero"
      aria-label="Featured products"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 45) {
          go(current + (delta < 0 ? 1 : -1));
        }
      }}
      className="relative overflow-hidden bg-gradient-to-br from-[#fff5f9] via-[#ffe6f1] to-[#ffd8ea] pt-28 pb-10 sm:pt-40 sm:pb-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-12">
        <div className="relative min-h-[270px] sm:min-h-[370px] flex items-center justify-center">
          {slide.isBrand ? (
            <div
              key={slide.name}
              className="flex w-full flex-col items-center text-center"
            >
              <button
                type="button"
                onClick={scrollToProducts}
                aria-label="Welcome to Bloomie! Shop now"
                className="mb-3 sm:mb-4 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              >
                <img
                  src={slide.img}
                  alt="Bloomie! – Making Moments Bloom"
                  className="w-[210px] sm:w-[320px] md:w-[360px] h-auto object-contain drop-shadow-[0_14px_26px_rgba(214,61,130,0.28)]"
                />
              </button>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-[#4a2036] text-balance">
                {slide.name}
              </h1>
              <p className="font-display mt-1.5 mb-5 sm:mt-2.5 sm:mb-6 text-lg sm:text-2xl font-semibold text-[#d63d82]">
                Making Moments Bloom
              </p>

              <button
                type="button"
                onClick={scrollToProducts}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b] px-6 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(214,61,130,0.36)] transition-transform hover:translate-x-0.5 active:scale-95 whitespace-nowrap"
              >
                <span>Shop now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div key={slide.name} className="w-full">
              <div className="flex flex-row-reverse sm:flex-row items-center justify-between gap-4 sm:gap-10">
                <div className="min-w-0 flex-1 text-left">
                  <span className="inline-block text-xs font-semibold tracking-wide text-[#d63d82] mb-1.5 sm:mb-2">
                    {slide.tag}
                  </span>
                  <h1 className="font-display text-2xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-[#4a2036] text-balance">
                    {slide.name}
                  </h1>
                  <p className="font-display mt-2 mb-4 sm:mt-3 sm:mb-6 text-lg sm:text-3xl font-semibold tabular-nums text-[#d63d82]">
                    {slide.price ? formatTk(slide.price) : 'Making Moments Bloom'}
                  </p>
                  <button
                    type="button"
                    onClick={scrollToProducts}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-[#ff8fbf] to-[#ee5a9b] px-5 py-2.5 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_10px_24px_rgba(214,61,130,0.36)] transition-transform hover:translate-x-0.5 active:scale-95 whitespace-nowrap"
                  >
                    <span>Shop now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={scrollToProducts}
                  aria-label={`View ${slide.name}`}
                  className="w-[132px] sm:w-[290px] md:w-[340px] shrink-0 rounded-3xl border border-white bg-white/75 p-2 sm:p-3 shadow-[0_20px_48px_rgba(214,61,130,0.28)] transition-transform duration-300 hover:scale-[1.02]"
                >
                  <img
                    src={slide.img}
                    alt={slide.name}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop prev/next controls */}
      <button
        type="button"
        onClick={() => go(current - 1)}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white bg-white/70 text-[#d63d82] backdrop-blur-md shadow-sm transition-transform hover:scale-110 hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(current + 1)}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white bg-white/70 text-[#d63d82] backdrop-blur-md shadow-sm transition-transform hover:scale-110 hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Slide indicators">
        {slides.map((s, idx) => (
          <button
            key={s.name}
            type="button"
            aria-label={`Go to slide ${idx + 1}: ${s.name}`}
            aria-selected={idx === current}
            onClick={() => go(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-[#ee5a9b]' : 'w-2.5 bg-[#d63d82]/30'
            }`}
          />
        ))}
      </div>

      {/* Auto-advance progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40">
        <div
          key={current}
          className="h-full bg-[#ee5a9b] hero-bar-run"
          style={{animationDuration: `${slideDurationMs}ms`}}
        />
      </div>
    </section>
  );
}
