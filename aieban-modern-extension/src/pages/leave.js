// AI更易办 - 拆分自旧版 content.js。
  function enhanceLeavePage() {
    if (!isLeavePage()) return;

    document.body.classList.add("aieban-leave-page");

    const form = document.forms.quekebeian || document.querySelector('form[action*="stuser_queke_beian"]');
    const oldGuide =
      Array.from(document.querySelectorAll("table")).find((table) => {
      const value = text(table);
      return value.includes("临时缺课") && value.includes("请假攻略");
    }) ||
      Array.from(document.querySelectorAll("table")).find((table) => {
        if (!form) return false;
        const beforeForm = !!(table.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING);
        return beforeForm && !table.querySelector("input, select, textarea, button") && text(table).length > 30;
      });

    if (!document.querySelector(".aieban-leave-guide")) {
      const guide = document.createElement("section");
      guide.className = "aieban-leave-guide";
      guide.innerHTML = `
        <h2>缺课请假备案说明</h2>
        <p>${LEAVE_NOTICE.intro}</p>
        <h3>${LEAVE_NOTICE.title}</h3>
      `;

      const list = document.createElement("ol");
      LEAVE_NOTICE.steps.forEach((step) => {
        const item = document.createElement("li");
        item.textContent = step;
        list.appendChild(item);
      });
      guide.appendChild(list);

      const welcome = document.querySelector(".aieban-welcome");
      if (welcome) {
        welcome.after(guide);
      } else if (oldGuide) {
        oldGuide.before(guide);
      } else if (form) {
        form.before(guide);
      } else {
        document.body.prepend(guide);
      }
    }

    if (oldGuide) oldGuide.remove();

    if (form) {
      form.classList.add("aieban-leave-form");
      form.querySelector("table")?.classList.add("aieban-leave-form-table");
    }

    Array.from(document.querySelectorAll("a[name='a']")).forEach((anchor) => {
      if (text(anchor)) anchor.classList.add("aieban-record-heading");
    });

    document.querySelectorAll("table").forEach((table) => {
      if (isRecordTable(table)) {
        table.classList.add("aieban-table", "aieban-record-table");
      }
    });
  }

  function enhanceSchoolLeavePage() {
    if (!isSchoolLeavePage() || document.querySelector(".aieban-school-leave-guide")) return;

    document.body.classList.add("aieban-leave-page", "aieban-school-leave-page");

    const form = document.forms.lixiaobeian || document.querySelector('form[action*="stuser_lixiao_beian"]');
    const oldGuide = Array.from(document.querySelectorAll("table")).find((table) => {
      if (!form) return !table.querySelector("input, select, textarea, button") && text(table).length > 40;
      const beforeForm = !!(table.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING);
      return beforeForm && !table.querySelector("input, select, textarea, button") && text(table).length > 40;
    });

    const guide = document.createElement("section");
    guide.className = "aieban-leave-guide aieban-school-leave-guide";
    guide.innerHTML = `
      <div class="aieban-school-leave-kicker">离校备案</div>
      <h2>离校请假备案说明</h2>
      <p>${SCHOOL_LEAVE_NOTICE.intro}</p>
      <div class="aieban-leave-alert">辅导员联系方式：19023790307；微信：15903905578。</div>
      <h3>${SCHOOL_LEAVE_NOTICE.title}</h3>
    `;

    const list = document.createElement("ol");
    SCHOOL_LEAVE_NOTICE.steps.forEach((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      list.appendChild(item);
    });
    guide.appendChild(list);

    const welcome = document.querySelector(".aieban-welcome");
    if (welcome) {
      welcome.after(guide);
    } else if (oldGuide) {
      oldGuide.before(guide);
    } else if (form) {
      form.before(guide);
    } else {
      document.body.prepend(guide);
    }

    if (oldGuide) oldGuide.remove();

    if (form) {
      form.classList.add("aieban-leave-form", "aieban-school-leave-form");
      form.querySelector("table")?.classList.add("aieban-leave-form-table", "aieban-school-leave-form-table");
    }
  }
