// AI更易办 - 拆分自旧版 content.js。
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
