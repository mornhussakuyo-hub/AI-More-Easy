// AI更易办 - 拆分自旧版 content.js。
  function enhanceIdeologyScorePage() {
    if (!isIdeologyScorePage() || document.querySelector(".aieban-policy-links")) return;

    const policies = [
      {
        id: "8661",
        title: "《人工智能学院本科生离校请假备案办法》"
      },
      {
        id: "8531",
        title: "《人工智能学院本科生通报表扬、通报批评适用办法》"
      },
      {
        id: "8541",
        title: "《人工智能学院本科生思想政治素质综合评价实施细则》"
      }
    ];

    const links = policies
      .map((policy) => {
        const link = document.querySelector(`a[href*="wbnewsid=${policy.id}"]`);
        if (!link) return null;
        link.textContent = policy.title;
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
