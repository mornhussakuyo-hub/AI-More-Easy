// AI更易办 - 拆分自旧版 content.js。
  function createGradeNotice(form) {
    const notice = document.createElement("section");
    notice.className = "aieban-grade-notice";
    notice.setAttribute("aria-label", "成绩说明原文");

    let node = Array.from(document.querySelectorAll("strong, b")).find((candidate) => {
      return text(candidate).includes("特别说明");
    });
    while (node && node !== form) {
      const next = node.nextSibling;
      notice.appendChild(node);
      node = next;
    }
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
    const notice = createGradeNotice(form);
    const hero = createGradeHero(cacheTime);

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
    if (!document.querySelector(".aieban-guide")) {
      const article = document.createElement("article");
      article.className = "aieban-guide aieban-guide-original";
      article.setAttribute("aria-label", "AI易办使用指南原文");

      Array.from(document.body.childNodes).forEach((node) => {
        const keepOutside =
          node.nodeType === Node.COMMENT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("watermark")) ||
          (node.nodeType === Node.ELEMENT_NODE && ["SCRIPT", "STYLE", "LINK"].includes(node.tagName));
        if (!keepOutside) article.appendChild(node);
      });
      document.body.appendChild(article);
    }
    return true;
  }
