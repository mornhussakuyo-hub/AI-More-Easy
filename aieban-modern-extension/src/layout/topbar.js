// AI更易办 - 拆分自旧版 content.js。
  function enhanceTopFrame() {
    document.documentElement.classList.add("aieban-modern-frame", "aieban-modern-top-frame");

    document.body.innerHTML = `
      <header class="aieban-topbar">
        <div class="aieban-brand">
          <div class="aieban-mark">
            <img class="aieban-emblem" src="${getTheme() === "dark" ? EMBLEM_DARK : EMBLEM_LIGHT}" alt="人工智能学院院徽">
          </div>
          <div class="aieban-brand-copy">
            <div class="aieban-brand-kicker">WHU · SAI</div>
            <div class="aieban-title">AI更易办</div>
          </div>
        </div>
        <div class="aieban-topbar-actions">
          <div class="aieban-topbar-meta"><span></span>本科生事务工作台</div>
          <button type="button" class="aieban-font-toggle"></button>
          <button type="button" class="aieban-theme-toggle"></button>
        </div>
      </header>
    `;
    applyTheme();
    applyFontTheme();

    document.querySelector(".aieban-theme-toggle")?.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });

    document.querySelector(".aieban-font-toggle")?.addEventListener("click", () => {
      setFontTheme(getFontTheme() === "sans" ? "literary" : "sans");
    });
  }
