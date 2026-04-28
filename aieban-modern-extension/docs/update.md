# AI更易办更新发布指南

这份文档说明“不上架扩展商店”时，怎么用压缩包做更新提醒。

## 先说结论

浏览器不会允许一个“开发人员模式加载的扩展”静默自动替换自己。所以不上架扩展商店时，最稳的方案是：

1. 开发者发布新版 zip 和 `latest.json`。
2. 扩展定期读取 `latest.json`。
3. 如果发现新版，右上角显示“新”，点击后打开下载链接。
4. 使用者自己下载新版、替换本地文件夹，然后到 `edge://extensions/` 或 `chrome://extensions/` 点击“重新加载”。

这不是完全静默更新，但足够轻，也不会增加扩展的危险权限。

## 你需要提供什么

正式发布前，你只需要准备两个公网可访问地址：

- `latest.json` 地址：告诉扩展最新版本是多少、zip 在哪里下载。
- zip 下载地址：新版扩展压缩包。

可以放在 GitHub Release、GitHub Pages、你自己的服务器，或者任何稳定直链位置。

注意：`latest.json` 地址需要允许浏览器跨域读取。GitHub Pages、GitHub raw 文件通常可以；普通网盘分享页一般不适合。

拿到 `latest.json` 地址后，填入：

```js
// src/core/constants.js
const UPDATE_MANIFEST_URL = "https://example.com/aieban-modern-extension/latest.json";
```

之后重新打包发布即可。

## 打包新版

在项目根目录运行：

```powershell
.\scripts\package.ps1
```

它会生成：

```text
dist/
  aieban-modern-extension-v版本号.zip
  latest.json
```

如果你已经知道发布地址，可以这样生成带完整下载地址的 `latest.json`：

```powershell
.\scripts\package.ps1 -ReleaseBaseUrl "https://example.com/aieban-modern-extension"
```

生成的 `latest.json` 大概长这样：

```json
{
  "name": "AI更易办",
  "version": "0.1.2",
  "zipUrl": "https://example.com/aieban-modern-extension/aieban-modern-extension-v0.1.2.zip",
  "sha256": "......",
  "publishedAt": "2026-04-28T13:00:00Z",
  "notes": "请下载新版压缩包后，在扩展管理页重新加载。"
}
```

## 使用者如何被提醒

扩展会在顶部栏右上角显示一个检查更新的小按钮。

- 平时显示 `↻`，点击可手动检查。
- 检查中显示 `…`。
- 有新版显示 `新`，点击会打开新版 zip 下载链接。
- 自动检查频率是每天最多一次。

## 使用者如何手动更新

假设你把 `latest.json` 放在：

```text
https://example.com/aieban-modern-extension/latest.json
```

使用者可以直接打开扩展给出的下载链接，下载新版 zip 后覆盖本地扩展文件夹，然后在扩展管理页点击“重新加载”。

如果你仍然想让对方少做几步，也可以让使用者在项目根目录运行：

```powershell
.\scripts\update.ps1 -ManifestUrl "https://example.com/aieban-modern-extension/latest.json"
```

这个脚本会做这些事：

1. 读取本地 `aieban-modern-extension/manifest.json` 的版本号。
2. 拉取远程 `latest.json`。
3. 如果远程版本更新，就下载 zip。
4. 校验 SHA256。
5. 备份旧版文件夹。
6. 覆盖本地 `aieban-modern-extension`。

最后仍然需要手动打开扩展管理页，点击“重新加载”。

## 版本号怎么改

每次发布前，修改：

```text
aieban-modern-extension/manifest.json
```

把 `version` 递增，例如：

```json
"version": "0.1.3"
```

然后重新运行：

```powershell
.\scripts\package.ps1
```

## 推荐发布流程

1. 修改代码。
2. 递增 `manifest.json` 版本号。
3. 运行 JS 检查。
4. 运行 `.\scripts\package.ps1`。
5. 上传 `dist/latest.json` 和 `dist/aieban-modern-extension-v版本号.zip`。
6. 旧版扩展会在下一次检查时提示使用者下载新版。

## 回滚

更新脚本会留下备份文件夹：

```text
aieban-modern-extension.backup-旧版本号
```

如果新版出问题，可以删除当前 `aieban-modern-extension`，再把备份文件夹改回 `aieban-modern-extension`。
