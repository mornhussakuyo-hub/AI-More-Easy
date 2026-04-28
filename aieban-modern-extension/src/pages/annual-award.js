// AI更易办 - 拆分自旧版 content.js。
  function enhanceAnnualAwardPage() {
    if (!isAnnualAwardPage() || document.querySelector(".aieban-award-hero")) return;

    document.body.classList.add("aieban-award-page");

    const personalForm = document.forms.gerenshenbao || document.querySelector('form[action*="pingyou_shenbao_geren"]');
    const groupForm = document.forms.jitishenbao || document.querySelector('form[action*="pingyou_shenbao_jiti"]');
    const forms = [personalForm, groupForm].filter(Boolean);
    const oldActionTable = forms[0]?.closest("table");
    const isClosed = forms.length > 0 && forms.every((form) => form.querySelector('input[type="submit"], button')?.disabled);

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
        <span>${isClosed ? "当前不可填报" : "开放填报中"}</span>
      </div>
      <div class="aieban-award-action-grid"></div>
    `;
    const grid = actionPanel.querySelector(".aieban-award-action-grid");

    const createActionCard = (form, title, desc, buttonText) => {
      const card = document.createElement("article");
      card.className = "aieban-award-action-card";

      const submit = form?.querySelector('input[type="submit"], button');
      if (submit) {
        if (submit.tagName === "INPUT") {
          submit.value = buttonText;
        } else {
          submit.textContent = buttonText;
        }
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

    grid.appendChild(createActionCard(personalForm, "先进个人", "填写个人年度评优申报材料。", "填写先进个人申报表"));
    grid.appendChild(createActionCard(groupForm, "先进集体", "填写集体年度评优申报材料。", "填写先进集体申报表"));
    hero.after(actionPanel);

    let anchor = actionPanel;
    if (isClosed) {
      const closed = document.createElement("div");
      closed.className = "aieban-award-closed";
      closed.textContent = "申报截止时间已过，当前不能再进行填报和修改。";
      actionPanel.after(closed);
      anchor = closed;
    }

    const legend = document.createElement("section");
    legend.className = "aieban-award-legend";
    legend.innerHTML = `
      <h2>状态说明</h2>
      <div class="aieban-award-legend-grid">
        <div><span class="is-black"></span>团支部、班级和推荐单位负责人均未检查确认</div>
        <div><span class="is-red"></span>推荐单位负责人尚未检查确认</div>
        <div><span class="is-blue"></span>所在团支部和班级负责人尚未检查确认</div>
        <div><span class="is-green"></span>团支部、班级和推荐单位负责人均已检查确认</div>
      </div>
      <p>请确保截止前申报奖项状态变为绿色。</p>
    `;
    anchor.after(legend);

    const empty = document.createElement("section");
    empty.className = "aieban-award-empty-list";
    empty.innerHTML = `
      <div class="aieban-award-empty-card">
        <h2>先进集体申报表</h2>
        <p>暂无已填报的先进集体申报表。</p>
      </div>
      <div class="aieban-award-empty-card">
        <h2>先进个人申报表</h2>
        <p>暂无已填报的先进个人申报表。</p>
      </div>
    `;
    legend.after(empty);

    if (oldActionTable) oldActionTable.remove();

    Array.from(document.querySelectorAll("strong")).forEach((node) => {
      const value = text(node);
      const fontCount = node.querySelectorAll("font").length;
      if ((value.includes("说明") && value.includes("颜色")) || fontCount >= 4) node.remove();
    });

    Array.from(document.querySelectorAll('a[name="a"]')).forEach((node) => {
      if (text(node).includes("暂无") || text(node).includes("申报表")) node.remove();
    });
  }
