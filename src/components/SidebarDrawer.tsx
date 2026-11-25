import {Heart, Info, ShoppingBag, Star, X} from 'lucide-react';

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = [
  {href: '#products', label: 'All Products', icon: ShoppingBag},
  {href: '#reviews', label: 'Reviews', icon: Star},
  {href: '#about', label: 'About Us', icon: Info},
  {href: '#why', label: 'Why Us', icon: Heart},
];

export function SidebarDrawer({open, onClose}: SidebarDrawerProps) {
  return (
    <aside
      aria-label="Menu"
      aria-hidden={!open}
      className={`fixed top-2.5 bottom-2.5 left-2.5 z-[70] flex w-[min(320px,86vw)] flex-col rounded-3xl border border-white/90 bg-gradient-to-b from-white/95 to-[#ffebf4]/90 p-5 shadow-[0_20px_50px_rgba(214,61,130,0.3)] backdrop-blur-2xl transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : '-translate-x-[115%]'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <img
          src="/assets/aistudio/Bloomie_logo_transparent_HD_0c88d81c.png"
          alt="Bloomie!"
          className="h-16 w-auto object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe3ef] text-[#d63d82] transition-colors hover:bg-[#ee5a9b] hover:text-white active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2.5" aria-label="Sidebar links">
        {LINKS.map(({href, label, icon: Icon}) => (
          <a
            key={href}
            href={href}
            onClick={onClose}
            className="flex min-h-[48px] items-center gap-3.5 rounded-2xl bg-white/70 px-4 py-3 text-base font-medium text-[#4a2036] transition-all hover:translate-x-1 hover:bg-[#ee5a9b] hover:text-white"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <p className="mt-auto pt-4 text-center font-display text-sm font-semibold text-[#d63d82]">
        Making Moments Bloom
      </p>
    </aside>
  );
}
