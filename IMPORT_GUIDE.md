# 从旧博客导入文章指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Firebase

确保 `.env.local` 文件已配置：

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 3. 运行导入脚本

```bash
npm run import-posts https://github.com/Kukutx/kukuBlog.github.io
```

脚本会自动：
- 克隆你的旧博客仓库
- 解析所有 markdown 文件
- 提取文章信息（标题、日期、分类、标签等）
- 转换为 HTML 格式
- 导入到 Firebase Firestore

### 4. 查看结果

导入完成后，刷新你的博客网站，文章应该会自动显示。

## 详细说明

参考 `scripts/README.md` 获取更详细的使用说明。

## 常见问题

**Q: 导入后文章没有显示？**
A: 检查 Firebase 配置是否正确，确保 Firestore 中有数据。

**Q: 如何重新导入？**
A: 脚本会创建新文档，不会覆盖。如需重新导入，建议先清空 Firestore 中的 posts 集合。

**Q: 支持哪些 markdown 格式？**
A: 支持标准的 markdown 和 Hexo frontmatter 格式。

