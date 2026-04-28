// AI更易办 - 版本更新提醒。
function getExtensionVersion() {
  try {
    return chrome.runtime.getManifest().version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function parseVersionParts(version) {
  return String(version || "")
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((part) => Number(part));
}

function compareVersions(left, right) {
  const a = parseVersionParts(left);
  const b = parseVersionParts(right);
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const av = a[index] || 0;
    const bv = b[index] || 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }

  return 0;
}

function readUpdateState() {
  try {
    return JSON.parse(localStorage.getItem(UPDATE_STATE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeUpdateState(nextState) {
  localStorage.setItem(UPDATE_STATE_KEY, JSON.stringify({
    ...readUpdateState(),
    ...nextState
  }));
}

function resolveUpdateUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;

  try {
    return new URL(url, UPDATE_MANIFEST_URL).href;
  } catch {
    return url;
  }
}

function normalizeUpdateInfo(remote) {
  const version = String(remote?.version || "").trim();
  const rawUrl = String(remote?.downloadUrl || remote?.zipUrl || remote?.url || "").trim();

  if (!version || !rawUrl) return null;

  return {
    version,
    url: resolveUpdateUrl(rawUrl),
    notes: String(remote?.notes || "").trim()
  };
}

function setUpdateButtonState(state, info = {}) {
  const button = document.querySelector(".aieban-update-toggle");
  if (!button) return;

  button.classList.remove("is-checking", "has-update", "is-error");
  button.removeAttribute("data-version");

  if (state === "checking") {
    button.classList.add("is-checking");
    button.textContent = "…";
    button.title = "正在检查更新";
    return;
  }

  if (state === "available") {
    button.classList.add("has-update");
    button.textContent = "新";
    button.dataset.version = info.version || "";
    button.title = `发现新版 ${info.version}，点击打开下载链接`;
    return;
  }

  if (state === "error") {
    button.classList.add("is-error");
    button.textContent = "!";
    button.title = info.message || "检查更新失败";
    return;
  }

  button.textContent = "↻";
  button.title = "检查更新";
}

function showUpdateNotice(info, type = "available") {
  document.querySelector(".aieban-update-notice")?.remove();

  const notice = document.createElement("div");
  notice.className = `aieban-update-notice is-${type}`;

  if (type === "available") {
    notice.innerHTML = `
      <span>AI更易办 ${info.version} 可更新</span>
      <a href="${info.url}" target="_blank" rel="noopener noreferrer">下载新版</a>
      <button type="button" aria-label="关闭更新提示">×</button>
    `;
  } else {
    notice.innerHTML = `
      <span>${info.message}</span>
      <button type="button" aria-label="关闭更新提示">×</button>
    `;
  }

  notice.querySelector("button")?.addEventListener("click", () => {
    notice.remove();
    if (type === "available" && info.version) {
      writeUpdateState({ dismissedVersion: info.version });
    }
  });

  document.body.appendChild(notice);

  if (type !== "available") {
    setTimeout(() => notice.remove(), 3200);
  }
}

async function checkForUpdates(options = {}) {
  const force = !!options.force;

  if (!UPDATE_MANIFEST_URL) {
    if (force) {
      showUpdateNotice({ message: "还没有配置更新地址" }, "neutral");
    }
    return null;
  }

  const now = Date.now();
  const state = readUpdateState();

  if (!force && state.lastCheckedAt && now - Number(state.lastCheckedAt) < UPDATE_CHECK_INTERVAL_MS) {
    if (state.availableVersion && state.downloadUrl) {
      setUpdateButtonState("available", { version: state.availableVersion });
    }
    return null;
  }

  setUpdateButtonState("checking");

  try {
    const response = await fetch(`${UPDATE_MANIFEST_URL}${UPDATE_MANIFEST_URL.includes("?") ? "&" : "?"}t=${now}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const remote = normalizeUpdateInfo(await response.json());
    if (!remote) {
      throw new Error("更新文件缺少 version 或下载地址");
    }

    const currentVersion = getExtensionVersion();
    const hasUpdate = compareVersions(remote.version, currentVersion) > 0;

    writeUpdateState({
      lastCheckedAt: now,
      availableVersion: hasUpdate ? remote.version : "",
      downloadUrl: hasUpdate ? remote.url : ""
    });

    if (hasUpdate) {
      setUpdateButtonState("available", remote);
      if (force || state.dismissedVersion !== remote.version) {
        showUpdateNotice(remote, "available");
      }
      return remote;
    }

    setUpdateButtonState("idle");
    if (force) {
      showUpdateNotice({ message: `当前已是最新版 ${currentVersion}` }, "neutral");
    }
    return null;
  } catch (error) {
    setUpdateButtonState("error", { message: "检查更新失败" });
    if (force) {
      showUpdateNotice({ message: `检查更新失败：${error.message}` }, "error");
    }
    return null;
  }
}

function bindUpdateChecker() {
  const button = document.querySelector(".aieban-update-toggle");
  if (!button) return;

  const state = readUpdateState();
  if (state.availableVersion && state.downloadUrl) {
    setUpdateButtonState("available", { version: state.availableVersion });
  } else {
    setUpdateButtonState("idle");
  }

  button.addEventListener("click", () => {
    const current = readUpdateState();
    if (current.availableVersion && current.downloadUrl) {
      window.open(current.downloadUrl, "_blank", "noopener,noreferrer");
      return;
    }
    checkForUpdates({ force: true });
  });

  checkForUpdates();
}
