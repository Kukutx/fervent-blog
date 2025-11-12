# fervent-blog 博客系统使用说明

## 项目概述

这是一个基于 Next.js 15 + React 19 + Firebase 构建的现代化个人博客系统，完全复刻了你旧博客的视觉风格和功能。

### 技术栈

- **前端框架**: Next.js 15.5.3 (App Router)
- **UI框架**: React 19.1.0
- **样式**: Tailwind CSS v4
- **后端**: Firebase (Firestore + Auth + Storage)
- **国际化**: next-intl v3.26.1
- **认证**: GitHub OAuth
- **Node版本**: v22.9.0

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置Firebase

#### 步骤1: 创建Firebase项目
1. 访问 [Firebase控制台](https://console.firebase.google.com/)
2. 创建新项目
3. 启用以下服务：
   - Authentication (GitHub登录)
   - Firestore Database
   - Storage

#### 步骤2: 获取配置信息
1. 在Firebase控制台，进入"项目设置"
2. 在"您的应用"中添加Web应用
3. 复制Firebase配置信息

#### 步骤3: 配置环境变量
复制 `.env.example` 为 `.env.local` 并填入你的Firebase配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入实际的Firebase配置：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 站点配置
NEXT_PUBLIC_SITE_NAME=kukutx99
NEXT_PUBLIC_SITE_DESCRIPTION=个人技术博客
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_START_DATE=2025-01-01
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看博客。

### 4. 首次配置

访问 http://localhost:3000/firebase-setup 查看详细的Firebase配置指南。

## 功能特性

### ✅ 核心功能

- [x] 全屏Hero Banner（带视差滚动和打字机效果）
- [x] 文章管理（CRUD操作）
- [x] 文章分类和标签系统
- [x] 文章归档（按时间线显示）
- [x] 文章搜索功能
- [x] 多语言支持（中文/英文/西班牙语/法语）
- [x] GitHub OAuth登录
- [x] 响应式设计

### 🎨 视觉特效

- [x] 自定义滚动条
- [x] 渐变背景动画
- [x] 动态线条背景（Canvas）
- [x] 雪花飘落效果（可选）
- [x] Live2D看板娘（框架已集成，需配置模型）
- [x] 卡片Hover效果
- [x] 图片Hover放大

### 📄 页面

- **首页**: Hero Banner + 文章列表
- **归档**: 按时间线浏览所有文章
- **分类**: 按分类浏览文章
- **标签**: 标签云 + 按标签浏览
- **关于**: 个人介绍和联系方式
- **友链**: 友情链接推荐
- **作品集**: 展示个人作品
- **简历**: 在线简历
- **工具**: 实用小工具
- **后台**: 文章管理（需登录）

## 目录结构

```
fervent-blog/
├── src/
│   ├── app/
│   │   └── [locale]/            # 多语言路由
│   │       ├── page.tsx          # 首页
│   │       ├── archives/         # 归档页
│   │       ├── categories/       # 分类页
│   │       ├── tags/             # 标签页
│   │       ├── about/            # 关于页
│   │       ├── links/            # 友链页
│   │       ├── portfolio/        # 作品集
│   │       ├── resume/           # 简历
│   │       ├── tools/            # 工具
│   │       ├── admin/            # 后台管理
│   │       └── firebase-setup/   # Firebase配置指南
│   ├── components/
│   │   ├── effects/              # 特效组件
│   │   ├── home/                 # 首页组件
│   │   ├── layout/               # 布局组件
│   │   ├── search/               # 搜索组件
│   │   └── providers/            # Context Providers
│   ├── lib/
│   │   ├── firebase.ts           # Firebase配置
│   │   ├── posts.ts              # 文章CRUD函数
│   │   └── i18n/                 # 国际化配置
│   └── messages/                 # 翻译文件
├── public/
│   └── images/                   # 图片资源
└── .env.local                    # 环境变量（不提交）
```

## 使用指南

### 发布文章

1. 使用GitHub账号登录
2. 访问 `/admin` 管理后台
3. 填写文章信息：
   - 标题
   - URL标识（slug）
   - 摘要
   - 正文（支持Markdown）
   - 封面图片
   - 分类
   - 标签
   - 语言
4. 点击"创建文章"

### 自定义样式

全局样式在 `src/app/globals.css` 中定义，包括：
- 自定义滚动条
- 渐变背景
- 动画效果
- 颜色主题

### 特效配置

在 `src/components/layout/site-shell.tsx` 中可以开启/关闭特效：

```typescript
const [effectsEnabled, setEffectsEnabled] = useState({
  dynamicLines: true,  // 动态线条
  snowflakes: false,   // 雪花效果
  live2d: false,       // Live2D看板娘
});
```

### Live2D配置

1. 下载Live2D模型到 `public/live2d/` 目录
2. 安装live2d-widget库（如需要）
3. 在 `src/components/effects/live2d.tsx` 中配置模型路径
4. 在site-shell.tsx中启用

## 部署

### Vercel部署（推荐）

1. 将代码推送到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 部署

### 其他平台

支持任何支持Next.js的托管平台：
- Netlify
- Railway
- AWS Amplify
- 自建服务器

## 故障排除

### Firebase权限错误
确保在Firebase控制台中正确配置了Firestore规则和Storage规则。

### 构建错误
删除 `.next` 文件夹后重新构建：
```bash
rm -rf .next
npm run build
```

### TypeScript错误
运行类型检查：
```bash
npx tsc --noEmit
```

## 参考资源

- [Next.js文档](https://nextjs.org/docs)
- [Firebase文档](https://firebase.google.com/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [next-intl文档](https://next-intl-docs.vercel.app/)

## 许可证

MIT License

## 联系方式

- GitHub: [@Kukutx](https://github.com/Kukutx)
- 博客: 配置完成后填写

---

**祝你使用愉快！ 🎉**

