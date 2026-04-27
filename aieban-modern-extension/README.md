# AI更易办

让事更更容易办！

AI更易办是一个在本地浏览器中美化 AI易办本科生平台旧式页面的 Chrome / Edge 扩展。它只修改你浏览器里看到的页面样式和交互，不会修改 AI易办服务器数据，也不会读取、保存或上传账号密码。

## 功能

- 重做 AI易办顶部栏、左侧导航栏和常用功能页样式。
- 支持白天模式和夜间模式切换。
- 左侧导航支持展开、收起和页面收藏。
- 安全退出会弹出居中的确认窗口。
- 多个说明页面会被整理成更清晰的 Markdown 风格卡片。
- 对成绩、考勤、请假、思政积分、入党进度、服装尺码等页面做了局部美化。

## 本地安装

1. 下载或解压本项目。
2. 打开浏览器扩展管理页：
   - Edge：`edge://extensions/`
   - Chrome：`chrome://extensions/`
3. 打开右上角的“开发人员模式”。
4. 点击“加载解压缩的扩展”。
5. 选择 `aieban-modern-extension` 这个文件夹。
6. 重新打开或刷新 AI易办本科生平台：

```text
https://aieban.whu.edu.cn/ebanbenke/ebanbenke_manage.php
```

安装成功后，登录后的 AI易办页面会自动应用新界面。

## 更新安装

如果你拿到新版代码：

1. 替换本地的 `aieban-modern-extension` 文件夹。
2. 打开 `edge://extensions/` 或 `chrome://extensions/`。
3. 找到 AI更易办，点击“重新加载”。
4. 刷新 AI易办页面。

## 打包发布

发布前确认扩展目录中至少包含：

```text
manifest.json
src/content.js
src/styles.css
assets/sai-emblem.png
assets/sai-emblem-white.png
docs/aieban-guide.md
LICENSE
README.md
```

不要把本地保存的 AI易办 HTML 页面、`*_files` 文件夹、截图草稿、账号水印页面一起打包。

在 PowerShell 中进入扩展目录：

```powershell
cd D:\AI易办\aieban-modern-extension
$version = (Get-Content .\manifest.json | ConvertFrom-Json).version
Compress-Archive -Path .\manifest.json, .\src, .\assets, .\docs, .\LICENSE, .\README.md -DestinationPath "..\AI更易办-$version.zip" -Force
```

生成的 zip 文件根目录里必须直接能看到 `manifest.json`，不能是 `AI更易办-0.1.0/aieban-modern-extension/manifest.json` 这种多套了一层文件夹的结构。

## 发布到浏览器商店

### Chrome Web Store

1. 注册并进入 Chrome Web Store Developer Dashboard。
2. 新建扩展项目。
3. 上传上一步生成的 zip 包。
4. 填写名称、简介、详细说明、截图、分类、隐私说明等信息。
5. 提交审核。

官方入口：https://chrome.google.com/webstore/devconsole

官方文档：https://developer.chrome.com/docs/webstore/publish/

### Microsoft Edge Add-ons

1. 进入 Microsoft Partner Center 的 Edge 扩展发布页面。
2. 新建扩展提交。
3. 上传 zip 包。
4. 填写商店展示信息、截图、隐私信息和支持信息。
5. 提交认证。

官方文档：https://learn.microsoft.com/microsoft-edge/extensions-chromium/publish/publish-extension

## 上架前检查

- `manifest.json` 的 `version` 每次发布都要递增。
- 建议补齐扩展图标，例如 16、32、48、128 像素 PNG，并在 `manifest.json` 中声明 `icons`。
- 截图不要包含学号、姓名、电话、水印等个人信息。
- 商店简介里说明扩展只作用于 `aieban.whu.edu.cn/ebanbenke/*`。
- 隐私说明里写清楚：扩展不收集、不上传、不共享用户数据。

## 隐私与权限

扩展目前只通过 content script 作用于：

```text
https://aieban.whu.edu.cn/ebanbenke/*
http://aieban.whu.edu.cn/ebanbenke/*
```

它没有后台服务，没有远程接口，也没有申请额外浏览器权限。页面收藏、夜间模式、导航收起状态等偏好保存在浏览器本地 `localStorage` 中。

## 开发说明

主要文件：

- `manifest.json`：扩展清单。
- `src/content.js`：页面识别、DOM 重写和交互逻辑。
- `src/styles.css`：现代化样式。
- `assets/`：院徽资源。
- `docs/aieban-guide.md`：使用指南内容。

修改后可以用下面的命令做一次基础语法检查：

```powershell
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('manifest.json','utf8')); new Function(fs.readFileSync('src/content.js','utf8')); console.log('OK')"
```

## 许可证

本项目使用 MIT License，详见 `LICENSE`。
