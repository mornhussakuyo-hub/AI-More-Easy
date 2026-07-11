# AI更易办维护手册

这份文档写给第一次接触浏览器扩展、HTML、CSS、JavaScript 的维护者。目标是让你能快速找到代码、知道从哪里改、怎么验证，并且尽量不把旧页面改坏。

## 先理解它是什么

AI更易办是一个 Manifest V3 浏览器扩展。它不修改 AI易办服务器，也不提交额外请求。它做的事情是：

1. 浏览器打开指定的 AI易办网址。
2. 扩展把 JS 和 CSS 注入到页面里。
3. JS 识别当前页面类型。
4. JS 重新整理旧页面 DOM。
5. CSS 让整理后的页面变得现代一点。

所以维护这个项目，本质上是在维护一组“旧页面识别器 + 页面美化器”。

## 目录地图

```text
aieban-modern-extension/
  manifest.json              扩展清单，控制匹配网址、加载顺序、图标
  README.md                  给用户看的安装说明
  LICENSE                    MIT 许可证

  assets/
    sai-emblem.png           白天模式院徽
    sai-emblem-white.png     夜间模式院徽
    icons/                   扩展图标

  docs/
    aieban-guide.md          使用指南页面的 Markdown 内容
    maintenance.md           这份维护手册

  src/
    content.js               入口，只负责初始化和调度
    styles.css               全部视觉样式，当前保持单文件，避免拆样式时改变视觉

    core/
      constants.js           常量、固定文案、资源 URL
      preferences.js         白天/夜间模式、字体偏好
      frames.js              frameset、顶部 frame、左侧菜单 frame 判断
      detect.js              各页面识别函数
      logout.js              安全退出弹窗和跳转

    layout/
      topbar.js              顶栏
      sidebar.js             左侧导航、收藏、折叠

    pages/
      common.js              多页面共用工具，如欢迎语、旧提示清理、表格判断
      leave.js               缺课要请假、离校要请假
      datepicker.js          日历控件美化和中文化
      ideology.js            思政评价积分
      grade-guide.js         成绩页和使用指南页
      attendance.js          核对考勤、考勤公示
      clothing.js            选服装尺码
      party.js               入党进度表
      zhitongche.js          珞珈智通车
      dashboard.js           进站首页联系人面板
      standard.js            通用事务页框架、空状态、宽表和普通表单
      login.js               登录页
      annual-award.js        报年度评优
```

## 加载顺序

`manifest.json` 里 `content_scripts[0].js` 的顺序非常重要。浏览器会按顺序加载文件。

当前顺序是：

1. `core/constants.js`
2. `core/icons.js`
3. `core/preferences.js`
4. `core/frames.js`
5. `core/detect.js`
6. `core/logout.js`
7. `layout/topbar.js`
8. `layout/sidebar.js`
9. `pages/*.js`
10. `content.js`

最后加载 `content.js`，因为它会调用前面所有文件里定义的函数。

注意：这些 JS 文件不是 ES module，没有 `import/export`。它们作为普通 content script 共享同一个执行环境。新增文件后，要把它放进 `manifest.json` 的 `js` 列表，并放在入口 `src/content.js` 前面。

## 入口如何工作

入口文件是 `src/content.js`。

它做三件事：

1. 防止重复运行：

```js
if (window.__aiebanModernLoaded) return;
window.__aiebanModernLoaded = true;
```

2. 初始化全局偏好：

```js
applyTheme();
applyFontTheme();
```

3. 判断当前 frame 类型并调度：

```js
if (window.top === window.self && document.querySelector("frameset")) {
  enhanceFrameset();
} else if (isTopFrame()) {
  enhanceTopFrame();
} else if (isMenuFrame()) {
  enhanceMenuFrame();
} else {
  enhanceMainFrame();
}
```

绝大多数页面增强都发生在 `enhanceMainFrame()` 里。

## 下载快照与通用重写

更新页面前先抓一份当前 AI易办快照：

```bash
node tools/download-aieban.js
```

脚本会打开专用 Chrome profile。首次运行要在弹出的 Chrome 中登录 AI易办，进入主页面后回到终端按 Enter。结果保存在根目录 `下载的网页内容/`，其中可能含有个人信息和水印，已经被 Git 忽略，不要提交。

当前有两类页面重写方式：

- 专页增强：成绩、考勤、请假、入党、智通车、登录页等使用独立 `pages/*.js` 文件，适合需要重排表单或重写文案的页面。
- 标准页增强：`pages/standard.js` 覆盖培养方案、讲座报告、任职经历、职业测评、公告签阅、面签销假、假期去向、评优申报表等页面，统一提供页头、空状态、宽表横向滚动和普通表单样式。

新增页面时，先判断是否只需要标准页框架。如果页面只是表格、说明、普通表单或空状态，优先在 `core/detect.js` 和 `pages/standard.js` 增加 meta；只有页面结构需要大幅重排时，再新建专页增强文件。

## 新增一个页面美化

假设你要新增“假期去哪儿”页面。

### 1. 保存原页面

在浏览器里打开目标页面，保存为 HTML。注意不要提交这个 HTML，它可能含有学号、姓名、水印。

`.gitignore` 已经忽略了根目录保存的 HTML 和 `*_files/` 文件夹。

### 2. 找 URL 和关键元素

打开保存的 HTML，看第一行注释里的真实 URL：

```html
<!-- saved from url=(...)https://aieban.whu.edu.cn/.../xxx.php -->
```

再找页面里稳定的表单名、链接、标题、按钮文本。例如：

```html
<form name="holidayform" ...>
```

### 3. 在 `core/detect.js` 加识别函数

```js
function isHolidayPage() {
  return PAGE.includes("holiday") || !!document.forms.holidayform;
}
```

页面识别尽量用 URL + DOM 双保险。URL 稳定时优先用 URL。

### 4. 新建页面文件

新建：

```text
src/pages/holiday.js
```

基本结构：

```js
// AI更易办 - 假期去哪儿页面
function enhanceHolidayPage() {
  if (!isHolidayPage() || document.querySelector(".aieban-holiday-page-marker")) return;

  document.body.classList.add("aieban-holiday-page");

  const marker = document.createElement("section");
  marker.className = "aieban-holiday-page-marker";
  marker.textContent = "新的页面模块";
  document.body.prepend(marker);
}
```

关键点：

- 函数要幂等。重复运行时不能插入两份内容。
- 不要改表单的 `action`、`method`、字段 `name`。
- 能移动表单，但不要删真实输入控件。

### 5. 在 `content.js` 调用

在 `enhanceMainFrame()` 中合适位置加入：

```js
enhanceHolidayPage();
```

### 6. 在 `manifest.json` 加文件

把新文件加到 `src/content.js` 前面：

```json
"src/pages/holiday.js",
"src/content.js"
```

### 7. 加 CSS

当前样式仍集中在 `src/styles.css`。为了不改变现有视觉，新增页面样式请追加到对应页面样式附近，并使用唯一前缀：

```css
.aieban-holiday-page { ... }
.aieban-holiday-card { ... }
```

不要写太泛的选择器，例如：

```css
table { ... }
button { ... }
```

这会影响全站。

## 常见文件应该去哪改

- 顶栏按钮、院徽、夜间模式入口：`layout/topbar.js`
- 左侧导航、收藏、折叠：`layout/sidebar.js`
- 白天/夜间模式逻辑：`core/preferences.js`
- 安全退出弹窗：`core/logout.js`
- 页面是否命中：`core/detect.js`
- 登录页：`pages/login.js`
- 日历控件：`pages/datepicker.js`
- 成绩页：`pages/grade-guide.js`
- 使用指南文案：`docs/aieban-guide.md` 和 `core/constants.js`
- 所有视觉样式：`src/styles.css`

## 验证命令

每次改完 JS，运行：

```powershell
cd D:\AI易办
node -e "const fs=require('fs'); const m=JSON.parse(fs.readFileSync('aieban-modern-extension/manifest.json','utf8')); const js=m.content_scripts[0].js.map(p=>fs.readFileSync('aieban-modern-extension/'+p,'utf8')).join('\n'); new Function(js); console.log('combined js OK:', m.content_scripts[0].js.length, 'files')"
```

检查 manifest：

```powershell
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('aieban-modern-extension/manifest.json','utf8')); console.log('manifest OK')"
```

如果 `combined js OK`，说明所有 JS 按 manifest 顺序拼起来至少语法正确。

## 浏览器里怎么调试

1. 打开 `edge://extensions/` 或 `chrome://extensions/`。
2. 找到 AI更易办。
3. 点击“重新加载”。
4. 刷新 AI易办页面。
5. 按 F12 打开开发者工具。
6. 在 Console 里看红色报错。

常见错误：

- `xxx is not defined`：文件加载顺序错了，或者忘了把新文件加入 manifest。
- 页面没有变化：页面识别函数没命中。
- 插入了两份组件：增强函数没有写幂等判断。
- 表单无法提交：误删了原表单或改了字段 `name`。

## 维护原则

- 优先移动和包裹旧 DOM，不要重建真实表单字段。
- 新增页面时，先加页面识别，再加增强函数。
- 所有页面级 class 使用 `aieban-页面名-*` 前缀。
- 通用选择器要谨慎，避免影响日历、登录页和旧表格。
- 改 manifest 后必须在扩展管理页重新加载扩展。
- 本地保存的 AI易办 HTML 可能含个人信息，不要提交。

## 为什么 CSS 暂时没拆

本次重构要求“不修改任何样式”。为了最大限度保持视觉不变，`src/styles.css` 暂时保留单文件，只拆 JS。

以后如果要拆 CSS，建议只做纯移动：

```text
src/styles/base.css
src/styles/topbar.css
src/styles/sidebar.css
src/styles/pages/*.css
```

拆完后要确认 manifest 中 CSS 加载顺序与原文件顺序一致，否则可能改变视觉优先级。

## 发布前检查

1. `manifest.json` 的版本号递增。
2. 运行组合 JS 语法检查。
3. 本地加载扩展，至少检查：
   - 登录页
   - 首页
   - 左侧导航
   - 成绩页
   - 考勤页
   - 请假页
4. 打包时不要包含本地保存的 HTML。
