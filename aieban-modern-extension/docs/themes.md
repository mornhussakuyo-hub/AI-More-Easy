# 主题系统

AI更易办 1.0 使用 `src/core/themes.js` 提供主题注册和令牌应用，默认主题是“珞珈工作台”，定义在 `src/themes/luojia.js`。

## 主题令牌

主题只需要注册以 `--aieban-` 开头的 CSS 自定义属性。`tokens` 是亮暗模式共用值，`light` 和 `dark` 分别覆盖对应模式。

```js
AiebanThemes.register("campus", {
  label: "校园蓝",
  tokens: {
    "--aieban-radius-md": "10px"
  },
  light: {
    "--aieban-primary": "#245a9b"
  },
  dark: {
    "--aieban-primary": "#9bc8ff"
  }
});
```

注册后可以把它设为默认主题：

```js
AiebanThemes.setDefault("campus");
```

自定义主题只需提供想改的令牌，未提供的令牌会回退到默认主题。主题切换通过 `setInterfaceTheme(id)` 完成，页面明暗模式仍由 `setTheme("light" | "dark")` 控制。

## 加载顺序

主题注册表必须先于主题定义、偏好设置和页面模块加载：

1. `src/core/constants.js`
2. `src/core/icons.js`
3. `src/core/themes.js`
4. `src/themes/luojia.js`
5. `src/core/preferences.js`
6. 其余核心、布局和页面脚本

新增主题文件后，要把它放到 `manifest.json` 的 `src/core/preferences.js` 之前。主题文件不需要网络请求，也不要引入远程字体。

## 页面覆盖

通用事务页由 `src/pages/standard.js` 统一增强。综合测评的 F1、F3 和总表分别使用 `aieban-assessment-f1-page`、`aieban-assessment-f3-page`、`aieban-assessment-summary-page`，共享 `aieban-assessment-page` 样式。增强只移动或包裹旧 DOM，不改变表单 `action`、`method` 或字段 `name`。

## 验证

先抓取不提交的本地页面快照：

```bash
node tools/download-aieban.js
```

再用本地 Chrome 验证所有页面：

```bash
node tools/validate-aieban-snapshots.js
```

验证器会逐页检查脚本异常、页面路由命中，以及表单提交契约是否保持不变。页面快照可能含个人信息，只能留在本机。
