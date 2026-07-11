// AI更易办 - 拆分自旧版 content.js。
  function enhancePartyProgressPage() {
    if (!isPartyProgressPage() || document.body.classList.contains("aieban-party-enhanced")) return;

    document.body.classList.add("aieban-party-page", "aieban-party-enhanced");

    const welcome = document.querySelector(".aieban-welcome");
    const hero = document.createElement("section");
    hero.className = "aieban-party-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-party-kicker">组织发展</div>
        <h1>入党进度表</h1>
        <p>查看入党材料递交状态、党支部联系方式和党员信息。</p>
      </div>
    `;

    if (welcome) {
      welcome.after(hero);
    } else {
      document.body.prepend(hero);
    }

    Array.from(document.querySelectorAll("strong, b")).forEach((node) => {
      if (!text(node).includes("入党进度表")) return;
      let previous = node.previousSibling;
      while (
        previous &&
        ((previous.nodeType === Node.TEXT_NODE && /^[\s\-—]+$/.test(previous.textContent || "")) ||
          (previous.nodeType === Node.ELEMENT_NODE && previous.tagName === "BR"))
      ) {
        const nextPrevious = previous.previousSibling;
        previous.remove();
        previous = nextPrevious;
      }

      let next = node.nextSibling;
      let safety = 0;
      while (
        next &&
        safety < 8 &&
        ((next.nodeType === Node.TEXT_NODE && /^[\s\-—]+$/.test(next.textContent || "")) ||
          (next.nodeType === Node.ELEMENT_NODE && next.tagName === "BR"))
      ) {
        const nextSibling = next.nextSibling;
        next.remove();
        next = nextSibling;
        safety += 1;
      }

      node.remove();
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const looseTextNodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = text(node);
      if (node.parentNode === document.body && (value === "特别注意" || /^[\-—]{8,}$/.test(value))) {
        looseTextNodes.push(node);
      }
    }
    looseTextNodes.forEach((node) => node.remove());

    const links = ["9011", "8981"]
      .map((id) => {
        const link = document.querySelector(`a[href*="wbnewsid=${id}"]`);
        if (!link) return null;
        link.classList.add("aieban-party-policy-button");
        return link;
      })
      .filter(Boolean);

    if (links.length) {
      const panel = document.createElement("section");
      panel.className = "aieban-party-policy-links";
      panel.setAttribute("aria-label", "入党相关文件");

      const title = document.createElement("div");
      title.className = "aieban-party-policy-title";
      title.textContent = "入党相关文件";
      panel.appendChild(title);

      const actions = document.createElement("div");
      actions.className = "aieban-party-policy-actions";
      links.forEach((link) => actions.appendChild(link));
      panel.appendChild(actions);

      const oldWrapper = links[0].closest("table");
      if (hero) {
        hero.after(panel);
      } else if (oldWrapper) {
        oldWrapper.before(panel);
      } else {
        links[0].before(panel);
      }

      if (oldWrapper && !oldWrapper.querySelector("table")) oldWrapper.remove();
    }

    const resources = ['a[href*="12371.cn"]', 'a[href*="xuexi.cn"]']
      .map((selector) => {
        const link = document.querySelector(selector);
        if (!link) return null;
        link.classList.add("aieban-party-resource-button");
        return link;
      })
      .filter(Boolean);

    if (resources.length) {
      const resourcePanel = document.createElement("section");
      resourcePanel.className = "aieban-party-resource-links";
      resourcePanel.innerHTML = `
        <div class="aieban-party-policy-title">学习入口</div>
        <div class="aieban-party-resource-actions"></div>
      `;
      const actions = resourcePanel.querySelector(".aieban-party-resource-actions");
      resources.forEach((link) => actions.appendChild(link));

      const policyPanel = document.querySelector(".aieban-party-policy-links");
      (policyPanel || hero).after(resourcePanel);
    }

    document.querySelectorAll('a[href^="tencent://message"]').forEach((link) => {
      link.classList.add("aieban-qq-button");
      link.setAttribute("title", "QQ联系");
    });

    Array.from(document.querySelectorAll('font[color="red"]')).forEach((node) => {
      if (text(node).length > 24) node.classList.add("aieban-party-notice");
    });

    Array.from(document.querySelectorAll("font")).forEach((node) => {
      if (node.querySelector(".aieban-qq-button") || text(node).includes("党支部")) {
        node.classList.add("aieban-party-info-card");
      }
    });
  }
