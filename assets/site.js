(() => {
  document.documentElement.classList.add("js");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  const closeMenu = () => {
    toggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("is-open");
  };
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  const tools = document.querySelector(".publication-tools");
  if (!tools) return;
  tools.hidden = false;
  const items = [...document.querySelectorAll(".publication-record")];
  const filters = [...document.querySelectorAll(".filter")];
  const input = document.querySelector("#publication-search");
  const clear = document.querySelector(".clear-search");
  let active = "all";
  const apply = () => {
    const words = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    items.forEach(item => {
      const text = item.textContent.toLocaleLowerCase();
      const visible = (active === "all" || item.dataset.type === active) && words.every(word => text.includes(word));
      item.hidden = !visible;
      if (visible) count++;
    });
    filters.forEach(button => {
      const selected = button.dataset.filter === active;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("active", selected);
    });
    document.querySelector(".result-count").textContent = `${count} ${count === 1 ? "contribution" : "contributions"}`;
    document.querySelector(".empty-state").hidden = count > 0;
    clear.hidden = !input.value;
  };
  filters.forEach(button => button.addEventListener("click", () => {
    active = button.dataset.filter;
    apply();
  }));
  input.addEventListener("input", apply);
  clear.addEventListener("click", () => { input.value = ""; apply(); input.focus(); });
  document.querySelector("#reset-filters").addEventListener("click", () => {
    active = "all";
    input.value = "";
    apply();
    input.focus();
  });
  const showHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);
    if (target?.classList.contains("publication-record")) {
      active = "all";
      input.value = "";
      apply();
      requestAnimationFrame(() => target.scrollIntoView({block: "start"}));
    }
  };
  apply();
  showHash();
  addEventListener("hashchange", showHash);
})();
