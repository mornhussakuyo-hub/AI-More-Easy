// AI更易办 - 拆分自旧版 content.js。
  const PAGE = location.href.toLowerCase();
  const THEME_KEY = "aieban-modern-theme";
  const FONT_THEME_KEY = "aieban-modern-font-theme";
  const SIDEBAR_KEY = "aieban-modern-sidebar-collapsed";
  const FAVORITES_KEY = "aieban-modern-favorites";
  const EMBLEM_LIGHT = chrome.runtime.getURL("assets/sai-emblem.png");
  const EMBLEM_DARK = chrome.runtime.getURL("assets/sai-emblem-white.png");

  const text = (node) => (node?.textContent || "").replace(/\s+/g, " ").trim();
