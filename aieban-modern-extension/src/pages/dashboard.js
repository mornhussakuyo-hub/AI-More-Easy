// AI更易办 - 进站首页。
  function enhanceDashboardPage() {
    if (!isDashboardPage() || document.querySelector(".aieban-dashboard-hero")) return false;

    const contactTable = Array.from(document.querySelectorAll("table")).find((table) => {
      const value = text(table);
      return value.includes("辅导员") && value.includes("校园110") && table.querySelectorAll("th").length >= 4;
    });
    if (!contactTable) return false;

    document.body.classList.add("aieban-dashboard-page");

    const candidate = Array.from(document.querySelectorAll("strong, b"))
      .map((node) => text(node))
      .find((value) => /\d/.test(value) && value.length >= 4);
    const name = candidate ? extractDisplayName(candidate) : "同学";
    const headers = Array.from(contactTable.querySelectorAll("tr:first-child th, tr:first-child td"));
    const values = Array.from(contactTable.querySelectorAll("tr:nth-child(2) td"));
    const maintenanceSource = Array.from(document.body.childNodes)
      .map((node) => text(node))
      .find((value) => value.includes("系统维护时间"));
    const maintenanceText = maintenanceSource?.match(/每天凌晨[^。！!]+[。！!]?/)?.[0] || "";

    const hero = document.createElement("section");
    hero.className = "aieban-dashboard-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-dashboard-kicker">事务首页</div>
        <h1>${name}，欢迎使用 AI易办</h1>
        <p>这里保留学院事务处理中最常用的联系人和紧急渠道，办理事务前可先核对对应入口。</p>
      </div>
      <div class="aieban-dashboard-stamp" aria-hidden="true">
        <span>AI</span>
        <strong>易办</strong>
      </div>
    `;

    const contacts = document.createElement("section");
    contacts.className = "aieban-dashboard-contacts";
    contacts.innerHTML = `
      <div class="aieban-dashboard-section-head">
        <span>常用联系</span>
        <h2>大学期间常用重要联系方式</h2>
      </div>
      <div class="aieban-dashboard-contact-grid"></div>
    `;

    const grid = contacts.querySelector(".aieban-dashboard-contact-grid");
    headers.forEach((header, index) => {
      const label = text(header).replace(/\s*（/g, "（");
      const valueCell = values[index];
      if (!label || !valueCell) return;

      const card = document.createElement("article");
      card.className = "aieban-dashboard-contact-card";
      if (label.includes("110") || label.includes("生命") || label.includes("心理")) {
        card.classList.add("is-priority");
      }
      card.innerHTML = `
        <h3>${label}</h3>
        <div class="aieban-dashboard-contact-value"></div>
      `;
      card.querySelector(".aieban-dashboard-contact-value").innerHTML = valueCell.innerHTML;
      grid.appendChild(card);
    });

    const reminder = maintenanceText ? document.createElement("section") : null;
    if (reminder) {
      reminder.className = "aieban-dashboard-reminder";
      const label = document.createElement("strong");
      label.textContent = "系统维护";
      const value = document.createElement("span");
      value.textContent = maintenanceText;
      reminder.append(label, value);
    }

    document.body.prepend(hero);
    hero.after(contacts);
    if (reminder) contacts.after(reminder);

    let node = document.body.firstChild;
    while (node) {
      const next = node.nextSibling;
      const keep =
        node === hero ||
        node === contacts ||
        node === reminder ||
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("watermark")) ||
        (node.nodeType === Node.ELEMENT_NODE && ["SCRIPT", "STYLE", "LINK"].includes(node.tagName));

      if (!keep) node.remove();
      node = next;
    }

    return true;
  }
