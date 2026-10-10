# PJSK_LH

> 世界计划（Project SEKAI）卡片个人收集图鉴 · 离线网页版

🌐 其他语言：[English](README_en.md)

一个**纯静态、可离线运行**的《世界计划 多彩舞台！（プロジェクトセカイ / Project SEKAI: Colorful Stage!）》**卡片收藏图鉴**。无需后端、无需构建，打开网页即可浏览你的卡片收集，并按团队、角色、卡牌类型快速筛选。

🌐 在线预览：https://a39yile.github.io/PJSK_LH/

## ✨ 功能特性

- **卡片图鉴**：收录 **76 张**卡片，按六大团体分组展示
  - Leo/need · MORE MORE JUMP! · Vivid BAD SQUAD · Wonderlands×Showtime · 25时，在Nightcord见 · Virtual Singers
- **多维筛选**：支持按「搜索关键词 / 卡牌类型 / 团队 / 角色」组合筛选
  - 卡牌类型：常驻、期间限定、WL限定、BFES、CFES、联动限定、生日
- **筛选状态可分享**：筛选条件同步到 URL（`pushState`），可复制链接分享、刷新不丢失
- **团队分组折叠**：点击顶部图标栏可展开 / 收起对应团队
- **双视图路由**：`#home`（图鉴）与 `#mine`（「关于」/我的）通过 hash 无刷新切换
- **卡片详情页**：点击卡片查看大图，底部两排信息（卡名 / 类型 / 角色），点击角色名可跳转到对应团队
- **外链安全中转**：所有外部链接经 `external.html` 二次确认页跳转，仅放行 `http/https`，防止 `javascript:` 注入
- **明暗主题**：支持浅色 / 深色主题，记忆偏好（localStorage），并适配系统偏好与 APP 内 WebView
- **响应式布局**：移动端与 PC 端均做了适配

## 📊 收录概况

| 团体 | 卡片数 |
|---|---|
| MORE MORE JUMP! | 21 |
| Virtual Singers | 14 |
| Leo/need | 12 |
| Wonderlands×Showtime | 11 |
| Vivid BAD SQUAD | 9 |
| 25时，在Nightcord见 | 9 |
| **合计** | **76** |

## 🗂 目录结构

```
PJSK_LH/
├── index.html          # 主页（卡片图鉴）
├── mine.html           # 「关于」视图（角色外链入口）
├── detail.html         # 卡片详情大图页
├── external.html       # 外部链接确认中转页
├── app.js              # 主页核心逻辑（筛选 / URL 同步 / 路由 / 渲染）
├── script.js           # 主题切换逻辑
├── style.css           # 样式
├── data/
│   ├── zy_data.js      # 卡片数据 cardsData（76 张）
│   ├── gy_data.js      # 「关于」页链接数据 linkData
│   └── data.zip        # 数据包
└── icon/               # 卡片图、团体图标、角色头像、背景图等素材
```

## 🚀 本地运行

本项目是纯静态页面，**无需安装任何依赖**。两种方式任选其一：

**方式一：本地静态服务器（推荐）**

```bash
# 在项目根目录执行，使用 Python 启动一个本地服务器
python3 -m http.server 8000
# 然后浏览器访问 http://localhost:8000
```

**方式二：直接打开**

直接双击 `index.html` 用浏览器打开即可。部分浏览器对本地 `file://` 加载脚本有跨域限制，若页面空白请改用方式一。

## 📝 如何维护数据

所有内容都集中在数据文件中，**改数据即可，无需改动页面逻辑**：

- **新增 / 修改卡片**：编辑 `data/zy_data.js` 中的 `cardsData` 数组，每条记录包含：

  ```js
  {
    "group": "Leo/need",                 // 所属团队
    "character": "天马咲希",              // 角色名
    "type": "常驻",                      // 卡牌类型
    "card_name": "谢意满满！",            // 卡名
    "image": "icon/Leoneed/1098.webp"    // 图片路径
  }
  ```

- **修改「关于」页链接**：编辑 `data/gy_data.js` 中的 `linkData` 数组（角色 → pjsk.moe 资料页等）。

> 提示：修改数据后重新部署时，可顺手更新 `index.html` 里脚本引用的版本号（`?v=xxxxxx`），避免浏览器缓存旧数据。

## 🛠 技术栈

- 纯 **HTML + CSS + JavaScript**（原生，无框架、无打包工具）
- 无后端、无数据库，可完全离线运行
- 部署：GitHub Pages

## 📦 部署

仓库已开启 GitHub Pages，推送到 `main` 分支后自动发布：

- 在线地址：https://a39yile.github.io/PJSK_LH/

## ⚠️ 版权声明

《世界计划 多彩舞台！》（Project SEKAI: Colorful Stage!）及其相关角色、卡片、图像等素材的版权归 **SEGA / Crypton Future Media** 等权利方所有。

本项目为**非商业性的个人收藏 / 学习用途同人作品**，所有游戏素材仅用于展示个人收集，请勿用于商业用途。如权利方提出异议，将第一时间移除相关内容。
