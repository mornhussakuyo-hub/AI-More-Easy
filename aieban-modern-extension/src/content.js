// AI更易办入口文件。功能实现位于 core / layout / pages。
(() => {
  if (window.__aiebanModernLoaded) return;
  window.__aiebanModernLoaded = true;

  applyTheme();
  applyFontTheme();
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY) applyTheme(event.newValue === "dark" ? "dark" : "light");
    if (event.key === FONT_THEME_KEY) applyFontTheme(event.newValue === "sans" ? "sans" : "literary");
  });

  function route() {
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
  }

  function enhanceMainFrame() {
    document.documentElement.classList.add("aieban-modern-frame", "aieban-modern-main-frame");
    document.body.classList.add("aieban-content");
    const enhancedLoginPage = enhanceLoginPage();
    if (enhanceDashboardPage()) return;
    if (enhanceZhitongchePage()) return;
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
    enhanceStandardPageLayout();

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

    document.querySelectorAll("table").forEach((table) => {
      if (shouldWrapDataTable(table)) wrapDataTable(table);
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

  route();
})();
