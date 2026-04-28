// AI更易办 - 拆分自旧版 content.js。
  function createGradeNotice() {
    const notice = document.createElement("section");
    notice.className = "aieban-grade-notice";

    const special = document.createElement("section");
    special.className = "aieban-grade-section";
    special.innerHTML = "<h2>特别说明</h2>";
    GRADE_NOTICE.special.forEach((line) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      special.appendChild(paragraph);
    });

    const rules = document.createElement("section");
    rules.className = "aieban-grade-section";
    rules.innerHTML = "<h2>AI易办成绩计算说明2026new</h2>";
    const list = document.createElement("ol");
    GRADE_NOTICE.rules.forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.appendChild(item);
    });
    rules.appendChild(list);

    notice.append(special, rules);
    return notice;
  }

  function extractGradeCacheTime() {
    const match = text(document.body).match(/成绩缓存更新时间[:：]\s*([0-9:-]+(?:\s+[0-9:]+)?)/);
    return match?.[1] || "";
  }

  function createGradeHero(cacheTime) {
    const hero = document.createElement("section");
    hero.className = "aieban-grade-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-grade-kicker">成绩概览</div>
        <h1>哇！我的成绩原来是这样滴</h1>
      </div>
      ${cacheTime ? `<div class="aieban-grade-cache">成绩缓存更新时间：${cacheTime}</div>` : ""}
    `;
    return hero;
  }

  function cleanupGradeExportIntro(form) {
    if (!form) return;

    let seenExportText = false;
    Array.from(form.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "INPUT" && node.type === "hidden") return;
      if (seenExportText) return;

      if (node.nodeType === Node.TEXT_NODE && text(node).includes("EXCEL")) {
        node.nodeValue = "我想把查询结果导出为 EXCEL 文件 ";
        seenExportText = true;
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const value = text(node);
        if (value.includes("EXCEL")) {
          seenExportText = true;
          return;
        }
        if (["DIV", "TABLE"].includes(node.tagName)) {
          seenExportText = true;
          return;
        }
      }

      node.remove();
    });
  }

  function enhanceGradePage() {
    if (!isGradePage() || document.querySelector(".aieban-grade-notice")) return false;

    document.body.classList.add("aieban-grade-page");

    const candidate = Array.from(document.querySelectorAll("strong, b"))
      .map((node) => text(node))
      .find((value) => /\d/.test(value) && value.length >= 4);
    const name = candidate ? extractDisplayName(candidate) : "";
    const welcome = document.createElement("div");
    welcome.className = "aieban-welcome";
    welcome.textContent = `${name || "同学"} 欢迎你！`;

    const form = document.querySelector('form[action*="chengji_chaxun_toexcel"]') || document.querySelector("form");
    const cacheTime = extractGradeCacheTime();
    const notice = createGradeNotice();
    const hero = createGradeHero(cacheTime);

    let node = document.body.firstChild;
    while (node && node !== form) {
      const next = node.nextSibling;
      const keep =
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("watermark")) ||
        (node.nodeType === Node.ELEMENT_NODE && ["SCRIPT", "STYLE"].includes(node.tagName));

      if (!keep) node.remove();
      node = next;
    }

    const anchor = form || document.body.firstChild;
    if (anchor) {
      anchor.before(welcome, notice, hero);
    } else {
      document.body.append(welcome, notice, hero);
    }

    cleanupGradeExportIntro(form);
    return true;
  }

  function renderGuidePage() {
    if (!isGuidePage()) return false;

    document.body.classList.add("aieban-guide-page");

    const article = document.createElement("article");
    article.className = "aieban-guide";

    let list = null;
    GUIDE_MARKDOWN.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        list = null;
        return;
      }

      if (trimmed.startsWith("# ")) {
        list = null;
        const heading = document.createElement("h1");
        heading.textContent = trimmed.slice(2);
        article.appendChild(heading);
        return;
      }

      if (trimmed.startsWith("## ")) {
        list = null;
        const heading = document.createElement("h2");
        heading.textContent = trimmed.slice(3);
        article.appendChild(heading);
        return;
      }

      if (trimmed.startsWith("- ")) {
        if (!list) {
          list = document.createElement("ul");
          article.appendChild(list);
        }
        const item = document.createElement("li");
        item.textContent = trimmed.slice(2);
        list.appendChild(item);
        return;
      }

      list = null;
      const paragraph = document.createElement("p");
      paragraph.textContent = trimmed;
      article.appendChild(paragraph);
    });

    document.body.replaceChildren(article);
    return true;
  }
