/* EFFEN DESIGN — CATEGORIAS V19
   Reorganiza a navegação do catálogo sem alterar carrinho, checkout,
   uploads, Supabase ou integração Eupago.
*/
(() => {
  "use strict";

  if (!Array.isArray(products)) {
    console.error("Effen Design: catálogo não encontrado.");
    return;
  }

  const byId = {
    4: "Nomes",
    5: "Porta-chaves",
    15: "Nomes",
    7: "Lightbox",
    8: "Sim Racing",
    11: "Gaming",
    12: "Decoração",
    13: "Natal",
    14: "Brinquedos",
    16: "Santinhos em 3D"
  };

  // Lightbox, Sim Racing e restantes linhas indicadas passam para Impressão 3D.
  products.forEach((p) => {
    if (byId[p.id]) {
      p.cat = "Impressão 3D";
      p.subcat = byId[p.id];
    } else if (p.cat === "Impressão 3D" && !p.subcat) {
      p.subcat = "Outros produtos 3D";
    }
  });

  const taxonomy = [
    { name: "Todos", subs: [] },
    { name: "Impressão 3D", subs: ["Nomes", "Porta-chaves", "Decoração", "Gaming", "Lightbox", "Sim Racing", "Troféus", "Natal", "Brinquedos", "Santinhos em 3D", "Outros produtos 3D"] },
    { name: "Laser", subs: ["Madeira", "Ardósia", "Acrílico", "Garrafas", "Placas", "Troféus"] },
    { name: "Autocolantes", subs: ["Autocolantes personalizados", "Decalques", "Autocolantes para carros", "Autocolantes para empresas"] },
    { name: "DTF", subs: ["T-shirts", "Sweatshirts", "Sacos", "Equipas", "Empresas"] },
    { name: "Sublimação", subs: ["Canecas", "Garrafas", "Placas", "Outros"] },
    { name: "Personalizados", subs: ["Presentes", "Empresas", "Eventos", "Projetos especiais"] }
  ];

  let activeCategory = "Todos";
  let activeSubcategory = "";

  const filters = document.getElementById("filters");
  const productsNode = document.getElementById("products");
  if (!filters || !productsNode) return;

  const style = document.createElement("style");
  style.textContent = `
    .v19-filter-groups{display:grid;gap:10px;margin:18px 0 22px}
    .v19-main-filters,.v19-sub-filters{display:flex;gap:8px;overflow-x:auto;padding:2px 1px 8px;scrollbar-width:thin}
    .v19-main-filters button,.v19-sub-filters button{white-space:nowrap;border:1px solid var(--border,rgba(230,184,55,.25));background:#111;color:#bbb;border-radius:30px;padding:10px 15px;font:600 11px 'DM Sans',sans-serif;cursor:pointer}
    .v19-main-filters button.active,.v19-sub-filters button.active{background:#e6b837;color:#080808;border-color:#e6b837}
    .v19-sub-title{font:10px 'Space Mono',monospace;color:#999;letter-spacing:1px;text-transform:uppercase}
    .v19-empty{grid-column:1/-1;padding:26px;border:1px solid rgba(230,184,55,.2);border-radius:10px;background:#111;color:#bbb;line-height:1.6}
    .v19-empty strong{display:block;color:#e6b837;margin-bottom:6px}
  `;
  document.head.appendChild(style);

  filters.classList.add("v19-filter-groups");

  function currentProducts() {
    const q = (document.getElementById("searchBox")?.value || "").trim().toLowerCase();
    let list = products.filter((p) => {
      const categoryMatch = activeCategory === "Todos" || p.cat === activeCategory;
      const subcategoryMatch = !activeSubcategory || p.subcat === activeSubcategory;
      return categoryMatch && subcategoryMatch;
    });
    if (q) {
      list = list.filter((p) =>
        [p.name, p.cat, p.subcat, p.desc].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    return list;
  }

  function render() {
    const main = taxonomy.map((item) =>
      `<button type="button" data-v19-cat="${item.name}" class="${activeCategory === item.name ? "active" : ""}">${item.name}</button>`
    ).join("");

    const selected = taxonomy.find((item) => item.name === activeCategory);
    const subs = selected && selected.subs.length
      ? `<div class="v19-sub-title">Explorar ${activeCategory}</div><div class="v19-sub-filters">${selected.subs.map((sub) =>
          `<button type="button" data-v19-sub="${sub}" class="${activeSubcategory === sub ? "active" : ""}">${sub}</button>`
        ).join("")}</div>`
      : "";

    filters.innerHTML = `<div class="v19-main-filters">${main}</div>${subs}`;

    filters.querySelectorAll("[data-v19-cat]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.v19Cat;
        activeSubcategory = "";
        render();
      });
    });

    filters.querySelectorAll("[data-v19-sub]").forEach((button) => {
      button.addEventListener("click", () => {
        activeSubcategory = activeSubcategory === button.dataset.v19Sub ? "" : button.dataset.v19Sub;
        render();
      });
    });

    const list = currentProducts();
    if (!list.length) {
      const isAutocolantes = activeCategory === "Autocolantes";
      productsNode.innerHTML = `<div class="v19-empty"><strong>${isAutocolantes ? "Autocolantes — catálogo em preparação" : "Ainda não existem produtos nesta seleção."}</strong>${isAutocolantes ? "A categoria fica criada para receber os autocolantes e decalques produzidos com a xTool M2. Os artigos serão adicionados quando estiverem definidos." : "Experimenta outra subcategoria ou pesquisa no catálogo."}</div>`;
      return;
    }

    // Reutiliza o renderizador original da loja e acrescenta a subcategoria,
    // sem alterar a lógica dos produtos, preços ou carrinho.
    originalRenderProducts(list);
    productsNode.querySelectorAll(".product").forEach((card, index) => {
      const p = list[index];
      const label = card.querySelector(".cat");
      if (label && p?.subcat) label.textContent = `${p.cat} · ${p.subcat}`;
    });
  }

  const originalRenderProducts = window.renderProducts;
  if (typeof originalRenderProducts !== "function") {
    console.error("Effen Design: renderizador original não encontrado.");
    return;
  }

  // Apresenta a categoria e subcategoria no detalhe do produto.
  const originalOpenProduct = window.openProduct;
  if (typeof originalOpenProduct === "function") {
    window.openProduct = function (id) {
      originalOpenProduct(id);
      const p = products.find((item) => item.id === id);
      const label = document.getElementById("mcat");
      if (label && p) label.textContent = p.subcat ? `${p.cat} · ${p.subcat}` : p.cat;
    };
  }

  const search = document.getElementById("searchBox");
  if (search) search.addEventListener("input", render);

  // Permite abrir a loja diretamente numa categoria/subcategoria a partir da homepage.
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
})();
