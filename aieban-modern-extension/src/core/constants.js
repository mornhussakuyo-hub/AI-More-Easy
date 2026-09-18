// AI更易办 - 拆分自旧版 content.js。
  const PAGE = (window.__AIEBAN_PAGE_URL__ || location.href).toLowerCase();
  const THEME_KEY = "aieban-modern-theme";
  const INTERFACE_THEME_KEY = "aieban-modern-interface-theme";
  const FONT_THEME_KEY = "aieban-modern-font-theme";
  const SIDEBAR_KEY = "aieban-modern-sidebar-collapsed";
  const FAVORITES_KEY = "aieban-modern-favorites";
  const ACTIVE_MENU_KEY = "aieban-modern-active-menu";
  const EMBLEM_LIGHT = chrome.runtime.getURL("assets/sai-emblem.png");
  const EMBLEM_DARK = chrome.runtime.getURL("assets/sai-emblem-white.png");

  const text = (node) => (node?.textContent || "").replace(/\s+/g, " ").trim();
  const themePixels = (property, fallback, doc = document) => {
    const value = Number.parseFloat(doc.defaultView?.getComputedStyle(doc.documentElement).getPropertyValue(property));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  };
