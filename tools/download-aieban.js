#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const readline = require("node:readline");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.AIEBAN_DEBUG_PORT || 9222);
const CHROME_BIN = process.env.CHROME_BIN || "google-chrome-stable";
const PROFILE_DIR = path.resolve(process.env.AIEBAN_CHROME_PROFILE || path.join(ROOT, ".cache/aieban-chrome-profile"));
const OUTPUT_ROOT = path.resolve(process.env.AIEBAN_DOWNLOAD_DIR || path.join(ROOT, "下载的网页内容"));
const BASE_URL = "https://aieban.whu.edu.cn/ebanbenke/";
const ENTRY_URL = `${BASE_URL}ebanbenke_manage.php`;
const MAX_PAGES = Number(process.env.AIEBAN_MAX_PAGES || 160);
const REQUEST_DELAY_MS = Number(process.env.AIEBAN_REQUEST_DELAY_MS || 120);

const FORCE_URLS = [
  ENTRY_URL,
  `${BASE_URL}ebanbenke_top_menu.htm`,
  `${BASE_URL}ebanbenke_left_menu_student.php`
];

const PAGE_EXTENSIONS = new Set([".php", ".htm", ".html", ""]);
const ASSET_EXTENSIONS = new Set([
  ".css",
  ".js",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".bmp",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot"
]);

const DANGEROUS_URL_PARTS = [
  "logout",
  "action=logout",
  "delete",
  "del=",
  "remove",
  "shanchu",
  "save.php",
  "submit",
  "toexcel",
  "excel",
  "xls",
  "daochu",
  "export",
  "tijiao",
  "tuichu"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function usage() {
  console.log(`
AI易办原始页面下载器

用法：
  node tools/download-aieban.js

环境变量：
  AIEBAN_DEBUG_PORT=9222
  AIEBAN_CHROME_PROFILE=.cache/aieban-chrome-profile
  AIEBAN_DOWNLOAD_DIR=下载的网页内容
  AIEBAN_ASSUME_LOGGED_IN=1
  AIEBAN_MAX_PAGES=160

流程：
  1. 脚本启动专用 Chrome profile 和远程调试端口。
  2. 在打开的 Chrome 里完成 AI易办登录。
  3. 回到终端按 Enter。
  4. 脚本下载主框架、菜单链接页面和引用的静态资源。
`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function timestamp() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function toSafeName(url, fallback = "page") {
  const parsed = new URL(url);
  const query = parsed.search ? `_${parsed.searchParams.toString()}` : "";
  const raw = `${parsed.hostname}${parsed.pathname}${query}` || fallback;
  return raw
    .replace(/^https?:\/\//, "")
    .replace(/[\\/:*?"<>|#&=]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 180) || fallback;
}

function normalizeUrl(value, baseUrl) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  if (/^(javascript|mailto|tel|data):/i.test(trimmed)) return null;
  try {
    const parsed = new URL(trimmed, baseUrl);
    parsed.hash = "";
    return parsed.href;
  } catch {
    return null;
  }
}

function isSameAiebanUrl(url) {
  const parsed = new URL(url);
  return parsed.hostname === "aieban.whu.edu.cn" && parsed.pathname.startsWith("/eban");
}

function isDangerousUrl(url) {
  const lower = decodeURIComponent(url).toLowerCase();
  return DANGEROUS_URL_PARTS.some((part) => lower.includes(part));
}

function extensionOf(url) {
  const parsed = new URL(url);
  return path.extname(parsed.pathname).toLowerCase();
}

function isPageUrl(url) {
  if (!isSameAiebanUrl(url) || isDangerousUrl(url)) return false;
  const ext = extensionOf(url);
  return PAGE_EXTENSIONS.has(ext);
}

function isAssetUrl(url) {
  if (!isSameAiebanUrl(url)) return false;
  return ASSET_EXTENSIONS.has(extensionOf(url));
}

function extractUrls(html, baseUrl) {
  const urls = new Set();
  const attrPattern = /\b(?:href|src|action|background)\s*=\s*["']([^"']+)["']/gi;
  const cssPattern = /url\((["']?)([^"')]+)\1\)/gi;
  let match;

  while ((match = attrPattern.exec(html))) {
    const normalized = normalizeUrl(match[1], baseUrl);
    if (normalized) urls.add(normalized);
  }

  while ((match = cssPattern.exec(html))) {
    const normalized = normalizeUrl(match[2], baseUrl);
    if (normalized) urls.add(normalized);
  }

  return [...urls];
}

function looksLoggedOut(html) {
  return (
    html.includes("name=\"loginform\"") ||
    html.includes("id=\"loginform\"") ||
    html.includes("请用正确的用户名") ||
    html.includes("请输入用户名")
  );
}

function promptEnter(message) {
  if (process.env.AIEBAN_ASSUME_LOGGED_IN === "1") return Promise.resolve();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(message, () => {
      rl.close();
      resolve();
    });
  });
}

function requestDevTools(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const request = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: `${parsed.pathname}${parsed.search}`,
        method: options.method || "GET"
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`${response.statusCode} ${response.statusMessage}: ${url}`));
            return;
          }
          resolve(body);
        });
      }
    );
    request.on("error", reject);
    request.end();
  });
}

async function fetchJson(url, options = {}) {
  return JSON.parse(await requestDevTools(url, options));
}

async function waitForDevTools() {
  const endpoint = `http://127.0.0.1:${PORT}/json/version`;
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      return await fetchJson(endpoint);
    } catch {
      await sleep(400);
    }
  }
  throw new Error(`无法连接 Chrome DevTools: ${endpoint}`);
}

async function hasDevTools() {
  try {
    await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
    return true;
  } catch {
    return false;
  }
}

async function launchChrome() {
  if (await hasDevTools()) {
    console.log(`复用已启动的 Chrome DevTools: http://127.0.0.1:${PORT}`);
    return;
  }

  ensureDir(PROFILE_DIR);
  const args = [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE_DIR}`,
    "--no-first-run",
    "--new-window",
    ENTRY_URL
  ];

  console.log(`启动 Chrome: ${CHROME_BIN}`);
  console.log(`专用 profile: ${PROFILE_DIR}`);
  const child = spawn(CHROME_BIN, args, {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
  await waitForDevTools();
}

class CdpClient {
  constructor(webSocketDebuggerUrl) {
    this.webSocketDebuggerUrl = webSocketDebuggerUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => this.handleMessage(event.data));
  }

  handleMessage(raw) {
    const message = JSON.parse(raw);
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) {
        reject(new Error(`${message.error.message || "CDP error"} (${message.error.code})`));
      } else {
        resolve(message.result || {});
      }
      return;
    }

    if (message.method && this.listeners.has(message.method)) {
      for (const listener of this.listeners.get(message.method)) listener(message.params || {});
    }
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const payload = JSON.stringify({ id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);
    });
  }

  once(method, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`等待 ${method} 超时`));
      }, timeoutMs);
      const listener = (params) => {
        cleanup();
        resolve(params);
      };
      const cleanup = () => {
        clearTimeout(timer);
        const list = this.listeners.get(method) || [];
        this.listeners.set(method, list.filter((item) => item !== listener));
      };
      const list = this.listeners.get(method) || [];
      list.push(listener);
      this.listeners.set(method, list);
    });
  }

  close() {
    this.ws?.close();
  }
}

async function createTarget(url) {
  const endpoint = `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`;
  try {
    return await fetchJson(endpoint, { method: "PUT" });
  } catch {
    return fetchJson(endpoint);
  }
}

async function closeTarget(id) {
  try {
    await requestDevTools(`http://127.0.0.1:${PORT}/json/close/${id}`);
  } catch {
    // Chrome may already have closed the target.
  }
}

async function openPage(url) {
  const target = await createTarget(url);
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  return { target, client };
}

async function captureHtml(url) {
  const { target, client } = await openPage(url);
  try {
    const load = client.once("Page.loadEventFired", 25000).catch(() => null);
    await client.send("Page.navigate", { url });
    await load;
    await sleep(REQUEST_DELAY_MS);
    const htmlResult = await client.send("Runtime.evaluate", {
      expression: "document.documentElement ? document.documentElement.outerHTML : ''",
      returnByValue: true
    });
    const titleResult = await client.send("Runtime.evaluate", {
      expression: "document.title || ''",
      returnByValue: true
    });
    const hrefResult = await client.send("Runtime.evaluate", {
      expression: "location.href",
      returnByValue: true
    });
    return {
      url,
      finalUrl: hrefResult.result?.value || url,
      title: titleResult.result?.value || "",
      html: htmlResult.result?.value || ""
    };
  } finally {
    client.close();
    await closeTarget(target.id);
  }
}

async function fetchAssetThroughBrowser(url) {
  const { target, client } = await openPage(ENTRY_URL);
  try {
    const load = client.once("Page.loadEventFired", 25000).catch(() => null);
    await client.send("Page.navigate", { url: ENTRY_URL });
    await load;
    const expression = `
      (async () => {
        const response = await fetch(${JSON.stringify(url)}, { credentials: "include" });
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return {
          ok: response.ok,
          status: response.status,
          contentType: response.headers.get("content-type") || "",
          body: btoa(binary)
        };
      })()
    `;
    const result = await client.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    return result.result?.value;
  } finally {
    client.close();
    await closeTarget(target.id);
  }
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function writeBase64(filePath, base64) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    usage();
    return;
  }

  await launchChrome();
  await promptEnter("请在打开的 Chrome 中完成 AI易办登录，进入主页面后回到这里按 Enter 继续...");

  const outputDir = path.join(OUTPUT_ROOT, `aieban-raw-${timestamp()}`);
  const pagesDir = path.join(outputDir, "pages");
  const assetsDir = path.join(outputDir, "assets");
  ensureDir(pagesDir);
  ensureDir(assetsDir);

  const queue = [...FORCE_URLS];
  const seenPages = new Set();
  const seenAssets = new Set();
  const manifest = {
    createdAt: new Date().toISOString(),
    entryUrl: ENTRY_URL,
    profileDir: PROFILE_DIR,
    pages: [],
    assets: [],
    skipped: []
  };

  try {
    for (let index = 0; index < queue.length && index < MAX_PAGES; index += 1) {
      const url = queue[index];
      if (seenPages.has(url) || !isPageUrl(url)) continue;
      seenPages.add(url);

      console.log(`下载页面 ${seenPages.size}: ${url}`);
      try {
        const page = await captureHtml(url);
        if (looksLoggedOut(page.html)) {
          throw new Error("页面仍是登录页，请确认专用 Chrome profile 已完成登录");
        }

        const fileName = `${String(seenPages.size).padStart(3, "0")}_${toSafeName(page.finalUrl)}.html`;
        const relativePath = path.join("pages", fileName);
        writeText(path.join(outputDir, relativePath), `<!-- saved from url=(${page.finalUrl.length.toString().padStart(4, "0")})${page.finalUrl} -->\n${page.html}`);

        manifest.pages.push({
          url,
          finalUrl: page.finalUrl,
          title: page.title,
          path: relativePath
        });

        for (const discovered of extractUrls(page.html, page.finalUrl)) {
          if (isPageUrl(discovered) && !seenPages.has(discovered) && !queue.includes(discovered)) {
            queue.push(discovered);
          } else if (isAssetUrl(discovered) && !seenAssets.has(discovered)) {
            seenAssets.add(discovered);
          }
        }
      } catch (error) {
        console.warn(`跳过页面: ${url}\n  ${error.message}`);
        manifest.skipped.push({ type: "page", url, reason: error.message });
      }
    }

    let assetIndex = 0;
    for (const url of seenAssets) {
      assetIndex += 1;
      console.log(`下载资源 ${assetIndex}/${seenAssets.size}: ${url}`);
      try {
        const asset = await fetchAssetThroughBrowser(url);
        if (!asset?.ok) throw new Error(`HTTP ${asset?.status || "unknown"}`);
        const ext = extensionOf(url) || ".bin";
        const fileName = `${String(assetIndex).padStart(3, "0")}_${toSafeName(url, "asset")}${ext}`;
        const relativePath = path.join("assets", fileName);
        writeBase64(path.join(outputDir, relativePath), asset.body);
        manifest.assets.push({
          url,
          status: asset.status,
          contentType: asset.contentType,
          path: relativePath
        });
      } catch (error) {
        console.warn(`跳过资源: ${url}\n  ${error.message}`);
        manifest.skipped.push({ type: "asset", url, reason: error.message });
      }
    }
  } finally {
    writeText(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    writeText(
      path.join(outputDir, "README.md"),
      `# AI易办原始页面快照\n\n生成时间：${manifest.createdAt}\n\n- 页面数：${manifest.pages.length}\n- 资源数：${manifest.assets.length}\n- 跳过项：${manifest.skipped.length}\n\n这些文件可能包含个人信息和页面水印，只用于本地开发，不要提交到 Git。\n`
    );
  }

  console.log(`完成：${outputDir}`);
  console.log(`页面 ${manifest.pages.length} 个，资源 ${manifest.assets.length} 个，跳过 ${manifest.skipped.length} 项。`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
