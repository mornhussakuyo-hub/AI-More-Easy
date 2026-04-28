(() => {
  if (window.__aiebanModernLoaded) return;
  window.__aiebanModernLoaded = true;

  const PAGE = location.href.toLowerCase();
  const THEME_KEY = "aieban-modern-theme";
  const SIDEBAR_KEY = "aieban-modern-sidebar-collapsed";
  const FAVORITES_KEY = "aieban-modern-favorites";
  const WATERMARK_KEY = "aieban-modern-hide-watermark";
  const EMBLEM_LIGHT = chrome.runtime.getURL("assets/sai-emblem.png");
  const EMBLEM_DARK = chrome.runtime.getURL("assets/sai-emblem-white.png");

  const text = (node) => (node?.textContent || "").replace(/\s+/g, " ").trim();
  const GUIDE_MARKDOWN = `# “AI易办平台”使用指南（本科生版）

“AI易办平台”是人工智能学院师生事务服务云平台。在该平台中，同学们可以联系班级同学、了解入党进度、登记任职经历、备案离校请假、核对考勤数据、查询课业成绩、申报年度评优、查看思政积分、填报综测推免、测评职业倾向、统计服装尺码等等，还有更多服务功能敬请期待！

## 访问路径

打开人工智能学院官网，在首页底端友情链接处，点击“师生易办”，会自动跳转至该平台在智慧珞珈的统一身份认证界面，输入你的学号和你在智慧珞珈的密码后即可登录至“AI易办平台”。

## 使用说明

微型计算机、平板电脑和手机均可使用此平台，微型计算机登录时建议使用Edge、谷歌、火狐浏览器，华为、小米、苹果和三星系列终端请使用自带浏览器，其他终端建议使用UC浏览器，其他浏览器未经测试或会出现不兼容情况，在此表示抱歉！

注意：每天凌晨2-5点为系统自动维护时间，此间可能会出现不稳定情况，请避开此时段访问，谢谢理解！若发现系统问题，请及时与辅导员联系！

## 进站欢迎页

“AI易办平台” 进站欢迎页列出了常用重要联系方式，包括辅导员、班级导师联系电话、武大校园110、24小时生命援助热线、心理咨询预约电话等。

## 功能概览

在页面左侧的导航栏可以直达事务功能区：

- 我板块设置了“安全退出”功能，为了安全起见，使用完毕建议点这里退出。
- 学业板块包含“缺课要请假”“考勤公示啦”“看看成绩吧”等栏目。这里详细记录了同学们的课堂考勤情况和修读课程成绩。
- 简历板块包含“入党进度表”“秀任职经历”“报年度评优”“思政评价积分”“职业倾向测试”“职业倾向测试Pro”等栏目。这里详细记录了同学们的入党进程、任职经历、获奖情况、参加活动情况等，可以测评霍兰德职业兴趣代码并查看详细解析。
- 事务板块包含“签必读公告”“选服装尺码”“离校要请假”“面签或销假”“假期去哪儿”等栏目。这里可以统计服装尺码、办理离校请假销假手续、备案离校去向等。

注意：担任学生干部的同学还可以在相关页面看到工作相关信息！例如在简历板块的“入党进度表”中，以团支委成员、团委组织部工作人员、学生个人的不同身份看到的也会有区别。

更多功能，敬请期待！`;

  const GRADE_NOTICE = {
    special: [
      "这里提供的成绩情况仅供你学业规划和评奖评优时参考哦！如有异议以教务系统或教学秘书提供的为准；",
      "如果这里提供的成绩情况引起了你的反感或者心情不适，请尽快向辅导员求助！"
    ],
    rules: [
      "本平台所指“公共必修”课程包括“通识必修”、“公共基础必修”、“公共基础选修（必选）”、“跨学院公共必修”；本平台所指“专业必修”课程包含“大类平台必修”、“专业核心必修”、“专业实践必修”；本平台所指“专业选修”课程包含专业模块选修和“专业任选”课程；本平台所指“公共选修”包含“通识选修”、“跨学院选修”；",
      "所有辅修课程不参与该平台的GPA和均分计算，不计入主修专业毕业学分；所有免修课程不参与该平台的GPA和均分计算，属于主修课程的计入主修专业毕业学分；",
      "所有重考、各类重修课程成绩合格的计入实得学分，同一门课程有多个合格成绩时，仅计一次实得学分；",
      "该平台在累计不及格课程学分时，允许缓考课程不参加计算，旷考课程按照不及格计算；",
      "该平台在计算GPA时，按照学生手册上的计算方法计算；在计算均分时按照最新的素质综合测评办法中的办法，公共必修、专业必修参与B1计算，专业选修、公共选修参与B2计算，均分=B1+B2；",
      "该平台在计算学期（学年）GPA、学期（学年）均分时，除重考和各类重修课程外，该学期（学年）所有选课成功且未办理撤课手续的其他课程全部参加计算，课程成绩为空的（如允许缓考、旷考）均按0分计算；",
      "该平台在计算当前GPA、当前均分时，入学以来所有选课成功且未办理撤课手续的课程全部参加计算,课程成绩为空的（如允许缓考、旷考）均按0分计算，同一课程有多个成绩时按照最高成绩计算一次；",
      "该平台在计算推免GPA时，旷考按0分计算，同一课程有多个成绩时按照首次成绩计算一次，公共选修课程不参加计算，是否具有推免资格要以当年推免条件审核结果为准；",
      "成绩显示红色表示不及格必修课程，粉色表示不及格选修课程，绿色表示该课程后来已经修过，黑色表示及格课程。"
    ]
  };
  const LEAVE_NOTICE = {
    intro: "凡是由于各种原因临时缺课者（已办理离校备案的除外），均需办理临时缺课请假备案手续。",
    title: "请假攻略（请务必按先后顺序操作）",
    steps: [
      "必须提前登录AI易办学生事务服务平台，填写临时缺课请假备案表；",
      "一条申请记录仅限于一门课程的一次课堂请假，多门课程多次课堂请假必须提交多条申请；",
      "课程名称必须准确,否则将会造成不能自动覆盖旷课记录的可能；",
      "申请提交后，请于工作时间段找辅导员当面审批、当面打印、当面签字(视情况需用手机屏幕出示“面签或销假”栏目下的缺课面签二维码)；",
      "面签后将请假条交任课老师，学生应拍照留存并发给班级导师、学习委员、科代表以供知晓，学生请假信息替换缺课信息的环节将由AI易办平台自动完成，不再需要学习委员和学习部负责人手工操作；",
      "学生需自行补上缺课导致的学业进度，并已知晓可能由于考勤不足而影响缺课课程的平时成绩。"
    ]
  };
  const SCHOOL_LEAVE_NOTICE = {
    intro: "凡是非放假期间（周末不属于放假）离校，均需办理离校请假备案手续。",
    title: "离校请假攻略（请务必按先后顺序操作）",
    steps: [
      "至少提前 24 小时登录 AI易办本科生事务服务平台，填写离校请假备案表。因病、实习等原因请假的，请一并上传医院证明、诊断报告、实习活动证明等材料。",
      "请假前应将离校计划告知家长并取得家长同意。记录提交成功后，请通知家长按系统提供的《致家长知情同意书》模板补填意见，并以照片或微信形式发送给辅导员。",
      "如请假涉及毕业设计时间段，请提前取得毕业设计导师同意。",
      "按照学校规定，请假 7 日及以上，或其他需要学院审批的情况，须经学院分管领导审批后方可办理。",
      "系统显示审核通过后，请在工作时间找辅导员打印备案表，由学生本人当面签字，并交辅导员备案后，方可按计划离校。",
      "请将签字后的请假备案表拍照留存，并告知班级导师、学习委员和相关任课老师。",
      "请按填报的返校计划按时返校；如确有特殊情况不能按时返校，请及时联系辅导员。返校后 24 小时内请及时办理销假。",
      "注意：请勿同时提交多条离校请假申请。如需重新申请，请先删除前一次申请记录。"
    ]
  };

  function getTheme() {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  }

  function applyTheme(theme = getTheme()) {
    document.documentElement.classList.toggle("aieban-theme-dark", theme === "dark");
    document.querySelectorAll(".aieban-theme-toggle").forEach((button) => {
      button.textContent = theme === "dark" ? "☾" : "☀";
      button.setAttribute("aria-label", theme === "dark" ? "切换到白天模式" : "切换到夜间模式");
      button.title = theme === "dark" ? "切换到白天模式" : "切换到夜间模式";
    });
    document.querySelectorAll(".aieban-emblem").forEach((image) => {
      image.src = theme === "dark" ? EMBLEM_DARK : EMBLEM_LIGHT;
    });
  }

  function applyThemeToAllFrames(theme) {
    applyTheme(theme);
    try {
      Array.from(window.top.frames).forEach((frame) => {
        frame.document.documentElement.classList.toggle("aieban-theme-dark", theme === "dark");
        frame.document.querySelectorAll(".aieban-theme-toggle").forEach((button) => {
          button.textContent = theme === "dark" ? "☾" : "☀";
          button.setAttribute("aria-label", theme === "dark" ? "切换到白天模式" : "切换到夜间模式");
          button.title = theme === "dark" ? "切换到白天模式" : "切换到夜间模式";
        });
        frame.document.querySelectorAll(".aieban-emblem").forEach((image) => {
          image.src = theme === "dark" ? EMBLEM_DARK : EMBLEM_LIGHT;
        });
      });
    } catch {
      // Some pages may be unavailable while frames are loading.
    }
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyThemeToAllFrames(theme);
  }

  function isWatermarkHidden() {
    return localStorage.getItem(WATERMARK_KEY) === "true";
  }

  function applyWatermarkPreference(hidden = isWatermarkHidden()) {
    document.documentElement.classList.toggle("aieban-hide-watermark", hidden);
    document.querySelectorAll(".aieban-watermark-toggle").forEach((button) => {
      button.textContent = hidden ? "显" : "隐";
      button.setAttribute("aria-label", hidden ? "显示背景水印" : "隐藏背景水印");
      button.title = hidden ? "显示背景水印" : "隐藏背景水印";
    });
  }

  function applyWatermarkPreferenceToAllFrames(hidden) {
    applyWatermarkPreference(hidden);
    try {
      Array.from(window.top.frames).forEach((frame) => {
        frame.document.documentElement.classList.toggle("aieban-hide-watermark", hidden);
        frame.document.querySelectorAll(".aieban-watermark-toggle").forEach((button) => {
          button.textContent = hidden ? "显" : "隐";
          button.setAttribute("aria-label", hidden ? "显示背景水印" : "隐藏背景水印");
          button.title = hidden ? "显示背景水印" : "隐藏背景水印";
        });
      });
    } catch {
      // Some frames may still be loading.
    }
  }

  function setWatermarkHidden(hidden) {
    localStorage.setItem(WATERMARK_KEY, String(hidden));
    applyWatermarkPreferenceToAllFrames(hidden);
  }

  applyTheme();
  applyWatermarkPreference();
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY) applyTheme(event.newValue === "dark" ? "dark" : "light");
    if (event.key === WATERMARK_KEY) applyWatermarkPreference(event.newValue === "true");
  });

  function enhanceFrameset() {
    document.documentElement.classList.add("aieban-modern-root");

    const frameSets = document.querySelectorAll("frameset");
    const root = frameSets[0];
    const content = frameSets[1];
    const sidebarCollapsed = localStorage.getItem(SIDEBAR_KEY) === "true";

    if (root) root.setAttribute("rows", "72,*");
    if (content) content.setAttribute("cols", sidebarCollapsed ? "64,*" : "232,*");
  }

  function isTopFrame() {
    return PAGE.includes("top_menu") || !!document.querySelector('img[src*="topbanner"]');
  }

  function isMenuFrame() {
    return PAGE.includes("left_menu") || document.querySelectorAll('a[target="main"]').length >= 4;
  }

  function isAttendancePage() {
    const bodyText = text(document.body);
    return PAGE.includes("kaoqin") || bodyText.includes("到课数据") || (bodyText.includes("节次") && bodyText.includes("时间段") && bodyText.includes("周一"));
  }

  function isAttendancePublicPage() {
    const bodyText = text(document.body);
    return PAGE.includes("kaoqin_liulan") || bodyText.includes("考勤累计数据公示");
  }

  function isLeavePage() {
    const bodyText = text(document.body);
    return PAGE.includes("queke") || (bodyText.includes("缺课") && bodyText.includes("请假"));
  }

  function isSchoolLeavePage() {
    return PAGE.includes("lixiao_beian") || !!document.forms.lixiaobeian || !!document.querySelector('form[action*="stuser_lixiao_beian"]');
  }

  function isIdeologyScorePage() {
    return PAGE.includes("jiangcheng_chaxunjifen") || !!document.querySelector('a[href*="wbnewsid=8541"]');
  }

  function isAnnualAwardPage() {
    return PAGE.includes("pingyou_shenbao") || !!document.forms.gerenshenbao || !!document.forms.jitishenbao;
  }

  function isGradePage() {
    return PAGE.includes("chengji_chaxun") || !!document.querySelector('form[action*="chengji_chaxun_toexcel"]');
  }

  function isClothingSizePage() {
    const bodyText = text(document.body);
    return PAGE.includes("fuzhuang_tianbao") || bodyText.includes("服装") || bodyText.includes("尺码");
  }

  function isPartyProgressPage() {
    return PAGE.includes("rudang_chaxun") || !!document.querySelector('a[href*="wbnewsid=9011"], a[href*="wbnewsid=8981"]');
  }

  function isGuidePage() {
    const bodyText = text(document.body);
    return PAGE.includes("%e4%bd%bf%e7%94%a8%e6%8c%87%e5%8d%97") || (bodyText.includes("使用指南") && bodyText.includes("访问路径") && bodyText.includes("功能概览"));
  }

  function isLoginPage() {
    return !!document.querySelector("form#loginform, form[name='loginform']") || (document.querySelector('input[type="password"]') && text(document.body).includes("登录"));
  }

  function collectMenuSections() {
    const dedupeSections = (sections) =>
      sections
        .map((section) => {
          const seen = new Set();
          const links = section.links.filter((link) => {
            const key = `${link.label}::${link.href}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          return { ...section, links };
        })
        .filter((section) => section.links.length);

    const rootTable = document.body?.querySelector(":scope > table");
    if (rootTable?.tBodies?.[0]) {
      const sections = [];
      let current = null;

      Array.from(rootTable.tBodies[0].children).forEach((row) => {
        const directCell = row.children[0];
        if (!directCell) return;

        const titleNode = directCell.querySelector(":scope > strong");
        if (titleNode) {
          const title = text(titleNode);
          if (!title) return;
          current = { title, links: [] };
          sections.push(current);
          return;
        }

        const links = Array.from(directCell.querySelectorAll('a[href]'));
        if (!links.length) return;
        if (!current) {
          current = { title: "常用", links: [] };
          sections.push(current);
        }

        links.forEach((link) => {
          current.links.push({
            label: text(link),
            href: link.href,
            target: link.target || "main"
          });
        });
      });

      return dedupeSections(sections);
    }

    const sections = [];
    let current = null;

    document.querySelectorAll("tr").forEach((row) => {
      const titleNode = row.querySelector("strong");
      const links = Array.from(row.querySelectorAll('a[href]'));

      if (titleNode && links.length === 0) {
        const title = text(titleNode);
        if (!title) return;
        current = { title, links: [] };
        sections.push(current);
        return;
      }

      if (!links.length) return;
      if (!current) {
        current = { title: "常用", links: [] };
        sections.push(current);
      }

      links.forEach((link) => {
        current.links.push({
          label: text(link),
          href: link.href,
          target: link.target || "main"
        });
      });
    });

    return dedupeSections(sections);
  }

  function sectionIcon(index) {
    return ["概", "学", "简", "事", "更"][index] || "项";
  }

  function isLogoutLink(link) {
    const label = text(link);
    const href = link.href || "";
    return href.includes("action=logout") || label.includes("安全退出") || label.includes("退出");
  }

  function menuItemKey(item) {
    return item?.href || `${item?.label || ""}::${item?.target || ""}`;
  }

  function readFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      const seen = new Set();
      return parsed
        .filter((item) => item && item.label && item.href)
        .filter((item) => {
          const probe = document.createElement("a");
          probe.href = item.href;
          probe.textContent = item.label;
          if (isLogoutLink(probe)) return false;
          const key = menuItemKey(item);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((item) => ({
          label: item.label,
          href: item.href,
          target: item.target || "main"
        }));
    } catch {
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  function getDialogDocument() {
    try {
      const mainDocument = window.top.frames.main?.document;
      return mainDocument?.body ? mainDocument : document;
    } catch {
      return document;
    }
  }

  function showLogoutDialog() {
    const dialogDocument = getDialogDocument();
    const existing = dialogDocument.querySelector(".aieban-logout-overlay");
    if (existing) existing.remove();

    return new Promise((resolve) => {
      const overlay = dialogDocument.createElement("div");
      overlay.className = "aieban-logout-overlay";
      overlay.innerHTML = `
        <div class="aieban-logout-dialog" role="dialog" aria-modal="true" aria-labelledby="aieban-logout-title">
          <div class="aieban-logout-icon">!</div>
          <div class="aieban-logout-copy">
            <div id="aieban-logout-title" class="aieban-logout-title">确认退出？</div>
            <div class="aieban-logout-desc">退出后需要重新登录 AI更易办。</div>
          </div>
          <div class="aieban-logout-actions">
            <button type="button" class="aieban-logout-cancel">取消</button>
            <button type="button" class="aieban-logout-confirm">安全退出</button>
          </div>
        </div>
      `;

      let onKeyDown;
      const close = (confirmed) => {
        dialogDocument.removeEventListener("keydown", onKeyDown);
        overlay.classList.add("is-closing");
        setTimeout(() => overlay.remove(), 140);
        resolve(confirmed);
      };

      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) close(false);
      });
      overlay.querySelector(".aieban-logout-cancel").addEventListener("click", () => close(false));
      overlay.querySelector(".aieban-logout-confirm").addEventListener("click", () => close(true));

      onKeyDown = (event) => {
        if (event.key === "Escape") {
          close(false);
        }
      };
      dialogDocument.addEventListener("keydown", onKeyDown);

      dialogDocument.body.appendChild(overlay);
      overlay.querySelector(".aieban-logout-cancel").focus();
    });
  }

  function navigateFromLink(link) {
    const href = link.href;
    const target = link.target;
    if (!href) return;

    if (target === "_top") {
      window.top.location.href = href;
    } else if (target === "_blank") {
      window.open(href, "_blank", "noopener");
    } else if (target) {
      try {
        window.top.frames[target].location.href = href;
      } catch {
        window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
  }

  function confirmLogout(event) {
    event.preventDefault();
    event.stopPropagation();

    const link = event.currentTarget;
    showLogoutDialog().then((confirmed) => {
      if (confirmed) navigateFromLink(link);
    });
  }

  function enhanceTopFrame() {
    document.documentElement.classList.add("aieban-modern-frame", "aieban-modern-top-frame");

    document.body.innerHTML = `
      <header class="aieban-topbar">
        <div class="aieban-brand">
          <div class="aieban-mark">
            <img class="aieban-emblem" src="${getTheme() === "dark" ? EMBLEM_DARK : EMBLEM_LIGHT}" alt="人工智能学院院徽">
          </div>
          <div>
            <div class="aieban-title">AI易办</div>
          </div>
        </div>
        <div class="aieban-topbar-actions">
          <div class="aieban-topbar-meta">本科生事务服务平台</div>
          <button type="button" class="aieban-watermark-toggle"></button>
          <button type="button" class="aieban-theme-toggle"></button>
        </div>
      </header>
    `;
    applyTheme();
    applyWatermarkPreference();

    document.querySelector(".aieban-theme-toggle")?.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });

    document.querySelector(".aieban-watermark-toggle")?.addEventListener("click", () => {
      setWatermarkHidden(!isWatermarkHidden());
    });
  }

  function enhanceMenuFrame() {
    const watermark = document.querySelector(".watermark");
    const sections = collectMenuSections();
    document.documentElement.classList.add("aieban-modern-frame", "aieban-modern-menu-frame");
    const storageKey = "aieban-modern-collapsed-menu";
    const savedCollapsed = localStorage.getItem(storageKey);
    const defaultCollapsed = sections.map((_, index) => `section-${index}`).filter((_, index) => index > 0);
    const collapsed = new Set(JSON.parse(savedCollapsed || JSON.stringify(defaultCollapsed)));

    const saveCollapsed = () => {
      localStorage.setItem(storageKey, JSON.stringify([...collapsed]));
    };

    let favorites = readFavorites();
    const favoriteButtons = new Map();
    const isFavorite = (item) => favorites.some((favorite) => menuItemKey(favorite) === menuItemKey(item));
    let favoriteGroup;
    let favoriteList;
    let favoriteCount;

    const createMenuRow = (item, options = {}) => {
      const row = document.createElement("div");
      row.className = "aieban-nav-row";

      const link = document.createElement("a");
      link.className = "aieban-nav-link";
      link.href = item.href;
      link.target = item.target;
      link.textContent = item.label;

      const logout = isLogoutLink(link);
      if (logout) {
        link.classList.add("aieban-nav-link-danger");
        link.addEventListener("click", confirmLogout);
      }

      row.appendChild(link);

      if (!logout) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "aieban-favorite-toggle";
        const active = isFavorite(item);
        button.classList.toggle("is-active", active);
        button.textContent = active ? "★" : "☆";
        button.setAttribute("aria-label", active ? "取消收藏" : "收藏页面");
        button.title = active ? "取消收藏" : "收藏页面";
        row.appendChild(button);

        const key = menuItemKey(item);
        if (!options.favoriteItem) {
          if (!favoriteButtons.has(key)) favoriteButtons.set(key, []);
          favoriteButtons.get(key).push(button);
        }

        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const exists = isFavorite(item);
          favorites = exists
            ? favorites.filter((favorite) => menuItemKey(favorite) !== key)
            : [...favorites, { label: item.label, href: item.href, target: item.target || "main" }];
          saveFavorites(favorites);
          renderFavorites();
          syncFavoriteButtons();
        });
      }

      if (options.favoriteItem) row.classList.add("is-favorite-row");
      return row;
    };

    const syncFavoriteButtons = () => {
      favoriteButtons.forEach((buttons, key) => {
        const active = favorites.some((favorite) => menuItemKey(favorite) === key);
        buttons.forEach((button) => {
          button.classList.toggle("is-active", active);
          button.textContent = active ? "★" : "☆";
          button.setAttribute("aria-label", active ? "取消收藏" : "收藏页面");
          button.title = active ? "取消收藏" : "收藏页面";
        });
      });
    };

    const renderFavorites = () => {
      if (!favoriteList || !favoriteCount) return;
      favoriteList.replaceChildren();
      favoriteCount.textContent = String(favorites.length);
      favoriteGroup?.classList.toggle("is-empty", favorites.length === 0);

      if (!favorites.length) {
        const empty = document.createElement("div");
        empty.className = "aieban-favorites-empty";
        empty.textContent = "还没有收藏的页面";
        favoriteList.appendChild(empty);
        return;
      }

      favorites.forEach((item) => {
        favoriteList.appendChild(createMenuRow(item, { favoriteItem: true }));
      });
    };

    const sidebarCollapsed = localStorage.getItem(SIDEBAR_KEY) === "true";
    const setParentSidebarWidth = (width, animate = true) => {
      try {
        const frameSets = window.parent.document.querySelectorAll("frameset");
        const contentFrameSet = frameSets[1];
        if (!contentFrameSet) return;

        if (!animate) {
          contentFrameSet.setAttribute("cols", `${width},*`);
          return;
        }

        const current = parseFloat(contentFrameSet.getAttribute("cols")) || 232;
        const target = width;
        const duration = 220;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const next = Math.round(current + (target - current) * eased);
          contentFrameSet.setAttribute("cols", `${next},*`);
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      } catch {
        // The menu still works if the parent frameset is not ready yet.
      }
    };

    const applySidebarCollapse = (shouldCollapse, animate = true) => {
      document.documentElement.classList.toggle("aieban-sidebar-collapsed", shouldCollapse);
      document.querySelector(".aieban-sidebar-collapse-toggle")?.setAttribute("aria-label", shouldCollapse ? "展开导航栏" : "收起导航栏");
      document.querySelector(".aieban-sidebar-collapse-toggle")?.setAttribute("title", shouldCollapse ? "展开导航栏" : "收起导航栏");
      document.querySelector(".aieban-sidebar-collapse-toggle")?.replaceChildren(shouldCollapse ? "›" : "‹");
      setParentSidebarWidth(shouldCollapse ? 64 : 232, animate);
    };

    const nav = document.createElement("nav");
    nav.className = "aieban-sidebar";
    nav.setAttribute("aria-label", "AI易办菜单");

    const head = document.createElement("div");
    head.className = "aieban-sidebar-head";
    head.innerHTML = `
      <div>
        <div class="aieban-sidebar-kicker">导航</div>
        <div class="aieban-sidebar-title">事务中心</div>
      </div>
      <button type="button" class="aieban-sidebar-collapse-toggle"></button>
    `;
    nav.appendChild(head);

    const tools = document.createElement("div");
    tools.className = "aieban-sidebar-tools";
    tools.innerHTML = `
      <button type="button" data-action="expand">展开全部</button>
      <button type="button" data-action="collapse">收起全部</button>
    `;
    nav.appendChild(tools);

    favoriteGroup = document.createElement("section");
    favoriteGroup.className = "aieban-nav-group aieban-nav-favorites";

    const favoriteToggle = document.createElement("button");
    favoriteToggle.className = "aieban-nav-toggle";
    favoriteToggle.type = "button";
    favoriteToggle.setAttribute("aria-expanded", "true");
    favoriteToggle.setAttribute("title", "收藏页面");
    favoriteToggle.innerHTML = `
      <span class="aieban-nav-icon">★</span>
      <span class="aieban-nav-name">收藏页面</span>
      <span class="aieban-nav-count">0</span>
      <span class="aieban-nav-chevron"></span>
    `;
    favoriteCount = favoriteToggle.querySelector(".aieban-nav-count");
    favoriteGroup.appendChild(favoriteToggle);

    favoriteList = document.createElement("div");
    favoriteList.className = "aieban-nav-list";
    favoriteGroup.appendChild(favoriteList);

    favoriteToggle.addEventListener("click", () => {
      if (document.documentElement.classList.contains("aieban-sidebar-collapsed")) {
        localStorage.setItem(SIDEBAR_KEY, "false");
        applySidebarCollapse(false);
        favoriteGroup.classList.remove("is-collapsed");
        favoriteToggle.setAttribute("aria-expanded", "true");
        return;
      }
      const isCollapsed = favoriteGroup.classList.toggle("is-collapsed");
      favoriteToggle.setAttribute("aria-expanded", String(!isCollapsed));
    });

    nav.appendChild(favoriteGroup);

    sections.forEach((section, index) => {
      const sectionId = `section-${index}`;
      const group = document.createElement("section");
      group.className = "aieban-nav-group";
      group.dataset.sectionId = sectionId;
      if (collapsed.has(sectionId)) group.classList.add("is-collapsed");

      const toggle = document.createElement("button");
      toggle.className = "aieban-nav-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", String(!collapsed.has(sectionId)));
      toggle.setAttribute("title", section.title);
      toggle.innerHTML = `
        <span class="aieban-nav-icon">${sectionIcon(index)}</span>
        <span class="aieban-nav-name">${section.title}</span>
        <span class="aieban-nav-count">${section.links.length}</span>
        <span class="aieban-nav-chevron"></span>
      `;
      group.appendChild(toggle);

      const list = document.createElement("div");
      list.className = "aieban-nav-list";

      section.links.forEach((item) => {
        list.appendChild(createMenuRow(item));
      });

      group.appendChild(list);

      toggle.addEventListener("click", () => {
        if (document.documentElement.classList.contains("aieban-sidebar-collapsed")) {
          localStorage.setItem(SIDEBAR_KEY, "false");
          applySidebarCollapse(false);
          group.classList.remove("is-collapsed");
          toggle.setAttribute("aria-expanded", "true");
          collapsed.delete(sectionId);
          saveCollapsed();
          return;
        }

        const isCollapsed = group.classList.toggle("is-collapsed");
        toggle.setAttribute("aria-expanded", String(!isCollapsed));
        if (isCollapsed) {
          collapsed.add(sectionId);
        } else {
          collapsed.delete(sectionId);
        }
        saveCollapsed();
      });

      nav.appendChild(group);
    });

    tools.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const shouldCollapse = button.dataset.action === "collapse";
      document.querySelectorAll(".aieban-nav-group").forEach((group, index) => {
        if (group.classList.contains("aieban-nav-favorites")) {
          group.classList.toggle("is-collapsed", shouldCollapse);
          group.querySelector(".aieban-nav-toggle")?.setAttribute("aria-expanded", String(!shouldCollapse));
          return;
        }
        const id = group.dataset.sectionId || `section-${index}`;
        group.classList.toggle("is-collapsed", shouldCollapse);
        group.querySelector(".aieban-nav-toggle")?.setAttribute("aria-expanded", String(!shouldCollapse));
        if (shouldCollapse) {
          collapsed.add(id);
        } else {
          collapsed.delete(id);
        }
      });
      saveCollapsed();
    });

    document.body.replaceChildren(nav);
    renderFavorites();
    syncFavoriteButtons();
    applySidebarCollapse(sidebarCollapsed, false);

    document.querySelector(".aieban-sidebar-collapse-toggle")?.addEventListener("click", () => {
      const nextCollapsed = !document.documentElement.classList.contains("aieban-sidebar-collapsed");
      localStorage.setItem(SIDEBAR_KEY, String(nextCollapsed));
      applySidebarCollapse(nextCollapsed);
    });

    if (watermark) document.body.appendChild(watermark);
  }

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
    notice.textContent = "系统维护：每日 1:00-3:00 暂停访问，请错峰使用。";

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

  function enhanceDateTimePicker() {
    const monthNames = {
      January: "一月",
      February: "二月",
      March: "三月",
      April: "四月",
      May: "五月",
      June: "六月",
      July: "七月",
      August: "八月",
      September: "九月",
      October: "十月",
      November: "十一月",
      December: "十二月"
    };
    const weekNames = {
      Sun: "日",
      Mon: "一",
      Tue: "二",
      Wed: "三",
      Thu: "四",
      Fri: "五",
      Sat: "六"
    };

    document.querySelectorAll('input[name="quekejieciqi"], input[name="quekejiecizhi"]').forEach((input) => {
      input.classList.add("aieban-period-input");
      input.removeAttribute("readonly");
      input.inputMode = "numeric";
      input.maxLength = 2;
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 2);
      });
    });

    try {
      window.jQuery?.datetimepicker?.setLocale?.("zh");
      window.jQuery?.datetimepicker?.setLocale?.("ch");
    } catch {
      // The local datepicker build may not expose locale helpers.
    }

    const translate = () => {
      document.querySelectorAll(".xdsoft_datetimepicker").forEach((picker) => {
        picker.classList.add("aieban-modern-datepicker");
        picker.querySelectorAll(".aieban-button").forEach((button) => button.classList.remove("aieban-button"));
        picker.querySelectorAll(".aieban-table").forEach((table) => table.classList.remove("aieban-table"));

        picker.querySelectorAll(".xdsoft_month span, .xdsoft_monthselect .xdsoft_option").forEach((node) => {
          const value = text(node);
          if (monthNames[value]) node.textContent = monthNames[value];
        });

        picker.querySelectorAll(".xdsoft_calendar th").forEach((node) => {
          const value = text(node);
          if (weekNames[value]) node.textContent = weekNames[value];
        });

        picker.querySelectorAll(".xdsoft_prev").forEach((button) => {
          button.setAttribute("aria-label", "上一个");
          button.title = "上一个";
        });
        picker.querySelectorAll(".xdsoft_next").forEach((button) => {
          button.setAttribute("aria-label", "下一个");
          button.title = "下一个";
        });
        picker.querySelectorAll(".xdsoft_today_button").forEach((button) => {
          button.setAttribute("aria-label", "今天");
          button.title = "今天";
        });
      });
    };

    translate();

    if (window.__aiebanDatePickerObserver) return;
    window.__aiebanDatePickerObserver = new MutationObserver(translate);
    window.__aiebanDatePickerObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function enhanceIdeologyScorePage() {
    if (!isIdeologyScorePage() || document.querySelector(".aieban-policy-links")) return;

    const policies = [
      {
        id: "8661",
        title: "《人工智能学院本科生离校请假备案办法》"
      },
      {
        id: "8531",
        title: "《人工智能学院本科生通报表扬、通报批评适用办法》"
      },
      {
        id: "8541",
        title: "《人工智能学院本科生思想政治素质综合评价实施细则》"
      }
    ];

    const links = policies
      .map((policy) => {
        const link = document.querySelector(`a[href*="wbnewsid=${policy.id}"]`);
        if (!link) return null;
        link.textContent = policy.title;
        link.classList.add("aieban-policy-button");
        return link;
      })
      .filter(Boolean);

    if (!links.length) return;

    document.body.classList.add("aieban-ideology-page");

    const panel = document.createElement("section");
    panel.className = "aieban-policy-links";
    panel.setAttribute("aria-label", "相关办法与细则");

    const title = document.createElement("div");
    title.className = "aieban-policy-title";
    title.textContent = "相关办法与细则";
    panel.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "aieban-policy-actions";
    links.forEach((link) => actions.appendChild(link));
    panel.appendChild(actions);

    const oldWrapper = links[0].closest("table");
    const welcome = document.querySelector(".aieban-welcome");
    if (welcome) {
      welcome.after(panel);
    } else if (oldWrapper) {
      oldWrapper.before(panel);
    } else {
      document.body.prepend(panel);
    }

    if (oldWrapper) oldWrapper.remove();
  }

  function createGradeNotice() {
    const notice = document.createElement("section");
    notice.className = "aieban-grade-notice";

    const special = document.createElement("section");
    special.className = "aieban-grade-section";
    special.innerHTML = "<h2>特别说明</h2>";
    GRADE_NOTICE.special.forEach((line) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      special.appendChild(paragraph);
    });

    const rules = document.createElement("section");
    rules.className = "aieban-grade-section";
    rules.innerHTML = "<h2>AI易办成绩计算说明2026new</h2>";
    const list = document.createElement("ol");
    GRADE_NOTICE.rules.forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.appendChild(item);
    });
    rules.appendChild(list);

    notice.append(special, rules);
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
    const notice = createGradeNotice();
    const hero = createGradeHero(cacheTime);

    let node = document.body.firstChild;
    while (node && node !== form) {
      const next = node.nextSibling;
      const keep =
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("watermark")) ||
        (node.nodeType === Node.ELEMENT_NODE && ["SCRIPT", "STYLE"].includes(node.tagName));

      if (!keep) node.remove();
      node = next;
    }

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

    const article = document.createElement("article");
    article.className = "aieban-guide";

    let list = null;
    GUIDE_MARKDOWN.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        list = null;
        return;
      }

      if (trimmed.startsWith("# ")) {
        list = null;
        const heading = document.createElement("h1");
        heading.textContent = trimmed.slice(2);
        article.appendChild(heading);
        return;
      }

      if (trimmed.startsWith("## ")) {
        list = null;
        const heading = document.createElement("h2");
        heading.textContent = trimmed.slice(3);
        article.appendChild(heading);
        return;
      }

      if (trimmed.startsWith("- ")) {
        if (!list) {
          list = document.createElement("ul");
          article.appendChild(list);
        }
        const item = document.createElement("li");
        item.textContent = trimmed.slice(2);
        list.appendChild(item);
        return;
      }

      list = null;
      const paragraph = document.createElement("p");
      paragraph.textContent = trimmed;
      article.appendChild(paragraph);
    });

    document.body.replaceChildren(article);
    return true;
  }

  function enhanceAttendancePage() {
    if (!isAttendancePage()) return;

    document.body.classList.add("aieban-attendance-page");

    const scheduleTable = findAttendanceScheduleTable();
    if (!scheduleTable) return;

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
      note.textContent = "每日凌晨自动更新";
      toolbar.appendChild(note);

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

      if (toolbar.children.length > 1) {
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

  function enhanceClothingSizePage() {
    if (!isClothingSizePage() || document.querySelector(".aieban-clothing-card")) return;

    document.body.classList.add("aieban-clothing-page");

    const candidate = Array.from(document.querySelectorAll("strong, b"))
      .map((node) => text(node))
      .find((value) => /\d/.test(value) && value.length >= 4);
    if (!document.querySelector(".aieban-welcome") && candidate) {
      const welcome = document.createElement("div");
      welcome.className = "aieban-welcome";
      welcome.textContent = `${extractDisplayName(candidate)} 欢迎你！`;
      document.body.prepend(welcome);
    }

    const card = document.createElement("section");
    card.className = "aieban-clothing-card";
    card.innerHTML = `
      <div class="aieban-clothing-icon">衣</div>
      <div>
        <div class="aieban-clothing-kicker">服装尺码</div>
        <h1>暂无需要填报的服装信息</h1>
        <p>如需填报或修改服装尺码，请联系年级负责人。</p>
      </div>
    `;

    const welcome = document.querySelector(".aieban-welcome");
    if (welcome) {
      welcome.after(card);
    } else {
      document.body.prepend(card);
    }

    let node = document.body.firstChild;
    while (node) {
      const next = node.nextSibling;
      const keep =
        node === card ||
        node === welcome ||
        node.nodeType === Node.COMMENT_NODE ||
        (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("watermark")) ||
        (node.nodeType === Node.ELEMENT_NODE && ["SCRIPT", "STYLE", "LINK"].includes(node.tagName));

      if (!keep) node.remove();
      node = next;
    }
  }

  function enhancePartyProgressPage() {
    if (!isPartyProgressPage() || document.body.classList.contains("aieban-party-enhanced")) return;

    document.body.classList.add("aieban-party-page", "aieban-party-enhanced");

    const welcome = document.querySelector(".aieban-welcome");
    const hero = document.createElement("section");
    hero.className = "aieban-party-hero";
    hero.innerHTML = `
      <div>
        <div class="aieban-party-kicker">组织发展</div>
        <h1>入党进度表</h1>
        <p>查看入党材料递交状态、党支部联系方式和党员信息。</p>
      </div>
    `;

    if (welcome) {
      welcome.after(hero);
    } else {
      document.body.prepend(hero);
    }

    Array.from(document.querySelectorAll("strong, b")).forEach((node) => {
      if (!text(node).includes("入党进度表")) return;
      let previous = node.previousSibling;
      while (
        previous &&
        ((previous.nodeType === Node.TEXT_NODE && /^[\s\-—]+$/.test(previous.textContent || "")) ||
          (previous.nodeType === Node.ELEMENT_NODE && previous.tagName === "BR"))
      ) {
        const nextPrevious = previous.previousSibling;
        previous.remove();
        previous = nextPrevious;
      }

      let next = node.nextSibling;
      let safety = 0;
      while (
        next &&
        safety < 8 &&
        ((next.nodeType === Node.TEXT_NODE && /^[\s\-—]+$/.test(next.textContent || "")) ||
          (next.nodeType === Node.ELEMENT_NODE && next.tagName === "BR"))
      ) {
        const nextSibling = next.nextSibling;
        next.remove();
        next = nextSibling;
        safety += 1;
      }

      node.remove();
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const looseTextNodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = text(node);
      if (node.parentNode === document.body && (value === "特别注意" || /^[\-—]{8,}$/.test(value))) {
        looseTextNodes.push(node);
      }
    }
    looseTextNodes.forEach((node) => node.remove());

    const policies = [
      {
        id: "9011",
        title: "《人工智能学院学生党总支关于发展本科生党员的具体条件》"
      },
      {
        id: "8981",
        title: "《人工智能学院学生党总支关于本科生党员民主评议合格的标准》"
      }
    ];

    const links = policies
      .map((policy) => {
        const link = document.querySelector(`a[href*="wbnewsid=${policy.id}"]`);
        if (!link) return null;
        link.textContent = policy.title;
        link.classList.add("aieban-party-policy-button");
        return link;
      })
      .filter(Boolean);

    if (links.length) {
      const panel = document.createElement("section");
      panel.className = "aieban-party-policy-links";
      panel.setAttribute("aria-label", "入党相关文件");

      const title = document.createElement("div");
      title.className = "aieban-party-policy-title";
      title.textContent = "入党相关文件";
      panel.appendChild(title);

      const actions = document.createElement("div");
      actions.className = "aieban-party-policy-actions";
      links.forEach((link) => actions.appendChild(link));
      panel.appendChild(actions);

      const oldWrapper = links[0].closest("table");
      if (hero) {
        hero.after(panel);
      } else if (oldWrapper) {
        oldWrapper.before(panel);
      } else {
        links[0].before(panel);
      }

      if (oldWrapper && !oldWrapper.querySelector("table")) oldWrapper.remove();
    }

    const resources = [
      {
        selector: 'a[href*="12371.cn"]',
        title: "学习党的章程",
        desc: "查看党章党规与党员学习材料"
      },
      {
        selector: 'a[href*="xuexi.cn"]',
        title: "学习强国",
        desc: "打开党员学习平台"
      }
    ]
      .map((resource) => {
        const link = document.querySelector(resource.selector);
        if (!link) return null;
        link.classList.add("aieban-party-resource-button");
        link.replaceChildren();
        link.innerHTML = `
          <span>${resource.title}</span>
          <small>${resource.desc}</small>
        `;
        return link;
      })
      .filter(Boolean);

    if (resources.length) {
      const resourcePanel = document.createElement("section");
      resourcePanel.className = "aieban-party-resource-links";
      resourcePanel.innerHTML = `
        <div class="aieban-party-policy-title">学习入口</div>
        <div class="aieban-party-resource-actions"></div>
      `;
      const actions = resourcePanel.querySelector(".aieban-party-resource-actions");
      resources.forEach((link) => actions.appendChild(link));

      const policyPanel = document.querySelector(".aieban-party-policy-links");
      (policyPanel || hero).after(resourcePanel);
    }

    document.querySelectorAll('a[href^="tencent://message"]').forEach((link) => {
      link.classList.add("aieban-qq-button");
      link.setAttribute("title", "QQ联系");
      link.textContent = "QQ联系";
    });

    Array.from(document.querySelectorAll('font[color="red"]')).forEach((node) => {
      if (text(node).length > 24) node.classList.add("aieban-party-notice");
    });

    Array.from(document.querySelectorAll("font")).forEach((node) => {
      if (node.querySelector(".aieban-qq-button") || text(node).includes("党支部")) {
        node.classList.add("aieban-party-info-card");
      }
    });
  }

  function enhanceLoginPage() {
    if (!isLoginPage()) return false;

    document.body.classList.add("aieban-login-page");

    const form = document.querySelector("form#loginform, form[name='loginform']") || document.querySelector('input[type="password"]')?.closest("form");
    if (!form || document.querySelector(".aieban-login-shell")) return true;

    form.classList.add("aieban-login-form");

    const shell = document.createElement("main");
    shell.className = "aieban-login-shell";
    shell.innerHTML = `
      <section class="aieban-login-card" aria-label="AI易办登录">
        <div class="aieban-login-hero">
          <div class="aieban-login-brand">
            <img class="aieban-emblem" src="${getTheme() === "dark" ? EMBLEM_DARK : EMBLEM_LIGHT}" alt="人工智能学院院徽">
            <div>
              <div class="aieban-login-kicker">AI更易办</div>
              <h1>欢迎回来</h1>
            </div>
          </div>
          <p class="aieban-login-copy">登录后继续使用本科生事务服务平台。</p>
        </div>
        <div class="aieban-login-panel">
          <div class="aieban-login-form-slot"></div>
        </div>
      </section>
    `;

    const slot = shell.querySelector(".aieban-login-form-slot");
    form.before(shell);
    slot.appendChild(form);

    form.querySelectorAll("table").forEach((table) => {
      table.classList.add("aieban-login-table");
      table.removeAttribute("border");
      table.removeAttribute("width");
    });

    const username = form.querySelector('input[name="username"], input[type="text"]');
    const password = form.querySelector('input[name="password"], input[type="password"]');
    const identity = form.querySelector('select[name="shenfen"], select[name="select1"], select');
    const submit = form.querySelector('input[type="submit"], button[type="submit"], input[name="submit"]');
    const controls = [username, password, identity, submit].filter(Boolean);
    if (controls.length >= 3 && !form.querySelector(".aieban-login-fields")) {
      const fields = document.createElement("div");
      fields.className = "aieban-login-fields";

      controls.forEach((control) => {
        const row = document.createElement("label");
        row.className = "aieban-login-field";
        if (control === submit) row.classList.add("is-submit");

        const label = document.createElement("span");
        if (control === username) {
          label.textContent = "账号";
        } else if (control === password) {
          label.textContent = "密码";
        } else if (control === identity) {
          label.textContent = "身份";
        } else {
          label.textContent = "";
        }

        const parent = control.parentElement;
        fields.appendChild(row);
        if (label.textContent) row.appendChild(label);
        row.appendChild(control);

        if (parent && parent !== form && !text(parent) && parent.querySelectorAll("input, select, button").length === 0) {
          parent.remove();
        }
      });

      slot.appendChild(fields);
      form.replaceChildren(fields);
    }

    form.querySelectorAll('input[type="text"], input:not([type]), input[type="password"]').forEach((input) => {
      const name = `${input.name || ""} ${input.id || ""}`.toLowerCase();
      if (!input.placeholder) {
        if (input.type === "password") {
          input.placeholder = "请输入密码";
        } else if (name.includes("user") || name.includes("name") || name.includes("no") || name.includes("account")) {
          input.placeholder = "请输入学号或账号";
        }
      }
    });

    form.querySelectorAll('input[type="submit"], input[type="button"], button').forEach((button) => {
      const label = text(button) || button.value || "";
      const isSubmit = button.matches('input[type="submit"], button[type="submit"]');
      if (isSubmit || /login|登陆|登录/i.test(label) || !label.trim()) {
        if (button.tagName === "INPUT") {
          button.value = "登录";
        } else {
          button.textContent = "登录";
        }
      }
    });

    applyTheme();
    return true;
  }

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

  function enhanceMainFrame() {
    document.documentElement.classList.add("aieban-modern-frame", "aieban-modern-main-frame");
    document.body.classList.add("aieban-content");
    const enhancedLoginPage = enhanceLoginPage();
    if (renderGuidePage()) return;

    const enhancedGradePage = enhanceGradePage();
    if (!enhancedGradePage) simplifyWelcomeText();
    removeObsoleteUsageNotice();
    simplifyMaintenanceNotice();
    enhanceClothingSizePage();
    enhancePartyProgressPage();
    enhanceAttendancePublicPage();
    enhanceAttendancePage();
    enhanceSchoolLeavePage();
    enhanceLeavePage();
    enhanceIdeologyScorePage();
    enhanceAnnualAwardPage();
    enhanceDateTimePicker();

    document.querySelectorAll("table").forEach((table) => {
      if (table.closest(".xdsoft_datetimepicker")) return;
      if (enhancedLoginPage && table.closest(".aieban-login-card")) return;

      if (document.body.classList.contains("aieban-attendance-page")) {
        const scheduleTable = table.closest(".aieban-attendance-table");
        if (scheduleTable && table !== scheduleTable) {
          table.classList.add("aieban-attendance-inner-table");
          return;
        }
      }

      const hasHeaders = !!table.querySelector("th");
      const border = table.getAttribute("border");
      const hasDataShape = table.rows.length > 1 && table.querySelectorAll("td, th").length >= 4;
      const hasRecordShape = isRecordTable(table);

      if (hasHeaders || border === "1" || hasDataShape || hasRecordShape) {
        table.classList.add("aieban-table");
      } else {
        table.classList.add("aieban-layout-table");
      }
    });

    document.querySelectorAll("input[type='button'], input[type='submit'], button").forEach((button) => {
      if (button.closest(".xdsoft_datetimepicker")) return;
      button.classList.add("aieban-button");
    });

    document.querySelectorAll('a[href*="action=logout"], a').forEach((link) => {
      if (!isLogoutLink(link)) return;
      link.classList.add("aieban-danger-link");
      link.addEventListener("click", confirmLogout);
    });
  }

  if (window.top === window.self && document.querySelector("frameset")) {
    enhanceFrameset();
    return;
  }

  if (!document.body) return;

  if (isTopFrame()) {
    enhanceTopFrame();
  } else if (isMenuFrame()) {
    enhanceMenuFrame();
  } else {
    enhanceMainFrame();
  }
})();
