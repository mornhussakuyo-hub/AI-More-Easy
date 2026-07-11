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

    if (oldGuide) oldGuide.classList.add("aieban-leave-guide", "aieban-original-notice");

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

    if (oldGuide) oldGuide.classList.add("aieban-leave-guide", "aieban-school-leave-guide", "aieban-original-notice");

    if (form) {
      form.classList.add("aieban-leave-form", "aieban-school-leave-form");
      form.querySelector("table")?.classList.add("aieban-leave-form-table", "aieban-school-leave-form-table");
    }
  }
