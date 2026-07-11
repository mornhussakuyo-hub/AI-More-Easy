// AI更易办 - 拆分自旧版 content.js。
  function enhanceAnnualAwardPage() {
    if (!isAnnualAwardPage() || document.querySelector(".aieban-award-hero")) return;

    document.body.classList.add("aieban-award-page");

    const personalForm = document.forms.gerenshenbao || document.querySelector('form[action*="pingyou_shenbao_geren"]');
    const groupForm = document.forms.jitishenbao || document.querySelector('form[action*="pingyou_shenbao_jiti"]');
    const forms = [personalForm, groupForm].filter(Boolean);
    const oldActionTable = forms[0]?.closest("table");
    const submitControls = forms.map((form) => form.querySelector('input[type="submit"], button')).filter(Boolean);
    const isClosed = submitControls.length > 0 && submitControls.every((control) => control.disabled);
    const isOpen = submitControls.some((control) => !control.disabled);
    const originalClosedMessage = Array.from(oldActionTable?.querySelectorAll("td, th") || [])
      .map((node) => text(node))
      .find((value) => value.includes("截至时间") || value.includes("截止时间"));
    const originalEmptyMessages = Array.from(document.querySelectorAll('a[name="a"]'))
      .map((node) => text(node))
      .filter(Boolean);
    const originalLegend = Array.from(document.querySelectorAll("strong")).find((node) => {
      return text(node).includes("不同颜色表示不同状态") && node.querySelectorAll("font").length >= 4;
    });

    const hero = document.createElement("section");
    hero.className = "aieban-award-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-award-kicker">年度评优</div>
        <h1>年度评优申报</h1>
        <p>通过本平台提交评优申报，具体要求和时间安排以学院通知为准。</p>
      </div>
    `;

    const welcome = document.querySelector(".aieban-welcome");
    if (welcome) {
      welcome.after(hero);
    } else if (oldActionTable) {
      oldActionTable.before(hero);
    } else {
      document.body.prepend(hero);
    }

    const actionPanel = document.createElement("section");
    actionPanel.className = "aieban-award-actions";
    actionPanel.innerHTML = `
      <div class="aieban-award-action-head">
        <h2>申报入口</h2>
        ${isClosed || isOpen ? `<span>${isClosed ? "当前不可填报" : "开放填报中"}</span>` : ""}
      </div>
      <div class="aieban-award-action-grid"></div>
    `;
    const grid = actionPanel.querySelector(".aieban-award-action-grid");

    const createActionCard = (form, title, desc, buttonText) => {
      const card = document.createElement("article");
      card.className = "aieban-award-action-card";

      const submit = form?.querySelector('input[type="submit"], button');
      if (submit) {
        if (submit.disabled) card.classList.add("is-disabled");
      } else {
        card.classList.add("is-disabled");
      }

      card.innerHTML = `
        <div>
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
        <div class="aieban-award-form-slot"></div>
      `;
      const slot = card.querySelector(".aieban-award-form-slot");
      if (form) {
        form.classList.add("aieban-award-form");
        slot.appendChild(form);
      } else {
        const disabled = document.createElement("button");
        disabled.type = "button";
        disabled.disabled = true;
        disabled.textContent = "暂无入口";
        slot.appendChild(disabled);
      }
      return card;
    };

    if (personalForm) grid.appendChild(createActionCard(personalForm, "先进个人", "填写个人年度评优申报材料。"));
    if (groupForm) grid.appendChild(createActionCard(groupForm, "先进集体", "填写集体年度评优申报材料。"));
    hero.after(actionPanel);

    let anchor = actionPanel;
    if (isClosed) {
      const closed = document.createElement("div");
      closed.className = "aieban-award-closed";
      if (originalClosedMessage) {
        closed.textContent = originalClosedMessage;
        actionPanel.after(closed);
        anchor = closed;
      }
    }

    const legend = document.createElement("section");
    legend.className = "aieban-award-legend";
    if (originalLegend) {
      const title = document.createElement("h2");
      title.textContent = "状态说明";
      legend.append(title, originalLegend);
      anchor.after(legend);
    }

    if (originalEmptyMessages.length) {
      const empty = document.createElement("section");
      empty.className = "aieban-award-empty-list";
      originalEmptyMessages.forEach((message) => {
        const card = document.createElement("div");
        card.className = "aieban-award-empty-card";
        const paragraph = document.createElement("p");
        paragraph.textContent = message;
        card.appendChild(paragraph);
        empty.appendChild(card);
      });
      (legend.isConnected ? legend : anchor).after(empty);
    }

    if (oldActionTable) oldActionTable.remove();

    Array.from(document.querySelectorAll('a[name="a"]')).forEach((node) => {
      if (text(node).includes("暂无") || text(node).includes("申报表")) node.remove();
    });
  }
