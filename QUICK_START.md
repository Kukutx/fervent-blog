# 🚀 快速开始指南

## 第一步：配置 Firebase

### 方法 1: 使用配置页面（推荐）

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问配置页面：
   ```
   http://localhost:3000/firebase-setup
   ```

3. 按照页面上的步骤完成配置

### 方法 2: 手动配置

1. **创建 Firebase 项目**
   - 访问 [Firebase 控制台](https://console.firebase.google.com/)
   - 创建新项目

2. **获取配置信息**
   - 项目设置 → 您的应用 → 注册 Web 应用
   - 复制配置信息

3. **启用服务**
   - Authentication → 启用 GitHub 登录
   - Firestore Database → 创建数据库
   - Storage → 启用存储

4. **创建 .env.local 文件**
   ```bash
   # 复制示例文件
   cp .env.example .env.local
   ```

5. **填写配置**
   - 打开 `.env.local`
   - 将从 Firebase 获取的值填入对应位置

6. **重启服务器**
   ```bash
   npm run dev
   ```

详细步骤请查看 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

---

## 第二步：导入旧博客文章（可选）

如果你有旧博客的 markdown 文件：

```bash
# 安装依赖（如果还没安装）
npm install

# 导入文章
npm run import-posts https://github.com/Kukutx/kukuBlog.github.io
```

详细说明请查看 [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)

---

## 第三步：开始使用

配置完成后：

1. ✅ 访问首页查看博客
2. ✅ 使用 GitHub 登录
3. ✅ 访问 `/admin` 管理文章
4. ✅ 开始写文章！

---

## 📚 更多文档

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase 详细配置指南
- [IMPORT_GUIDE.md](./IMPORT_GUIDE.md) - 文章导入指南
- [scripts/README.md](./scripts/README.md) - 导入脚本详细说明

