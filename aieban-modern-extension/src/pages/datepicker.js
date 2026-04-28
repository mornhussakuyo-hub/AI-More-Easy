// AI更易办 - 拆分自旧版 content.js。
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
