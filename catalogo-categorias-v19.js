/* EFFEN DESIGN — CATEGORIAS V19.1
   Corrige a associação dos produtos existentes às categorias e subcategorias.
   Não altera preços, carrinho, checkout, uploads, Supabase ou Eupago.
*/
(() => {
  "use strict";

  if (typeof products === "undefined" || !Array.isArray(products)) {
    console.error("Effen Design: catálogo não encontrado.");
    return;
  }

  const taxonomy = [
    { name: "Todos", subs: [] },
    { name: "Impressão 3D", subs: ["Nomes", "Porta-chaves", "Decoração", "Gaming", "Lightbox", "Sim Racing", "Troféus", "Natal", "Brinquedos", "Santinhos em 3D", "Outros produtos 3D"] },
    { name: "Laser", subs: ["Madeira", "Ardósia", "Acrílico", "Garrafas", "Placas", "Troféus", "Personalizados"] },
    { name: "Autocolantes", subs: ["Autocolantes personalizados", "Decalques", "Autocolantes para carros", "Autocolantes para empresas"] },
    { name: "DTF", subs: ["T-shirts", "Sweatshirts", "Sacos", "Equipas", "Empresas"] },
    { name: "Sublimação", subs: ["Canecas", "Garrafas", "Placas", "Outros"] },
    { name: "Personalizados", subs: ["Presentes", "Empresas", "Eventos", "Projetos especiais"] }
  ];

  // Associação explícita dos produtos atualmente existentes no loja.html.
  // A categoria principal e a subcategoria são ambas definidas aqui.
  const productMap = {
    1:  { cat: "Sublimação", subcat: "Canecas" },
    2:  { cat: "DTF", subcat: "T-shirts" },
    3:  { cat: "DTF", subcat: "Sweatshirts" },
    4:  { cat: "Impressão 3D", subcat: "Nomes" },
    5:  { cat: "Impressão 3D", subcat: "Porta-chaves" },
    6:  { cat: "Laser", subcat: "Ardósia" },
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
    17: { cat: "Laser", subcat: "Personalizados" }
  };

  products.forEach((p) => {
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
    return products.filter((p) => {
      const categoryMatch = activeCategory === "Todos" || p.cat === activeCategory;
      const subcategoryMatch = !activeSubcategory || p.subcat === activeSubcategory;
      const queryMatch = !q || [p.name, p.cat, p.subcat, p.desc].filter(Boolean).join(" ").toLowerCase().includes(q);
      return categoryMatch && subcategoryMatch && queryMatch;
    });
  }

  function render() {
    const selected = taxonomy.find((item) => item.name === activeCategory);
    const mainHtml = taxonomy.map((item) =>
      `<button type="button" data-v191-cat="${item.name}" class="${activeCategory === item.name ? "active" : ""}">${item.name}</button>`
    ).join("");

    const subHtml = selected && selected.subs.length
      ? `<div class="v191-sub-title">Explorar ${activeCategory}</div><div class="v191-sub-filters">${selected.subs.map((sub) =>
          `<button type="button" data-v191-sub="${sub}" class="${activeSubcategory === sub ? "active" : ""}">${sub}</button>`
        ).join("")}</div>`
      : "";

    filters.innerHTML = `<div class="v191-main-filters">${mainHtml}</div>${subHtml}`;

    filters.querySelectorAll("[data-v191-cat]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.v191Cat;
        activeSubcategory = "";
        render();
      });
    });

    filters.querySelectorAll("[data-v191-sub]").forEach((button) => {
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
  if (taxonomy.some((item) => item.name === requestedCategory)) {
    activeCategory = requestedCategory;
    if (requestedSubcategory && taxonomy.find((item) => item.name === activeCategory)?.subs.includes(requestedSubcategory)) {
      activeSubcategory = requestedSubcategory;
    }
  }

  render();
  console.info("Effen Design V19.1: categorias associadas.", products.map(p => ({id:p.id,name:p.name,cat:p.cat,subcat:p.subcat})));
})();
