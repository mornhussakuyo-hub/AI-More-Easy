// AI更易办 - 拆分自旧版 content.js。
  function enhanceAttendancePage() {
    if (!isAttendancePage()) return;

    document.body.classList.add("aieban-attendance-page");

    const scheduleTable = findAttendanceScheduleTable();
    if (!scheduleTable) return;
    const originalUpdateNotice = Array.from(document.body.childNodes)
      .map((node) => text(node))
      .find((value) => value.includes("到课数据") && value.includes("自动更新"));

    scheduleTable.classList.add("aieban-attendance-table");
    const scheduleAnchor = getOutermostTableAncestor(scheduleTable);

    const welcome = document.querySelector(".aieban-welcome");
    if (welcome && welcome !== document.body.firstElementChild) {
      document.body.prepend(welcome);
    }

    if (!document.querySelector(".aieban-attendance-toolbar")) {
      const toolbar = document.createElement("div");
      toolbar.className = "aieban-attendance-toolbar";

      const note = document.createElement("div");
      note.className = "aieban-attendance-note";
      if (originalUpdateNotice) {
        note.textContent = originalUpdateNotice;
        toolbar.appendChild(note);
      }

      const form = Array.from(document.querySelectorAll("form"))
        .find((candidate) => !scheduleTable.contains(candidate));

      if (form) {
        form.classList.add("aieban-attendance-form");
        toolbar.appendChild(form);
      } else {
        const controls = Array.from(document.querySelectorAll("select,input[type='button'],input[type='submit'],button"))
          .filter((control) => !scheduleTable.contains(control) && !control.closest(".aieban-attendance-toolbar"));

        let selectIndex = 0;
        controls.forEach((control) => {
          if (control.tagName === "SELECT") {
            const label = document.createElement("label");
            label.className = "aieban-attendance-field";
            label.append(document.createElement("span"), control);
            label.querySelector("span").textContent = selectIndex === 0 ? "学期" : "周次";
            selectIndex += 1;
            toolbar.appendChild(label);
          } else {
            toolbar.appendChild(control);
          }
        });
      }

      if (toolbar.children.length) {
        cleanupAttendanceHeader(scheduleAnchor, toolbar, welcome);
      }
    }

    removeAttendanceNoise(scheduleTable);

    document.querySelectorAll(".aieban-attendance-toolbar input[type='button'], .aieban-attendance-toolbar input[type='submit'], .aieban-attendance-toolbar button").forEach((button) => {
      button.classList.add("aieban-compact-button");
    });
  }

  function enhanceAttendancePublicPage() {
    if (!isAttendancePublicPage() || document.querySelector(".aieban-attendance-public-hero")) return;

    document.body.classList.add("aieban-attendance-public-page");

    const bodyText = text(document.body);
    const titleMatch = bodyText.match(/(\d{8,})\s*([^\s，,。]+)\s*的考勤累计数据公示/);
    const candidate = Array.from(document.querySelectorAll("strong, b"))
      .map((node) => text(node))
      .find((value) => /\d/.test(value) && value.length >= 4);
    const fallbackName = candidate ? extractDisplayName(candidate) : "同学";
    const studentId = titleMatch?.[1] || candidate?.match(/\d{8,}/)?.[0] || "";
    const studentName = titleMatch?.[2] || fallbackName;

    const hero = document.createElement("section");
    hero.className = "aieban-attendance-public-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-attendance-public-kicker">考勤公示</div>
        <h1>考勤累计数据公示</h1>
      </div>
      <div class="aieban-attendance-public-person">
        <span>${studentName}</span>
        ${studentId ? `<small>${studentId}</small>` : ""}
      </div>
    `;

    const firstTable = Array.from(document.querySelectorAll("table")).find((table) => table.querySelectorAll("td, th").length >= 4);
    const welcome = document.querySelector(".aieban-welcome");
    if (welcome) {
      welcome.after(hero);
    } else if (firstTable) {
      firstTable.before(hero);
    } else {
      document.body.prepend(hero);
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const removable = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (hero.contains(node)) continue;
      const value = text(node);
      if (value.includes("考勤累计数据公示") || /^[-—－\s]+$/.test(value)) {
        removable.push(node);
      }
    }

    removable.forEach((node) => {
      const parent = node.parentElement;
      node.remove();
      if (parent && parent !== document.body && !text(parent) && parent.querySelectorAll("table,input,select,textarea,button").length === 0) {
        parent.remove();
      }
    });

    document.querySelectorAll("table").forEach((table) => {
      if (table.querySelectorAll("td, th").length >= 4) {
        table.classList.add("aieban-table", "aieban-attendance-public-table");
      }
    });
  }
