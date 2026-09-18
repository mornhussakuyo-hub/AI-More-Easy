#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const EXTENSION_DIR = path.join(ROOT, "aieban-modern-extension");
const SNAPSHOT_ROOT = path.join(ROOT, "下载的网页内容");
const PORT = Number(process.env.AIEBAN_VALIDATE_PORT || 9333);
const CHROME_BIN = process.env.CHROME_BIN || "google-chrome-stable";
const PROFILE_DIR = path.join("/tmp", `aieban-validate-${process.pid}`);
const SCREENSHOT_DIR = process.env.AIEBAN_SCREENSHOT_DIR && path.resolve(process.env.AIEBAN_SCREENSHOT_DIR);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function latestSnapshot() {
  return fs
    .readdirSync(SNAPSHOT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("aieban-raw-"))
    .map((entry) => path.join(SNAPSHOT_ROOT, entry.name))
    .sort()
    .at(-1);
}

function request(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      { hostname: parsed.hostname, port: parsed.port, path: `${parsed.pathname}${parsed.search}`, method },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => (body += chunk));
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}: ${url}`));
          } else {
            resolve(body);
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function waitForChrome() {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    try {
      return JSON.parse(await request(`http://127.0.0.1:${PORT}/json/version`));
    } catch {
      await sleep(200);
    }
  }
  throw new Error(`无法连接 Chrome DevTools: http://127.0.0.1:${PORT}`);
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => this.handle(JSON.parse(event.data)));
  }

  handle(message) {
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result || {});
      return;
    }
    for (const listener of this.listeners.get(message.method) || []) listener(message.params || {});
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const listener = (params) => {
        clearTimeout(timer);
        this.listeners.set(method, (this.listeners.get(method) || []).filter((item) => item !== listener));
        resolve(params);
      };
      const timer = setTimeout(() => reject(new Error(`等待 ${method} 超时`)), timeout);
      this.listeners.set(method, [...(this.listeners.get(method) || []), listener]);
    });
  }

  close() {
    this.socket?.close();
  }
}

async function createTarget(url) {
  const endpoint = `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`;
  return JSON.parse(await request(endpoint, "PUT"));
}

async function closeTarget(id) {
  try {
    await request(`http://127.0.0.1:${PORT}/json/close/${id}`);
  } catch {
    // Chrome may already have closed the target.
  }
}

function evaluationValue(result) {
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "页面脚本异常");
  }
  return result.result?.value;
}

async function evaluate(client, expression) {
  return evaluationValue(await client.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }));
}

const formSnapshotExpression = `JSON.stringify(Array.from(document.forms, (form) => ({
  action: form.getAttribute("action") || "",
  method: (form.getAttribute("method") || "get").toLowerCase(),
  fields: Array.from(form.elements, (field) => field.getAttribute("name") || "")
})).sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))))`;

async function validatePage(page, snapshotDir, script, css) {
  const target = await createTarget("about:blank");
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  try {
    const loaded = client.once("Page.loadEventFired");
    await client.send("Page.navigate", { url: pathToFileURL(path.join(snapshotDir, page.path)).href });
    await loaded;

    const before = await evaluate(client, formSnapshotExpression);
    await evaluate(
      client,
      `window.__AIEBAN_PAGE_URL__ = ${JSON.stringify(page.finalUrl)};
       window.chrome = { runtime: { getURL: (resource) => ${JSON.stringify(pathToFileURL(`${EXTENSION_DIR}/`).href)} + resource } };
       document.head.append(Object.assign(document.createElement("style"), { textContent: ${JSON.stringify(css)} }));
       ${script}`
    );
    await sleep(30);

    const after = await evaluate(client, formSnapshotExpression);
    const state = await evaluate(
      client,
      `({
        htmlClass: document.documentElement.className,
        bodyClass: document.body?.className || "",
        enhanced: document.documentElement.className.includes("aieban-modern") || document.body?.classList.contains("aieban-content")
      })`
    );

    const failures = [];
    if (before !== after) failures.push("表单 action/method/name 发生变化");
    if (!state.enhanced) failures.push("页面未命中增强路由");
    if (SCREENSHOT_DIR) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
      const screenshot = await client.send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(SCREENSHOT_DIR, `${path.basename(page.path)}.png`), screenshot.data, "base64");
    }
    return { page, state, failures };
  } catch (error) {
    return { page, state: {}, failures: [error.message] };
  } finally {
    client.close();
    await closeTarget(target.id);
  }
}

async function main() {
  const snapshotDir = path.resolve(process.argv[2] || latestSnapshot() || "");
  if (!snapshotDir || !fs.existsSync(path.join(snapshotDir, "manifest.json"))) {
    throw new Error("找不到页面快照，请先运行 node tools/download-aieban.js");
  }

  const snapshot = JSON.parse(fs.readFileSync(path.join(snapshotDir, "manifest.json"), "utf8"));
  const extension = JSON.parse(fs.readFileSync(path.join(EXTENSION_DIR, "manifest.json"), "utf8"));
  const script = extension.content_scripts[0].js
    .map((file) => fs.readFileSync(path.join(EXTENSION_DIR, file), "utf8"))
    .join("\n");
  const css = fs.readFileSync(path.join(EXTENSION_DIR, extension.content_scripts[0].css[0]), "utf8");
  const chrome = spawn(
    CHROME_BIN,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${PROFILE_DIR}`,
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--allow-file-access-from-files",
      "about:blank"
    ],
    { stdio: "ignore" }
  );

  try {
    await waitForChrome();
    const results = [];
    for (const page of snapshot.pages) {
      const result = await validatePage(page, snapshotDir, script, css);
      results.push(result);
      console.log(`${result.failures.length ? "FAIL" : "PASS"} ${page.finalUrl}`);
      result.failures.forEach((failure) => console.log(`  ${failure}`));
    }

    const failures = results.filter((result) => result.failures.length);
    console.log(`\n页面 ${results.length}，通过 ${results.length - failures.length}，失败 ${failures.length}`);
    if (failures.length) process.exitCode = 1;
  } finally {
    chrome.kill("SIGTERM");
    fs.rmSync(PROFILE_DIR, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
