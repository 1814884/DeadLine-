# 小红书仿制App

基于UniApp开发的仿小红书应用，支持多端打包。

## 功能特性

- 🏠 首页瀑布流展示
- 🔍 发现页面和搜索功能
- 📝 发布笔记功能
- 💬 消息和通知系统
- 👤 个人中心
- 📱 多端适配（H5、小程序、App）

## 技术栈

- UniApp 3.x
- Vue 3
- Vite
- SCSS

## 项目结构

```
├── pages/                 # 页面文件
│   ├── index/            # 首页
│   ├── discover/         # 发现页
│   ├── publish/          # 发布页
│   ├── message/          # 消息页
│   ├── profile/          # 个人中心
│   └── detail/           # 笔记详情
├── components/           # 组件
├── utils/               # 工具函数
├── static/              # 静态资源
├── App.vue              # 应用入口
├── main.js              # 主入口文件
├── pages.json           # 页面配置
├── manifest.json        # 应用配置
└── uni.scss            # 全局样式变量
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
# H5开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# App开发
npm run dev:app
```

### 生产构建

```bash
# H5构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# App构建
npm run build:app
```

## 页面说明

### 首页 (pages/index)
- 瀑布流布局展示笔记
- 支持下拉刷新和上拉加载
- 点击笔记跳转详情页

### 发现页 (pages/discover)
- 分类标签筛选
- 推荐内容和热门内容
- 搜索功能

### 发布页 (pages/publish)
- 多图片选择上传
- 文字内容编辑
- 话题标签添加
- 位置信息选择
- 隐私设置

### 消息页 (pages/message)
- 消息和通知分类
- 聊天列表
- 通知中心

### 个人中心 (pages/profile)
- 用户信息展示
- 我的笔记网格
- 功能菜单

### 笔记详情 (pages/detail)
- 图片轮播展示
- 笔记内容详情
- 互动功能（点赞、评论、收藏、分享）
- 评论列表

## 多端适配

项目已配置支持以下平台：
- H5
- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ小程序
- App (Android/iOS)

## 注意事项

1. 底部导航栏图标需要自行添加，参考 `static/tabbar/README.md`
2. 图片资源使用随机图片服务，生产环境请替换为实际图片
3. 网络请求已配置基础框架，需要根据实际API进行调整
4. 部分功能为演示效果，实际开发需要对接后端服务

## 许可证

MIT License