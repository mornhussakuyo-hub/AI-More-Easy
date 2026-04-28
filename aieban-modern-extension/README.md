# AI更易办 

让事更更容易办！

AI更易办是一个在本地浏览器中美化 AI易办本科生平台旧式页面的 Chrome / Edge 扩展。它只修改你浏览器里看到的页面样式和交互，不会修改 AI易办服务器数据，也不会读取、保存或上传账号密码。

![](photo/usage/after.png)

由于开发者是本科生，没有研究生或教师端的访问权限，故目前扩展仅在本科生账号下表现最佳，其他账号不保证表现。

请注意，本项目是一个个人项目，并不是官方项目，因此在使用本项目时，由于渲染错误导致的任何信息丢失均不负责。不过，开发者会尽力保证在不丢失网站原信息的前提条件下维护项目！

如果你喜欢本项目，希望你能给一个星标，这是免费的，而且对我很有鼓励作用！

如果你有任何宝贵的建议，也可以联系开发者：

- `QQ: 2564664062`
- `WeChat: mornhus`
- `Email: xsylfcleaning@outlook.com / mornhussakuyo@gmail.com`

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
3. 打开“开发人员模式”。
4. 点击“加载解压缩的扩展”。
5. 选择 `aieban-modern-extension` 这个文件夹。
6. 重新打开或刷新 AI易办本科生平台。

安装成功后，登录后的 AI易办页面会自动应用新界面。

## 更新安装

如果你拿到新版代码：

1. 替换本地的 `aieban-modern-extension` 文件夹。
2. 打开 `edge://extensions/` 或 `chrome://extensions/`。
3. 找到 AI更易办，点击“重新加载”。
4. 刷新 AI易办页面。

## 隐私与权限

扩展目前只通过 content script 作用于：

```text
https://aieban.whu.edu.cn/ebanbenke/*
http://aieban.whu.edu.cn/ebanbenke/*
https://aieban.whu.edu.cn/eban/*
http://aieban.whu.edu.cn/eban/*
```

它没有后台服务，没有远程接口，也没有申请额外浏览器权限。页面收藏、夜间模式、导航收起状态等偏好保存在浏览器本地 `localStorage` 中。

## 开发说明

主要文件：

- `manifest.json`：扩展清单。
- `src/content.js`：入口调度器，只负责初始化和调用各模块。
- `src/core/`：常量、偏好设置、frame 判断、页面识别、安全退出。
- `src/layout/`：顶部栏和左侧导航。
- `src/pages/`：各功能页的 DOM 重写逻辑。
- `src/styles.css`：现代化样式。
- `assets/`：院徽资源和扩展图标。
- `assets/icons/`：扩展图标，包含 16、32、48、128 像素版本。
- `docs/aieban-guide.md`：使用指南内容。
- `docs/maintenance.md`：从零开始的维护手册、目录地图和新增页面教程。

修改后可以用下面的命令做一次基础语法检查：

```powershell
node -e "const fs=require('fs'); const m=JSON.parse(fs.readFileSync('manifest.json','utf8')); const js=m.content_scripts[0].js.map(p=>fs.readFileSync(p,'utf8')).join('\n'); new Function(js); console.log('combined js OK')"
```

## 许可证

本项目使用 MIT License，详见 `LICENSE`。
