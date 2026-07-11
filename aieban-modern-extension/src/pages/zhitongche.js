// AI更易办 - 珞珈智通车页面。
  function enhanceZhitongchePage() {
    if (!isZhitongchePage()) return false;
    if (document.querySelector(".aieban-ztc-hero")) return true;

    document.body.classList.add("aieban-zhitongche-page");

    const formTable = Array.from(document.querySelectorAll("table")).find((table) => {
      return table.querySelector('input[name="biaoti"], textarea[name="neirong"], select[name="leibie"]');
    });
    const recordTable = Array.from(document.querySelectorAll("table")).find((table) => {
      const value = text(table);
      return value.includes("反映人") && value.includes("问题类别") && value.includes("状态");
    });
    const originalPageText = text(document.body);
    const deadlineMatches = Array.from(originalPageText.matchAll(/(咨询类|意见类|建议类)[：:]原则上\s*(\d+)\s*个工作日/g));
    const deadlineSummary = deadlineMatches.map((match) => match[2]).join(" / ");

    const hero = document.createElement("section");
    hero.className = "aieban-ztc-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-ztc-kicker">事务反馈</div>
        <h1>珞珈智通车</h1>
        <p>面向学院师生的非紧急事务反馈通道。提交前请先确认事项是否属于专项渠道或紧急情况。</p>
      </div>
      ${deadlineSummary ? `<div class="aieban-ztc-timecard"><span>办理时限</span><strong>${deadlineSummary}</strong><small>咨询、意见、建议对应工作日</small></div>` : ""}
    `;

    const guide = document.createElement("section");
    guide.className = "aieban-ztc-guide aieban-ztc-original-guide";
    guide.setAttribute("aria-label", "珞珈智通车使用须知原文");

    const formHeader = document.createElement("section");
    formHeader.className = "aieban-ztc-section-head";
    formHeader.innerHTML = `
      <div>
        <span>提交反馈</span>
        <h2>正在提交的智通车内容</h2>
      </div>
      <p>暂存或提交前，请核对页面中的必填项。</p>
    `;

    const recordHeader = document.createElement("section");
    recordHeader.className = "aieban-ztc-section-head aieban-ztc-record-head";
    recordHeader.innerHTML = `
      <div>
        <span>办理记录</span>
        <h2>本人参与的智通车记录</h2>
      </div>
    `;

    const insertionPoint = formTable || recordTable || document.body.firstChild;
    document.body.insertBefore(hero, insertionPoint);
    hero.after(guide);
    guide.after(formHeader);

    let originalNode = document.body.firstChild;
    while (originalNode && originalNode !== hero) {
      const next = originalNode.nextSibling;
      const keepOutside =
        originalNode.nodeType === Node.COMMENT_NODE ||
        (originalNode.nodeType === Node.ELEMENT_NODE && originalNode.classList.contains("watermark")) ||
        (originalNode.nodeType === Node.ELEMENT_NODE && ["SCRIPT", "STYLE", "LINK", "IMG"].includes(originalNode.tagName));
      if (!keepOutside) guide.appendChild(originalNode);
      originalNode = next;
    }

    if (formTable) {
      formTable.classList.add("aieban-ztc-form-table");
      enhanceZhitongcheControls(formTable);
    }

    if (recordTable) {
      recordTable.classList.add("aieban-ztc-record-table");
      recordTable.before(recordHeader);
    }

    if (formTable) wrapZhitongcheTable(formTable, "aieban-ztc-form-wrap");
    if (recordTable) wrapZhitongcheTable(recordTable, "aieban-ztc-record-wrap");

    document.querySelectorAll(".aieban-zhitongche-page img").forEach((image) => {
      if (!image.closest(".aieban-ztc-hero, .aieban-ztc-guide")) image.remove();
    });

    return true;
  }

  function wrapZhitongcheTable(table, className) {
    if (!table || table.parentElement?.classList.contains("aieban-ztc-table-scroll")) return;
    const wrapper = document.createElement("div");
    wrapper.className = `aieban-ztc-table-scroll ${className}`;
    table.before(wrapper);
    wrapper.appendChild(table);
  }

  function enhanceZhitongcheControls(scope) {
    scope.querySelectorAll("select, input[type='text'], textarea").forEach((control) => {
      control.classList.add("aieban-ztc-field");
    });

    scope.querySelectorAll("input[type='submit'], input[type='button'], button").forEach((button) => {
      button.classList.add("aieban-ztc-submit");
      if (button.value === "提交" || button.textContent.trim() === "提交") {
        button.classList.add("is-primary");
      }
    });
  }
