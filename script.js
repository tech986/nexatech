/* ====== DATA PRODUK (edit sesuai kebutuhan) ====== */
const PRODUCTS = [
      {  
  id: 1,
    name: "INFINIX Note 50 PRO 5G",
    price: 2783040,
    price_before: 3200000,
    sold: 3800,
    image: "./images/handphone.jpg",   // harus ada di /images
    url: "https://s.shopee.co.id/6VHeDfCAK7"       // ganti ke link Shopee produkmu
  },
       {  
  id: 2,
    name: "INFINIX GT 30 PRO",
    price: 3658550,
    price_before: 3800000,
    sold: 3000,
    image: "./images/hp2.jpg",   // harus ada di /images
    url: "https://s.shopee.co.id/7KqlDWQcoR"       // ganti ke link Shopee produkmu
  },
        {  id: 3,
    name: "CAMON 40 PRO",
    price: 3840000,
    price_before: 4127000,
    sold: 10000,
    image: "./images/hp3.jpg",   // harus ada di /images
    url: "https://s.shopee.co.id/5VP72PVbr6"       // ganti ke link Shopee produkmu
  },
        {id: 4,
    name: "IP 11 PRO/PRO MAX",
    price: 3620000,
    price_before: 3762000,
    sold: 116,
    image: "./images/hp4.jpg",   // harus ada di /images
    url: "https://s.shopee.co.id/9AIPPJi8Oe"       // ganti ke link Shopee produkmu
  },
];

/* ====== UTIL ====== */
const $  = (s, el=document)=>el.querySelector(s);
const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
const toRupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const PLACEHOLDER = "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='800' height='880'>\
<rect width='100%' height='100%' fill='%23f3f4f6'/>\
<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='22' font-family='Arial'>Gambar tidak ditemukan</text>\
</svg>";

/* ====== RENDER KARTU ====== */
function render(list){
  const grid = $("#grid");
  grid.innerHTML = "";
  const tpl = $("#cardTpl");

  list.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    const a   = node.querySelector(".card");
    const img = node.querySelector("img");
    const shim= node.querySelector(".shimmer");

    a.href = p.url || "#";
    img.src = p.image || PLACEHOLDER;
    img.alt = `${p.id}. ${p.name}`;
    img.onload  = () => (shim.style.display = "none");
    img.onerror = () => { console.warn("Gagal muat gambar:", img.src); img.src = PLACEHOLDER; shim.style.display="none"; };

    node.querySelector(".name").textContent  = `${p.id}. ${p.name}`;
    node.querySelector(".price").textContent = toRupiah(p.price);

    if (p.price_before && p.price_before > p.price){
      const strike = node.querySelector(".strike");
      strike.hidden = false;
      strike.textContent = toRupiah(p.price_before);
      const d = Math.round((1 - p.price / p.price_before) * 100);
      const disc = node.querySelector(".discount");
      disc.hidden = false; disc.textContent = `-${d}%`;
    }

    node.querySelector(".sold").textContent = `Terjual ${p.sold ?? 0}`;
    grid.appendChild(node);
  });

  if (!list.length){
    grid.innerHTML = `<p style="grid-column:1/-1;color:#6b7280">Tidak ada produk.</p>`;
  }
}

/* ====== FILTER, SORT, EVENTS ====== */
function filterByText(q){
  q = q.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(p => String(p.id).includes(q) || p.name.toLowerCase().includes(q));
}
function filterByRange(min,max){
  const a = Number(min) || -Infinity, b = Number(max) || Infinity;
  return PRODUCTS.filter(p => p.id >= a && p.id <= b);
}
function sortList(list, key){
  const cp=[...list];
  if(key==="id-desc")cp.sort((a,b)=>b.id-a.id);
  if(key==="id-asc")cp.sort((a,b)=>a.id-b.id);
  if(key==="price-asc")cp.sort((a,b)=>a.price-b.price);
  if(key==="price-desc")cp.sort((a,b)=>b.price-a.price);
  return cp;
}

document.addEventListener("DOMContentLoaded", ()=>{
  let current = sortList(PRODUCTS, "id-desc");
  render(current);

  const input=$("#searchInput"), clear=$("#clearBtn");
  let t;
  input.addEventListener("input", ()=>{
    clearTimeout(t);
    t=setTimeout(()=>{ current = sortList(filterByText(input.value), $("#sortSel").value); render(current); },100);
  });
  clear.addEventListener("click", ()=>{ input.value=""; input.dispatchEvent(new Event("input")); input.focus(); });

  $$(".range-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const {min,max}=btn.dataset;
      const base=(min&&max)?filterByRange(min,max):PRODUCTS;
      current=sortList(base,$("#sortSel").value);
      render(current);
      window.scrollTo({top:0,behavior:"smooth"});
    });
  });

  $("#sortSel").addEventListener("change", e=>{
    current=sortList(current,e.target.value);
    render(current);
  });

  const toTop=$("#toTop");
  window.addEventListener("scroll", ()=> window.scrollY>500?toTop.classList.add("show"):toTop.classList.remove("show"));
  toTop.addEventListener("click", ()=> window.scrollTo({top:0,behavior:"smooth"}));
});
