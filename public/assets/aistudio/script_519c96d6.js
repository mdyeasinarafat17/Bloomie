// ===== Edit your products here (name, price, image, category, description) =====
const products = [
  { id: 1, name: "Pink Bow Hair Clips (Set of 4)", price: 350, img: "images/bow-clips.png",      cat: "Hair Clips", desc: "Four cute dotted bow clips in soft and bright pinks. Perfect for everyday looks and gifts." },
  { id: 2, name: "Tulip Bouquet Keychain Charm",   price: 450, img: "images/tulip-keychain.png", cat: "Keychains",  desc: "A tiny tulip bouquet with a love letter and strawberry charm. Hang it on your bag or keys." },
  { id: 3, name: "Water Lily Hair Clips (Pair)",   price: 400, img: "images/lily-clips.png",     cat: "Hair Clips", desc: "Pretty pink water lily clips on green lily pads. A little pond of flowers for your hair." }
];
const WHATSAPP = "8801834163007"; // country code, no +

const $ = id => document.getElementById(id);
const tk = n => "৳" + n;
const ic = (n, c = "") => `<svg class="ic ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
let cart = [], wish = new Set(), cat = "All", query = "", sortBy = "featured";

if (/Chrome|Edg/.test(navigator.userAgent) && !/Firefox/.test(navigator.userAgent)) document.documentElement.classList.add("liquid");

// ---------- Navbar ----------
const nav = $("nav");
nav.addEventListener("pointermove", e => {
  const r = nav.getBoundingClientRect();
  nav.style.setProperty("--mx", (e.clientX - r.left) + "px");
  nav.style.setProperty("--my", (e.clientY - r.top) + "px");
});
addEventListener("scroll", () => {
  nav.classList.toggle("small", scrollY > 60);
  $("prog").style.width = (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100) + "%";
}, { passive: true });

// ---------- Products: category, sort, search ----------
const cats = ["All", ...new Set(products.map(p => p.cat))];
$("chips").innerHTML = cats.map(c => `<button class="chip ${c === cat ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
$("chips").onclick = e => {
  const c = e.target.dataset.c; if (!c) return;
  cat = c; document.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b.dataset.c === c)); renderGrid();
};
$("sort").onchange = e => { sortBy = e.target.value; renderGrid(); };
function renderGrid() {
  const q = query.toLowerCase();
  let list = products.filter(p => (cat === "All" || p.cat === cat) && (p.name + " " + p.cat).toLowerCase().includes(q));
  if (sortBy === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sortBy === "high") list = [...list].sort((a, b) => b.price - a.price);
  $("grid").innerHTML = list.map((p, i) => `
    <article class="card" id="p${p.id}" style="animation-delay:${i * .08}s">
      <div class="pic" onclick="openModal(${p.id})"><img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="badge">New</span>
        <button class="heart ${wish.has(p.id) ? "on" : ""}" onclick="event.stopPropagation();toggleWish(${p.id},this)" aria-label="Add to wishlist">${ic("heart")}</button></div>
      <div class="info"><span class="cat">${p.cat}</span><h3>${p.name}</h3>
        <div class="row"><span class="price">${tk(p.price)}</span><button class="btn" onclick="addToCart(${p.id},event)">${ic("cart")}Add to Cart</button></div></div>
    </article>`).join("");
  $("empty").hidden = list.length > 0;
  document.querySelectorAll(".card").forEach(c => {
    c.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    c.addEventListener("pointerleave", () => c.style.transform = "");
  });
}
const input = $("searchInput"), sug = $("suggest");
input.addEventListener("input", () => {
  query = input.value.trim(); renderGrid();
  if (!query) return sug.classList.remove("show");
  const q = query.toLowerCase(), hits = products.filter(p => (p.name + " " + p.cat).toLowerCase().includes(q));
  sug.innerHTML = hits.length
    ? hits.map(p => `<a href="#p${p.id}"><img src="${p.img}" alt=""><span>${p.name}<small>${tk(p.price)}</small></span></a>`).join("")
    : "<p>No products found</p>";
  sug.classList.add("show");
});
sug.addEventListener("click", e => { if (e.target.closest("a")) { sug.classList.remove("show"); input.blur(); } });
document.addEventListener("click", e => { if (!$("search").contains(e.target)) sug.classList.remove("show"); });
input.addEventListener("keydown", e => { if (e.key === "Enter") { sug.classList.remove("show"); $("products").scrollIntoView(); input.blur(); } });
$("search").addEventListener("click", () => input.focus());
$("clearSearch").onclick = () => { input.value = ""; query = ""; cat = "All"; $("sort").value = sortBy = "featured"; document.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b.dataset.c === "All")); renderGrid(); };

// ---------- Hero banner ----------
const slides = [{ brand: true, name: "Welcome to Bloomie!", price: null, img: products[0].img, tag: "Welcome" },
                ...products.map(p => ({ name: p.name, price: p.price, img: p.img, tag: "New Arrival" }))];
let cur = 0, timer;
$("slides").innerHTML = slides.map((s, i) => `
  <div class="slide ${i ? "" : "active"}"><div class="bgimg" style="background-image:url('${s.img}')"></div>
    <div class="copy"><span class="tag">${s.tag}</span><h1>${s.name}</h1>
      <div class="hp">${s.price ? tk(s.price) : "Making Moments Bloom"}</div><span class="cta">Shop now${ic("arrow")}</span></div>
    ${s.brand ? '<div class="frame brand"><img data-logo src="images/logo.png" alt="Bloomie!"></div>' : `<div class="frame"><img src="${s.img}" alt="${s.name}"></div>`}</div>`).join("");
$("dots").innerHTML = slides.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("");
function go(i) {
  cur = (i + slides.length) % slides.length;
  document.querySelectorAll(".slide").forEach((el, k) => el.classList.toggle("active", k === cur));
  document.querySelectorAll(".dots i").forEach((el, k) => el.classList.toggle("on", k === cur));
  const b = $("bar"); b.classList.remove("run"); void b.offsetWidth; b.classList.add("run");
  clearTimeout(timer); timer = setTimeout(() => go(cur + 1), 4500);
}
go(0);
$("prev").onclick = e => { e.stopPropagation(); go(cur - 1); };
$("next").onclick = e => { e.stopPropagation(); go(cur + 1); };
$("hero").addEventListener("click", () => $("products").scrollIntoView());
let sx = 0;
$("hero").addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
$("hero").addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) go(cur + (d < 0 ? 1 : -1)); });

// ---------- Drawers & modal ----------
const overlay = $("overlay");
function closeAll() { ["sidebar", "cart"].forEach(i => $(i).classList.remove("open")); overlay.classList.remove("show"); $("modal").classList.remove("show"); }
$("menuBtn").onclick = () => { $("sidebar").classList.add("open"); overlay.classList.add("show"); };
$("cartBtn").onclick = () => { $("cart").classList.add("open"); overlay.classList.add("show"); };
$("closeMenu").onclick = $("closeCart").onclick = overlay.onclick = closeAll;
document.querySelectorAll(".side-nav a").forEach(a => a.addEventListener("click", closeAll));
addEventListener("keydown", e => e.key === "Escape" && closeAll());
function openModal(id) {
  const p = products.find(x => x.id === id);
  $("modalBox").innerHTML = `<button class="x" onclick="closeAll()" aria-label="Close">&times;</button><img src="${p.img}" alt="${p.name}">
    <div><span class="cat" style="color:var(--pink-d)">${p.cat}</span><h2>${p.name}</h2><span class="price">${tk(p.price)}</span><p>${p.desc}</p>
    <button class="btn" onclick="addToCart(${p.id},event);closeAll()">${ic("cart")}Add to Cart</button></div>`;
  $("modal").classList.add("show");
}
$("modal").addEventListener("click", e => { if (e.target.id === "modal") closeAll(); });

// ---------- Wishlist & toast ----------
function toggleWish(id, el) { wish.has(id) ? wish.delete(id) : wish.add(id); el.classList.toggle("on"); toast(wish.has(id) ? "Added to wishlist" : "Removed from wishlist"); }
let tt; function toast(m) { const t = $("toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2000); }

// ---------- Cart ----------
function addToCart(id, ev) {
  const it = cart.find(c => c.id === id); it ? it.qty++ : cart.push({ id, qty: 1 });
  renderCart(); toast("Added to cart");
  const card = ev && ev.target.closest && (ev.target.closest(".card") || ev.target.closest(".modal-box"));
  const img = card && card.querySelector("img");
  if (img) {
    const a = img.getBoundingClientRect(), b = $("cartBtn").getBoundingClientRect();
    const f = img.cloneNode(); Object.assign(f.style, { position: "fixed", left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.width + "px", borderRadius: "20px", zIndex: 100, pointerEvents: "none", objectFit: "cover" });
    document.body.appendChild(f);
    f.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${b.left - a.left + 10}px,${b.top - a.top}px) scale(.08)`, opacity: .4 }], { duration: 750, easing: "cubic-bezier(.6,-.2,.7,1)" }).onfinish = () => f.remove();
  }
  const c = $("cartCount"); c.classList.add("pop"); setTimeout(() => c.classList.remove("pop"), 300);
}
function changeQty(id, d) { const it = cart.find(c => c.id === id); it.qty += d; if (it.qty <= 0) cart = cart.filter(c => c.id !== id); renderCart(); }
function renderCart() {
  $("cartCount").textContent = cart.reduce((n, c) => n + c.qty, 0);
  let total = 0;
  $("cartItems").innerHTML = cart.length ? cart.map(c => {
    const p = products.find(x => x.id === c.id); total += p.price * c.qty;
    return `<div class="ci"><img src="${p.img}" alt=""><div><span class="ci-name">${p.name}</span><b>${tk(p.price)}</b>
      <div class="qty"><button onclick="changeQty(${p.id},-1)" aria-label="Decrease">&minus;</button><span>${c.qty}</span><button onclick="changeQty(${p.id},1)" aria-label="Increase">+</button></div></div></div>`;
  }).join("") : `<div class="emptycart">${ic("cart")}<p>Your cart is empty</p><button class="btn" onclick="closeAll();$('products').scrollIntoView()">Browse products</button></div>`;
  $("cartTotal").textContent = tk(total);
  $("cartForm").hidden = !cart.length;
}
["fName", "fPhone", "fAddr"].forEach(i => $(i).addEventListener("input", e => e.target.classList.remove("err")));
$("checkout").onclick = () => {
  if (!cart.length) return toast("Your cart is empty");
  const rules = [["fName", v => v.trim().length > 1], ["fPhone", v => v.replace(/\D/g, "").length >= 10], ["fAddr", v => v.trim().length > 5]];
  let ok = true; rules.forEach(([id, f]) => { const g = f($(id).value); $(id).classList.toggle("err", !g); if (!g) ok = false; });
  if (!ok) return toast("Please fill in your name, phone and address");
  const lines = cart.map(c => { const p = products.find(x => x.id === c.id); return `- ${p.name} x${c.qty} = ${tk(p.price * c.qty)}`; }).join("\n");
  const msg = `Hello Bloomie! I would like to place an order.\n\n${lines}\n\nTotal: ${$("cartTotal").textContent}\n\nName: ${$("fName").value.trim()}\nPhone: ${$("fPhone").value.trim()}\nAddress: ${$("fAddr").value.trim()}`;
  window.open(`https://wa.me/${WHATSAPP}?text=` + encodeURIComponent(msg), "_blank");
};

// ---------- Reviews stars, reveal, loader ----------
document.querySelectorAll(".stars").forEach(s => s.innerHTML = ic("star", "fill").repeat(5));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * .08 + "s"; io.observe(el); });
const hideLoader = () => $("loader").classList.add("done");
addEventListener("load", () => setTimeout(hideLoader, 1300));
setTimeout(hideLoader, 3000);
// on phones, tuck the floating WhatsApp button away while browsing products so it never covers "Add to Cart"
new IntersectionObserver(es => document.querySelector(".wa-float").classList.toggle("away", es[0].isIntersecting && innerWidth < 760), { threshold: 0.05 }).observe($("grid"));
// Instagram button: typing text loop (static text if the visitor prefers reduced motion)
(() => {
  const el = $("igText"), words = ["Follow us on Instagram", "@_.bloom.ie_"];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let w = 0, n = words[0].length, del = true;
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, n);
    if (!del && n === word.length) { del = true; return setTimeout(tick, 2200); }
    if (del && n === 0) { del = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
    n += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
  // the first pass starts by showing the full text, then deleting it
})();
$("year").textContent = new Date().getFullYear();
renderGrid(); renderCart();
