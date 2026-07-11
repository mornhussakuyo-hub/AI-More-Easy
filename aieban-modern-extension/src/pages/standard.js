// AI更易办 - 通用事务页面框架。
  function enhanceStandardPageLayout() {
    if (document.querySelector(".aieban-standard-hero")) return;
    if (hasDedicatedPageEnhancement()) return;

    const meta = getStandardPageMeta();
    if (!meta) return;

    document.body.classList.add("aieban-standard-page", meta.className);
    ensureStandardWelcome();
    normalizeStandardTopSpacing();

    const hero = document.createElement("section");
    hero.className = "aieban-standard-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-standard-kicker">${meta.kicker}</div>
        <h1>${meta.title}</h1>
        <p>${meta.description}</p>
      </div>
      <div class="aieban-standard-filetab" aria-hidden="true">${meta.tab}</div>
    `;

    const welcome = document.querySelector(".aieban-welcome");
    if (welcome) {
      welcome.after(hero);
    } else {
      const anchor = getFirstStandardContent();
      if (anchor) anchor.before(hero);
      else document.body.prepend(hero);
    }

    const noteContent = collectIntroContent(hero);
    if (noteContent.length) {
      const note = document.createElement("section");
      note.className = "aieban-standard-note";
      note.append(...noteContent);
      hero.after(note);
    }

    enhanceStandardTables(meta);
    enhanceTrainingPlanSemantics(meta);
    enhanceStandardForms();
  }

  function hasDedicatedPageEnhancement() {
    return [
      "aieban-attendance-page",
      "aieban-attendance-public-page",
      "aieban-award-page",
      "aieban-clothing-page",
      "aieban-grade-page",
      "aieban-guide-page",
      "aieban-ideology-page",
      "aieban-leave-page",
      "aieban-login-page",
      "aieban-party-page",
      "aieban-school-leave-page",
      "aieban-zhitongche-page"
    ].some((className) => document.body.classList.contains(className));
  }

  function getStandardPageMeta() {
    if (isTrainingPlanPage()) {
      return {
        className: "aieban-training-plan-page",
        kicker: "学业档案",
        title: "培养方案",
        description: "查看页面提供的课程模块、学期安排与学分信息。",
        tab: "培养"
      };
    }
    if (isLectureReportPage()) {
      return {
        className: "aieban-lecture-page",
        kicker: "学业记录",
        title: "讲座报告记录",
        description: "查看页面提供的讲座与学术报告记录。",
        tab: "报告"
      };
    }
    if (isRoleHistoryPage()) {
      return {
        className: "aieban-role-page",
        kicker: "简历档案",
        title: "任职经历",
        description: "查看和填写页面提供的任职经历信息。",
        tab: "任职"
      };
    }
    if (isCareerTestPage()) {
      return {
        className: "aieban-career-page",
        kicker: "职业测评",
        title: PAGE.includes("cepingpro") ? "职业倾向测试 Pro" : "职业倾向测试",
        description: "查看页面提供的职业倾向测评内容与结果。",
        tab: "测评"
      };
    }
    if (isAnnouncementPage()) {
      return {
        className: "aieban-announcement-page",
        kicker: "事务确认",
        title: "签阅必读公告",
        description: "查看页面提供的公告内容与签阅状态。",
        tab: "签阅"
      };
    }
    if (isFaceToFacePage()) {
      return {
        className: "aieban-face-page",
        kicker: "事务凭证",
        title: "面签或销假",
        description: "查看页面提供的面签、销假与凭证信息。",
        tab: "凭证"
      };
    }
    if (isHolidayDestinationPage()) {
      return {
        className: "aieban-holiday-page",
        kicker: "去向登记",
        title: "假期去哪儿",
        description: "查看页面提供的假期去向登记信息。",
        tab: "去向"
      };
    }
    if (isAwardDeclarationPage()) {
      return {
        className: "aieban-award-declaration-page",
        kicker: "年度评优",
        title: PAGE.includes("jiti") ? "先进集体申报表" : "先进个人申报表",
        description: "查看和填写页面提供的年度评优申报信息。",
        tab: "申报"
      };
    }
    return null;
  }

  function ensureStandardWelcome() {
    if (document.querySelector(".aieban-welcome")) return;
    const candidate = Array.from(document.querySelectorAll("strong, b"))
      .map((node) => text(node))
      .find((value) => /\d/.test(value) && value.length >= 4);
    if (!candidate) return;

    const welcome = document.createElement("div");
    welcome.className = "aieban-welcome";
    welcome.textContent = `${extractDisplayName(candidate)} 欢迎你！`;
    document.body.prepend(welcome);
  }

  function normalizeStandardTopSpacing() {
    const welcome = document.querySelector(".aieban-welcome");
    if (!welcome) return;

    document.body.insertBefore(welcome, Array.from(document.body.childNodes).find((node) => {
      return !(node.nodeType === Node.ELEMENT_NODE && (node.classList.contains("watermark") || ["SCRIPT", "STYLE", "LINK"].includes(node.tagName)));
    }) || document.body.firstChild);

    let node = document.body.firstChild;
    while (node && node !== welcome) {
      const next = node.nextSibling;
      const keep =
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains("watermark") || ["SCRIPT", "STYLE", "LINK"].includes(node.tagName)));
      if (!keep) node.remove();
      node = next;
    }
  }

  function getFirstStandardContent() {
    return Array.from(document.body.children).find((node) => {
      if (["SCRIPT", "STYLE", "LINK", "BR"].includes(node.tagName)) return false;
      if (node.classList.contains("watermark")) return false;
      return node.matches("table, form, fieldset") || text(node);
    });
  }

  function collectIntroContent(hero) {
    const firstContent = Array.from(document.body.children).find((node) => {
      if (node === hero || node.classList.contains("aieban-welcome")) return false;
      if (["SCRIPT", "STYLE", "LINK", "BR"].includes(node.tagName)) return false;
      if (node.classList.contains("watermark")) return false;
      return node.matches("table, form, fieldset");
    });
    if (!firstContent) return [];

    const fragments = [];
    let node = hero.nextSibling;
    while (node && node !== firstContent) {
      const next = node.nextSibling;
      const keep =
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains("watermark") || ["SCRIPT", "STYLE", "LINK"].includes(node.tagName)));

      if (!keep) {
        const value = text(node);
        if (value && !value.includes("欢迎") && !value.includes("AI易办")) {
          fragments.push(node);
        } else {
          node.remove();
        }
      }
      node = next;
    }

    return fragments;
  }

  function enhanceStandardEmptyState(meta) {
    const hasTable = Array.from(document.querySelectorAll("table")).some((table) => !table.closest(".xdsoft_datetimepicker"));
    const hasFormControl = !!document.querySelector("form input:not([type='hidden']), form textarea, form select, form button");
    if (hasTable || hasFormControl) return;

    const raw = getVisibleStandardText(document.body)
      .replace(getVisibleStandardText(document.querySelector(".aieban-welcome")), "")
      .replace(getVisibleStandardText(document.querySelector(".aieban-standard-hero")), "")
      .trim();
    if (!raw) return;
    const message = raw;

    const empty = document.createElement("section");
    empty.className = "aieban-standard-empty";
    empty.innerHTML = `
      <div class="aieban-standard-empty-icon">${meta.tab}</div>
      <div>
        <h2>页面信息</h2>
        <p>${message}</p>
      </div>
    `;

    const hero = document.querySelector(".aieban-standard-hero");
    hero.after(empty);

    Array.from(document.body.childNodes).forEach((node) => {
      const keep =
        node === empty ||
        node === hero ||
        node === document.querySelector(".aieban-welcome") ||
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains("watermark") || ["SCRIPT", "STYLE", "LINK"].includes(node.tagName)));
      if (!keep) node.remove();
    });
  }

  function getVisibleStandardText(root) {
    if (!root) return "";
    const fragments = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest("script, style, link, .watermark")) continue;
      const value = text(node);
      if (value) fragments.push(value);
    }
    return fragments.join(" ").replace(/\s+/g, " ").trim();
  }

  function enhanceStandardTables(meta) {
    document.querySelectorAll("table").forEach((table) => {
      if (table.closest(".xdsoft_datetimepicker")) return;
      if (table.closest(".aieban-table-scroll")) return;

      table.classList.add("aieban-standard-table");
      if (table.querySelector("input, select, textarea, button")) table.classList.add("aieban-standard-form-table");
      if (table.caption) table.caption.classList.add("aieban-standard-caption");
      if (meta.className === "aieban-training-plan-page") table.classList.add("aieban-training-table");
      if (meta.className === "aieban-career-page" && text(table).includes("霍兰德")) table.classList.add("aieban-career-intro");
      if (meta.className === "aieban-award-declaration-page" && table.rows.length <= 2 && text(table).includes("填表必读")) {
        table.classList.add("aieban-standard-instruction-table");
      }

      if (shouldWrapStandardTable(table)) {
        const wrapper = document.createElement("div");
        wrapper.className = "aieban-table-scroll";
        table.before(wrapper);
        wrapper.appendChild(table);
      }
    });
  }

  function enhanceTrainingPlanSemantics(meta) {
    if (meta.className !== "aieban-training-plan-page") return;

    const source = Array.from(document.querySelectorAll("strong, b")).find((node) => {
      return text(node).includes("本科阶段需修习的课程及学分");
    });

    if (source && !document.querySelector(".aieban-training-requirement-heading")) {
      const original = text(source);
      const title = original.match(/本科阶段需修习的课程及学分/)?.[0] || "本科阶段需修习的课程及学分";
      const note = original.match(/本科阶段需修习的课程及学分[（(]([^）)]+)[）)]/)?.[1] || "";
      const heading = document.createElement("section");
      heading.className = "aieban-training-requirement-heading";

      const kicker = document.createElement("div");
      kicker.className = "aieban-training-requirement-kicker";
      kicker.textContent = "培养进度";

      const copy = document.createElement("div");
      const headingTitle = document.createElement("h2");
      headingTitle.textContent = title;
      copy.appendChild(headingTitle);
      if (note) {
        const description = document.createElement("p");
        description.textContent = note;
        copy.appendChild(description);
      }

      heading.append(kicker, copy);
      source.replaceWith(heading);
    }

    const requirementTable = Array.from(document.querySelectorAll("table")).find((table) => {
      const value = text(table);
      return (
        value.includes("公共必修") &&
        value.includes("公共选修") &&
        value.includes("专业必修") &&
        value.includes("专业选修") &&
        value.includes("加粗的为指选课")
      );
    });
    if (!requirementTable) return;

    requirementTable.classList.add("aieban-training-requirement-table");
    const nestedTables = Array.from(requirementTable.querySelectorAll("table")).filter((table) => table !== requirementTable);
    const publicElectiveTable = nestedTables.find((table) => {
      const value = text(table);
      return value.includes("中华文化与世界文明") && value.includes("跨学院课程");
    });
    if (!publicElectiveTable) return;

    const rows = Array.from(publicElectiveTable.rows);
    const designatedSummaryIndex = rows.findIndex((row) => /以上模块各选\s*2\s*学分/.test(text(row)));
    if (designatedSummaryIndex > 1) {
      rows.slice(1, designatedSummaryIndex).forEach((row) => row.classList.add("aieban-designated-course"));
      rows[designatedSummaryIndex].classList.add("aieban-designated-summary");
    }

    rows.forEach((row) => {
      if (text(row).includes("跨学院课程")) row.classList.add("aieban-elective-requirement");
    });
  }

  function shouldWrapStandardTable(table) {
    const width = Number(table.getAttribute("width")) || table.offsetWidth || 0;
    const firstRowCells = table.rows[0]?.cells?.length || 0;
    return width >= 700 || firstRowCells >= 5 || table.querySelectorAll("td, th").length >= 16;
  }

  function enhanceStandardForms() {
    document.querySelectorAll("form").forEach((form) => {
      if (form.closest(".xdsoft_datetimepicker")) return;
      form.classList.add("aieban-standard-form");
    });

    document.querySelectorAll(".aieban-standard-page input[type='submit'], .aieban-standard-page button").forEach((button) => {
      const value = button.value || button.textContent || "";
      if (/(添加|提交|保存|开始|确认)/.test(value)) button.classList.add("is-primary");
    });
  }
