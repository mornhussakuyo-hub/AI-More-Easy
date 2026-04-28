// AI更易办 - 拆分自旧版 content.js。
  function isLogoutLink(link) {
    const label = text(link);
    const href = link.href || "";
    return href.includes("action=logout") || label.includes("安全退出") || label.includes("退出");
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
