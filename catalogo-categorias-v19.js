/* EFFEN DESIGN — CATEGORIAS V19.2
   Corrige a associação de TODOS os produtos da página Gravação Laser à categoria Laser.
   Mantém preços, carrinho, checkout, uploads, Supabase e Eupago.
*/
(() => {
  "use strict";

  if (typeof products === "undefined" || !Array.isArray(products)) {
    console.error("Effen Design: catálogo não encontrado.");
    return;
  }

  // Corrige os dois produtos laser já existentes no catálogo.
  const tabua = products.find(p => p.id === 6);
  if (tabua) {
    Object.assign(tabua, {
      ref: "EFF-LAS-MAD-001",
      cat: "Laser",
      name: "Tábua Pequena Personalizável",
      icon: "🪵",
      image: "images/laser_tabua_01.jpg",
      images: ["images/laser_tabua_01.jpg", "images/laser_tabua_02.jpg", "images/laser_tabua_03.jpg"],
      desc: "Tábua pequena em madeira com gravação laser personalizada. Texto, imagem e acabamento sob orçamento.",
      price: null,
      quote: true
    });
  }

  const fio = products.find(p => p.id === 17);
  if (fio) {
    Object.assign(fio, {
      cat: "Laser",
      name: "Fio Personalizável",
      image: "images/laser_fio_01.jpg",
      images: [
        "images/laser_fio_01.jpg", "images/laser_fio_02.jpg",
        "images/laser_fio_03.jpg", "images/laser_fio_04.jpg",
        "images/laser_fio_05.jpg", "images/laser_fio_06.jpg"
      ],
      desc: "Fio personalizado com gravação laser. Modelo e personalização sob consulta."
    });
  }

  // Produtos que já existem na galeria Gravação Laser, mas ainda não estavam na Loja.
  const laserProducts = [
    {
      id: 18, ref: "EFF-LAS-LEM-001", production: "Prazo a confirmar",
      cat: "Laser", subcat: "Personalizados", name: "Lembranças Personalizadas",
      icon: "🎁", image: "images/laser_lembrancas_01.jpg",
      images: [
        "images/laser_lembrancas_01.jpg", "images/laser_lembrancas_02.jpg",
        "images/laser_lembrancas_03.jpg", "images/laser_lembrancas_04.jpg",
        "images/laser_lembrancas_05.jpg", "images/laser_lembrancas_06.jpg",
        "images/laser_lembrancas_07.jpg", "images/laser_lembrancas_08.jpg"
      ],
      price: null,
      desc: "Lembranças personalizadas com gravação laser. Ideal para eventos, celebrações e ofertas.",
      quote: true
    },
    {
      id: 19, ref: "EFF-LAS-CAR-001", production: "Prazo a confirmar",
      cat: "Laser", subcat: "Personalizados", name: "Cartão de Visita em Alumínio",
      icon: "💳", image: "images/laser_cartao_1.png",
      images: ["images/laser_cartao_1.png", "images/laser_cartao_2.png", "images/laser_cartao_3.png"],
      price: null,
      desc: "Cartão de visita em alumínio com gravação laser personalizada. Acabamento e quantidade sob orçamento.",
      quote: true
    },
    {
      id: 20, ref: "EFF-LAS-PCH-001", production: "Prazo a confirmar",
      cat: "Laser", subcat: "Personalizados", name: "Porta-Chaves Personalizável",
      icon: "🔑", image: "images/laser_portachaves_1.png",
      images: ["images/laser_portachaves_1.png", "images/laser_portachaves_2.png", "images/laser_portachaves_3.png"],
      price: null,
      desc: "Porta-chaves personalizado com gravação laser. Imagem, texto e acabamento sob consulta.",
      quote: true
    },
    {
      id: 21, ref: "EFF-LAS-ARD-002", production: "Prazo a confirmar",
      cat: "Laser", subcat: "Ardósia", name: "Placa de Nomes em Ardósia",
      icon: "🪨", image: "images/laser-placa-nomes-1.jpg",
      images: [
        "images/laser-placa-nomes-1.jpg", "images/laser-placa-nomes-2.jpg",
        "images/laser-placa-nomes-3.jpg", "images/laser-placa-nomes-4.jpg"
      ],
      price: null,
      desc: "Placa de nomes em ardósia com gravação laser personalizada. Texto, desenho e dimensões sob orçamento.",
      quote: true
    }
  ];

  laserProducts.forEach(item => {
    if (!products.some(p => p.id === item.id)) products.push(item);
  });

  const taxonomy = [
    { name: "Todos", subs: [] },
    { name: "Impressão 3D", subs: ["Nomes", "Porta-chaves", "Decoração", "Gaming", "Lightbox", "Sim Racing", "Troféus", "Natal", "Brinquedos", "Santinhos em 3D", "Outros produtos 3D"] },
    { name: "Laser", subs: ["Madeira", "Ardósia", "Acrílico", "Garrafas", "Placas", "Troféus", "Personalizados"] },
    { name: "Autocolantes", subs: ["Autocolantes personalizados", "Decalques", "Autocolantes para carros", "Autocolantes para empresas"] },
    { name: "DTF", subs: ["T-shirts", "Sweatshirts", "Sacos", "Equipas", "Empresas"] },
    { name: "Sublimação", subs: ["Canecas", "Garrafas", "Placas", "Outros"] },
    { name: "Personalizados", subs: ["Presentes", "Empresas", "Eventos", "Projetos especiais"] }
  ];

  const productMap = {
    1:  { cat: "Sublimação", subcat: "Canecas" },
    2:  { cat: "DTF", subcat: "T-shirts" },
    3:  { cat: "DTF", subcat: "Sweatshirts" },
    4:  { cat: "Impressão 3D", subcat: "Nomes" },
    5:  { cat: "Impressão 3D", subcat: "Porta-chaves" },
    6:  { cat: "Laser", subcat: "Madeira" },
    7:  { cat: "Impressão 3D", subcat: "Lightbox" },
    8:  { cat: "Impressão 3D", subcat: "Troféus" },
    9:  { cat: "Sublimação", subcat: "Garrafas" },
    10: { cat: "Personalizados", subcat: "Projetos especiais" },
    11: { cat: "Impressão 3D", subcat: "Gaming" },
    12: { cat: "Impressão 3D", subcat: "Decoração" },
    13: { cat: "Impressão 3D", subcat: "Natal" },
    14: { cat: "Impressão 3D", subcat: "Brinquedos" },
    15: { cat: "Impressão 3D", subcat: "Nomes" },
    16: { cat: "Impressão 3D", subcat: "Santinhos em 3D" },
    17: { cat: "Laser", subcat: "Personalizados" },
    18: { cat: "Laser", subcat: "Personalizados" },
    19: { cat: "Laser", subcat: "Personalizados" },
    20: { cat: "Laser", subcat: "Personalizados" },
    21: { cat: "Laser", subcat: "Ardósia" }
  };

  products.forEach(p => {
    const mapped = productMap[p.id];
    if (mapped) {
      p.cat = mapped.cat;
      p.subcat = mapped.subcat;
    }
  });

  const filters = document.getElementById("filters");
  const productsNode = document.getElementById("products");
  if (!filters || !productsNode) {
    console.error("Effen Design: não foram encontrados os elementos do catálogo.");
    return;
  }

  const originalRenderProducts = renderProducts;
  let activeCategory = "Todos";
  let activeSubcategory = "";

  const style = document.createElement("style");
  style.textContent = `
    .v191-filter-groups{display:grid;gap:10px;margin:18px 0 22px}
    .v191-main-filters,.v191-sub-filters{display:flex;gap:8px;overflow-x:auto;padding:2px 1px 8px;scrollbar-width:thin}
    .v191-main-filters button,.v191-sub-filters button{white-space:nowrap;border:1px solid var(--border,rgba(230,184,55,.25));background:#111;color:#bbb;border-radius:30px;padding:10px 15px;font:600 11px 'DM Sans',sans-serif;cursor:pointer}
    .v191-main-filters button.active,.v191-sub-filters button.active{background:#e6b837;color:#080808;border-color:#e6b837}
    .v191-sub-title{font:10px 'Space Mono',monospace;color:#999;letter-spacing:1px;text-transform:uppercase}
    .v191-empty{grid-column:1/-1;padding:26px;border:1px solid rgba(230,184,55,.2);border-radius:10px;background:#111;color:#bbb;line-height:1.6}
    .v191-empty strong{display:block;color:#e6b837;margin-bottom:6px}
  `;
  document.head.appendChild(style);
  filters.classList.add("v191-filter-groups");

  function currentProducts() {
    const q = (document.getElementById("searchBox")?.value || "").trim().toLowerCase();
    return products.filter(p => {
      const categoryMatch = activeCategory === "Todos" || p.cat === activeCategory;
      const subcategoryMatch = !activeSubcategory || p.subcat === activeSubcategory;
      const queryMatch = !q || [p.name, p.cat, p.subcat, p.desc].filter(Boolean).join(" ").toLowerCase().includes(q);
      return categoryMatch && subcategoryMatch && queryMatch;
    });
  }

  function render() {
    const selected = taxonomy.find(item => item.name === activeCategory);
    const mainHtml = taxonomy.map(item =>
      `<button type="button" data-v191-cat="${item.name}" class="${activeCategory === item.name ? "active" : ""}">${item.name}</button>`
    ).join("");

    const subHtml = selected && selected.subs.length
      ? `<div class="v191-sub-title">Explorar ${activeCategory}</div><div class="v191-sub-filters">${selected.subs.map(sub =>
          `<button type="button" data-v191-sub="${sub}" class="${activeSubcategory === sub ? "active" : ""}">${sub}</button>`
        ).join("")}</div>`
      : "";

    filters.innerHTML = `<div class="v191-main-filters">${mainHtml}</div>${subHtml}`;

    filters.querySelectorAll("[data-v191-cat]").forEach(button => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.v191Cat;
        activeSubcategory = "";
        render();
      });
    });

    filters.querySelectorAll("[data-v191-sub]").forEach(button => {
      button.addEventListener("click", () => {
        activeSubcategory = activeSubcategory === button.dataset.v191Sub ? "" : button.dataset.v191Sub;
        render();
      });
    });

    const list = currentProducts();
    if (!list.length) {
      const isAutocolantes = activeCategory === "Autocolantes";
      productsNode.innerHTML = `<div class="v191-empty"><strong>${isAutocolantes ? "Autocolantes — catálogo em preparação" : "Ainda não existem produtos nesta subcategoria."}</strong>${isAutocolantes ? "A categoria está preparada para receber autocolantes e decalques produzidos com a xTool M2." : "Esta subcategoria está criada, mas ainda não tem produtos associados no catálogo."}</div>`;
      return;
    }

    originalRenderProducts(list);
    productsNode.querySelectorAll(".product").forEach((card, index) => {
      const p = list[index];
      const label = card.querySelector(".cat");
      if (label && p) label.textContent = p.subcat ? `${p.cat} · ${p.subcat}` : p.cat;
    });
  }

  const search = document.getElementById("searchBox");
  if (search) search.addEventListener("input", render);

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("categoria");
  const requestedSubcategory = params.get("subcategoria");
  if (taxonomy.some(item => item.name === requestedCategory)) {
    activeCategory = requestedCategory;
    if (requestedSubcategory && taxonomy.find(item => item.name === activeCategory)?.subs.includes(requestedSubcategory)) {
      activeSubcategory = requestedSubcategory;
    }
  }

  render();
  console.info("Effen Design V19.2: produtos laser associados.", products.filter(p => p.cat === "Laser"));
})();
