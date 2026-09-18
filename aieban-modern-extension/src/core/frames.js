// AI更易办 - 拆分自旧版 content.js。
  function enhanceFrameset() {
    document.documentElement.classList.add("aieban-modern-root");

    const frameSets = document.querySelectorAll("frameset");
    const root = frameSets[0];
    const content = frameSets[1];
    const sidebarCollapsed = localStorage.getItem(SIDEBAR_KEY) === "true";
    const topbarHeight = themePixels("--aieban-topbar-height", 76);
    const sidebarWidth = themePixels("--aieban-sidebar-width", 248);
    const collapsedWidth = themePixels("--aieban-sidebar-collapsed-width", 68);

    if (root) root.setAttribute("rows", `${topbarHeight},*`);
    if (content) content.setAttribute("cols", `${sidebarCollapsed ? collapsedWidth : sidebarWidth},*`);
  }

  function isTopFrame() {
    return PAGE.includes("top_menu") || !!document.querySelector('img[src*="topbanner"]');
  }

  function isMenuFrame() {
    return PAGE.includes("left_menu") || document.querySelectorAll('a[target="main"]').length >= 4;
  }
