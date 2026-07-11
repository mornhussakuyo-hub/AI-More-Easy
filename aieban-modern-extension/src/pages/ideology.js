// AI更易办 - 拆分自旧版 content.js。
  function enhanceIdeologyScorePage() {
    if (!isIdeologyScorePage() || document.querySelector(".aieban-policy-links")) return;

    const links = ["8661", "8531", "8541"]
      .map((id) => {
        const link = document.querySelector(`a[href*="wbnewsid=${id}"]`);
        if (!link) return null;
        link.classList.add("aieban-policy-button");
        return link;
      })
      .filter(Boolean);

    if (!links.length) return;

    document.body.classList.add("aieban-ideology-page");

    const panel = document.createElement("section");
    panel.className = "aieban-policy-links";
    panel.setAttribute("aria-label", "相关办法与细则");

    const title = document.createElement("div");
    title.className = "aieban-policy-title";
    title.textContent = "相关办法与细则";
    panel.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "aieban-policy-actions";
    links.forEach((link) => actions.appendChild(link));
    panel.appendChild(actions);

    const oldWrapper = links[0].closest("table");
    const welcome = document.querySelector(".aieban-welcome");
    if (welcome) {
      welcome.after(panel);
    } else if (oldWrapper) {
      oldWrapper.before(panel);
    } else {
      document.body.prepend(panel);
    }

    if (oldWrapper) oldWrapper.remove();
  }
