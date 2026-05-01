// AI更易办 - 拆分自旧版 content.js。
  function getTheme() {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  }

  function applyTheme(theme = getTheme()) {
    document.documentElement.classList.toggle("aieban-theme-dark", theme === "dark");
    document.querySelectorAll(".aieban-theme-toggle").forEach((button) => {
      AiebanIcons.setIcon(button, theme === "dark" ? "themeDark" : "themeLight");
      button.setAttribute("aria-label", theme === "dark" ? "切换到白天模式" : "切换到夜间模式");
      button.title = theme === "dark" ? "切换到白天模式" : "切换到夜间模式";
    });
    document.querySelectorAll(".aieban-emblem").forEach((image) => {
      image.src = theme === "dark" ? EMBLEM_DARK : EMBLEM_LIGHT;
    });
  }

  function applyThemeToAllFrames(theme) {
    applyTheme(theme);
    try {
      Array.from(window.top.frames).forEach((frame) => {
        frame.document.documentElement.classList.toggle("aieban-theme-dark", theme === "dark");
        frame.document.querySelectorAll(".aieban-theme-toggle").forEach((button) => {
          AiebanIcons.setIcon(button, theme === "dark" ? "themeDark" : "themeLight");
          button.setAttribute("aria-label", theme === "dark" ? "切换到白天模式" : "切换到夜间模式");
          button.title = theme === "dark" ? "切换到白天模式" : "切换到夜间模式";
        });
        frame.document.querySelectorAll(".aieban-emblem").forEach((image) => {
          image.src = theme === "dark" ? EMBLEM_DARK : EMBLEM_LIGHT;
        });
      });
    } catch {
      // Some pages may be unavailable while frames are loading.
    }
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyThemeToAllFrames(theme);
  }

  function getFontTheme() {
    return localStorage.getItem(FONT_THEME_KEY) === "sans" ? "sans" : "literary";
  }

  function applyFontTheme(fontTheme = getFontTheme()) {
    const isSans = fontTheme === "sans";
    document.documentElement.classList.toggle("aieban-font-sans", isSans);
    document.documentElement.classList.toggle("aieban-font-literary", !isSans);
    document.querySelectorAll(".aieban-font-toggle").forEach((button) => {
      AiebanIcons.setIcon(button, isSans ? "fontSans" : "fontLiterary");
      button.setAttribute("aria-label", isSans ? "切换到文艺字体" : "切换到黑体字体");
      button.title = isSans ? "切换到文艺字体" : "切换到黑体字体";
    });
  }

  function applyFontThemeToAllFrames(fontTheme) {
    applyFontTheme(fontTheme);
    try {
      Array.from(window.top.frames).forEach((frame) => {
        const isSans = fontTheme === "sans";
        frame.document.documentElement.classList.toggle("aieban-font-sans", isSans);
        frame.document.documentElement.classList.toggle("aieban-font-literary", !isSans);
        frame.document.querySelectorAll(".aieban-font-toggle").forEach((button) => {
          AiebanIcons.setIcon(button, isSans ? "fontSans" : "fontLiterary");
          button.setAttribute("aria-label", isSans ? "切换到文艺字体" : "切换到黑体字体");
          button.title = isSans ? "切换到文艺字体" : "切换到黑体字体";
        });
      });
    } catch {
      // Some frames may still be loading.
    }
  }

  function setFontTheme(fontTheme) {
    localStorage.setItem(FONT_THEME_KEY, fontTheme);
    applyFontThemeToAllFrames(fontTheme);
  }

  function isWatermarkHidden() {
    return localStorage.getItem(WATERMARK_KEY) === "true";
  }

  function applyWatermarkPreference(hidden = isWatermarkHidden()) {
    document.documentElement.classList.toggle("aieban-hide-watermark", hidden);
    document.querySelectorAll(".aieban-watermark-toggle").forEach((button) => {
      AiebanIcons.setIcon(button, hidden ? "watermarkHidden" : "watermarkVisible");
      button.setAttribute("aria-label", hidden ? "显示背景水印" : "隐藏背景水印");
      button.title = hidden ? "显示背景水印" : "隐藏背景水印";
    });
  }

  function applyWatermarkPreferenceToAllFrames(hidden) {
    applyWatermarkPreference(hidden);
    try {
      Array.from(window.top.frames).forEach((frame) => {
        frame.document.documentElement.classList.toggle("aieban-hide-watermark", hidden);
        frame.document.querySelectorAll(".aieban-watermark-toggle").forEach((button) => {
          AiebanIcons.setIcon(button, hidden ? "watermarkHidden" : "watermarkVisible");
          button.setAttribute("aria-label", hidden ? "显示背景水印" : "隐藏背景水印");
          button.title = hidden ? "显示背景水印" : "隐藏背景水印";
        });
      });
    } catch {
      // Some frames may still be loading.
    }
  }

  function setWatermarkHidden(hidden) {
    localStorage.setItem(WATERMARK_KEY, String(hidden));
    applyWatermarkPreferenceToAllFrames(hidden);
  }
