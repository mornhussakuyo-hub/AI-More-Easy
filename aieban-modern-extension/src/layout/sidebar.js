// AI更易办 - 拆分自旧版 content.js。
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
    return ["sectionCommon", "sectionSchool", "sectionDocs", "sectionBriefcase", "sectionMore"][index] || "sectionFolder";
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
        AiebanIcons.setIcon(button, "favorite");
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
          AiebanIcons.setIcon(button, "favorite");
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
      const button = document.querySelector(".aieban-sidebar-collapse-toggle");
      button?.setAttribute("aria-label", shouldCollapse ? "展开导航栏" : "收起导航栏");
      button?.setAttribute("title", shouldCollapse ? "展开导航栏" : "收起导航栏");
      AiebanIcons.setIcon(button, shouldCollapse ? "chevronRight" : "chevronLeft");
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
      <span class="aieban-nav-icon"></span>
      <span class="aieban-nav-name">收藏页面</span>
      <span class="aieban-nav-count">0</span>
      <span class="aieban-nav-chevron"></span>
    `;
    favoriteToggle.querySelector(".aieban-nav-icon")?.appendChild(AiebanIcons.create("favorite"));
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
        <span class="aieban-nav-icon"></span>
        <span class="aieban-nav-name">${section.title}</span>
        <span class="aieban-nav-count">${section.links.length}</span>
        <span class="aieban-nav-chevron"></span>
      `;
      toggle.querySelector(".aieban-nav-icon")?.appendChild(AiebanIcons.create(sectionIcon(index)));
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

