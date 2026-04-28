// AI更易办 - 拆分自旧版 content.js。
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
