// AI更易办 - 拆分自旧版 content.js。
  function extractDisplayName(raw) {
    const cleaned = raw.replace(/\d+/g, " ").replace(/\s+/g, " ").trim();
    return cleaned || "同学";
  }

  function simplifyWelcomeText() {
    const bodyText = text(document.body);
    if (!bodyText.includes("欢迎") || !bodyText.includes("AI易办")) return;

    const candidate = Array.from(document.querySelectorAll("strong, b"))
      .map((node) => text(node))
      .find((value) => /\d/.test(value) && value.length >= 4);
    if (!candidate) return;

    const name = extractDisplayName(candidate || "");

    const banner = document.querySelector(".aieban-welcome") || document.createElement("div");
    banner.className = "aieban-welcome";
    banner.textContent = `${name} 欢迎你！`;

    const removeLooseWelcomeLine = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let start = null;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest(".aieban-welcome")) continue;
        if (text(node).includes("欢迎")) {
          start = node;
          break;
        }
      }
      if (!start || start.parentNode !== document.body) return;

      let previous = start.previousSibling;
      while (previous?.nodeType === Node.ELEMENT_NODE && previous.tagName === "BR") {
        const nextPrevious = previous.previousSibling;
        previous.remove();
        previous = nextPrevious;
      }

      let node = start;
      let breaks = 0;
      let safety = 0;
      while (node && breaks < 2 && safety < 24) {
        const next = node.nextSibling;
        if (node !== banner) {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") breaks += 1;
          node.remove();
        }
        node = next;
        safety += 1;
      }
    };

    const firstTable = Array.from(document.body.children).find((node) => node.tagName === "TABLE");
    if (firstTable) {
      let node = document.body.firstChild;
      while (node && node !== firstTable) {
        const next = node.nextSibling;
        const shouldRemove =
          node.nodeType === Node.TEXT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE && ["STRONG", "B", "FONT"].includes(node.tagName));

        if (shouldRemove) node.remove();
        node = next;
      }
      if (!banner.isConnected) firstTable.before(banner);
    } else {
      removeLooseWelcomeLine();
      if (!banner.isConnected) document.body.prepend(banner);
    }
  }

  function removeObsoleteUsageNotice() {
    const markers = ["事务办理提示", "平台使用说明", "微型计算机", "UC浏览器", "未经测试"];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const removable = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = text(node);
      if (!markers.some((marker) => value.includes(marker))) continue;

      if (value.includes("系统维护时间")) {
        node.nodeValue = node.nodeValue.replace(/.*?(?=每天|每日|系统维护时间)/, "");
      } else {
        removable.push(node);
      }
    }

    removable.forEach((node) => {
      let previous = node.previousSibling;
      node.remove();
      while (previous && previous.nodeType === Node.ELEMENT_NODE && previous.tagName === "BR") {
        const next = previous.previousSibling;
        previous.remove();
        previous = next;
      }
    });

    document.querySelectorAll("font, strong, b").forEach((node) => {
      const value = text(node);
      if (value === "事务办理提示：" || value === "事务办理提示" || value === "平台使用说明：") {
        const next = node.nextSibling;
        node.remove();
        if (next?.nodeType === Node.ELEMENT_NODE && next.tagName === "BR") next.remove();
      }
    });
  }

  function simplifyMaintenanceNotice() {
    if (document.querySelector(".aieban-maintenance-notice")) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let targetText = null;

    while (walker.nextNode()) {
      const value = text(walker.currentNode);
      if ((value.includes("维护时间") || value.includes("系统维护")) && value.includes("1-3")) {
        targetText = walker.currentNode;
        break;
      }
    }

    if (!targetText) return;

    const notice = document.createElement("div");
    notice.className = "aieban-maintenance-notice";
    notice.textContent = text(targetText);

    const targetElement = targetText.parentElement;
    if (targetElement && ["FONT", "STRONG", "B", "SPAN"].includes(targetElement.tagName)) {
      targetElement.replaceWith(notice);
    } else {
      targetText.replaceWith(notice);
    }

    let next = notice.nextSibling;
    while (next && next.nodeType === Node.ELEMENT_NODE && next.tagName === "BR") {
      const removable = next;
      next = next.nextSibling;
      removable.remove();
    }
  }

  function findAttendanceScheduleTable() {
    const candidates = Array.from(document.querySelectorAll("table")).filter((table) => {
      const firstRow = table.rows[0];
      const firstRowText = text(firstRow);
      const columnCount = firstRow?.cells?.length || 0;
      return (
        table.rows.length >= 2 &&
        columnCount >= 6 &&
        firstRowText.includes("节次") &&
        firstRowText.includes("时间段") &&
        (firstRowText.includes("周日") || firstRowText.includes("周一"))
      );
    });

    return candidates.sort((a, b) => {
      const aScore = (a.rows[0]?.cells?.length || 0) * 100 + a.rows.length;
      const bScore = (b.rows[0]?.cells?.length || 0) * 100 + b.rows.length;
      return bScore - aScore;
    })[0];
  }

  function cleanupAttendanceHeader(scheduleAnchor, toolbar, welcome) {
    let node = document.body.firstChild;

    while (node && node !== scheduleAnchor) {
      const next = node.nextSibling;
      const keep =
        node === toolbar ||
        node === welcome ||
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("watermark")) ||
        (node.nodeType === Node.ELEMENT_NODE && ["SCRIPT", "STYLE"].includes(node.tagName));

      if (!keep) node.remove();
      node = next;
    }

    if (welcome) scheduleAnchor.before(welcome);
    if (toolbar) scheduleAnchor.before(toolbar);
  }

  function getOutermostTableAncestor(element) {
    let anchor = element;
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      if (parent.tagName === "TABLE") anchor = parent;
      parent = parent.parentElement;
    }
    return anchor;
  }

  function removeAttendanceNoise(scheduleTable) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const removable = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = text(node);
      if (!value) continue;
      if (!scheduleTable.contains(node) && (value.includes("到课数据") || value.includes("天凌晨") || value.includes("凌晨"))) {
        removable.push(node);
      } else if (!scheduleTable.contains(node) && /^(学期|第|周)$/.test(value)) {
        removable.push(node);
      }
    }

    removable.forEach((node) => {
      const parent = node.parentElement;
      node.remove();
      if (parent && parent !== document.body && !text(parent) && parent.querySelectorAll("select,input,button,table").length === 0) {
        parent.remove();
      }
    });
  }

  function isRecordTable(table) {
    if (!table.rows.length) return false;
    const firstRowText = text(table.rows[0]);
    const recordHeaders = ["ID", "年级", "班级", "学号", "姓名", "面签状态", "操作"];
    return recordHeaders.filter((header) => firstRowText.includes(header)).length >= 4;
  }

  function wrapDataTable(table, className = "") {
    if (!table || table.closest(".aieban-table-scroll, .aieban-data-scroll, .aieban-ztc-table-scroll")) return null;
    if (table.closest(".xdsoft_datetimepicker, .aieban-login-card")) return null;
    if (table.parentElement?.closest("table")) return null;

    const wrapper = document.createElement("div");
    wrapper.className = `aieban-data-scroll ${className}`.trim();
    table.before(wrapper);
    wrapper.appendChild(table);
    return wrapper;
  }

  function shouldWrapDataTable(table) {
    if (!table || table.classList.contains("aieban-layout-table")) return false;
    if (table.closest(".aieban-table-scroll, .aieban-data-scroll, .aieban-ztc-table-scroll")) return false;
    if (table.closest(".xdsoft_datetimepicker, .aieban-login-card")) return false;
    if (table.parentElement?.closest("table")) return false;

    const declaredWidth = Number.parseFloat(table.getAttribute("width")) || 0;
    const firstRowCells = table.rows[0]?.cells?.length || 0;
    return declaredWidth >= 700 || firstRowCells >= 6 || table.querySelectorAll("td, th").length >= 24;
  }
