// AI更易办 - 拆分自旧版 content.js。
  function enhanceFrameset() {
    document.documentElement.classList.add("aieban-modern-root");

    const frameSets = document.querySelectorAll("frameset");
    const root = frameSets[0];
    const content = frameSets[1];
    const sidebarCollapsed = localStorage.getItem(SIDEBAR_KEY) === "true";

    if (root) root.setAttribute("rows", "72,*");
    if (content) content.setAttribute("cols", sidebarCollapsed ? "64,*" : "232,*");
  }

  function isTopFrame() {
    return PAGE.includes("top_menu") || !!document.querySelector('img[src*="topbanner"]');
  }

  function isMenuFrame() {
    return PAGE.includes("left_menu") || document.querySelectorAll('a[target="main"]').length >= 4;
  }
