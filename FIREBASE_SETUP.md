# Firebase 配置完整指南

## 📋 配置步骤概览

1. 创建 Firebase 项目
2. 获取配置信息
3. 启用必要的服务
4. 配置环境变量
5. 重启开发服务器

---

## 步骤 1: 创建 Firebase 项目

### 1.1 访问 Firebase 控制台

打开浏览器，访问 [Firebase 控制台](https://console.firebase.google.com/)

### 1.2 创建新项目

1. 点击 **"添加项目"** 或 **"Create a project"**
2. 输入项目名称（例如：`my-blog`）
3. 点击 **"继续"**
4. （可选）选择是否启用 Google Analytics
5. 点击 **"创建项目"**
6. 等待项目创建完成，点击 **"继续"**

---

## 步骤 2: 获取 Firebase 配置信息

### 2.1 注册 Web 应用

1. 在 Firebase 控制台，点击项目概览旁的 **⚙️ 齿轮图标** → **"项目设置"**
2. 滚动到 **"您的应用"** 部分
3. 点击 **Web 应用图标** (`</>`)
4. 注册应用：
   - 应用昵称：`my-blog`（或任意名称）
   - （可选）勾选 "Also set up Firebase Hosting"
5. 点击 **"注册应用"**

### 2.2 复制配置信息

你会看到一个包含 Firebase 配置的代码块，类似这样：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "my-blog-xxxxx.firebaseapp.com",
  projectId: "my-blog-xxxxx",
  storageBucket: "my-blog-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**请保存这些信息，下一步会用到！**

---

## 步骤 3: 启用 Firebase 服务

### 3.1 启用 Authentication (身份验证)

1. 在左侧菜单选择 **"Authentication"**（身份验证）
2. 点击 **"Get started"**（开始使用）
3. 在 **"Sign-in method"**（登录方式）标签页：
   - 找到 **"GitHub"** 并点击
   - 点击 **"启用"** 开关
   - 按照提示配置 GitHub OAuth 应用：
     - 访问 [GitHub Developer Settings](https://github.com/settings/developers)
     - 点击 **"New OAuth App"**
     - 填写信息：
       - Application name: `My Blog`
       - Homepage URL: `http://localhost:3000`（开发环境）
       - Authorization callback URL: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler`
     - 点击 **"Register application"**
     - 复制 **Client ID** 和 **Client secret**
   - 回到 Firebase，填入 GitHub 的 Client ID 和 Client secret
   - 点击 **"保存"**

### 3.2 启用 Firestore Database (数据库)

1. 在左侧菜单选择 **"Firestore Database"**
2. 点击 **"创建数据库"**
3. 选择模式：
   - **测试模式**（仅用于开发，30天后过期）
   - **生产模式**（需要配置安全规则）
4. 选择数据库位置：
   - 推荐：**asia-east1**（亚洲-东亚1，适合中国用户）
   - 或选择离你最近的位置
5. 点击 **"启用"**

### 3.3 配置 Firestore 安全规则（生产模式）

如果选择了生产模式，需要配置安全规则：

1. 在 Firestore Database 页面，点击 **"规则"** 标签
2. 替换为以下规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 文章集合：所有人可读，仅认证用户可写
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. 点击 **"发布"**

### 3.4 启用 Storage (存储)

1. 在左侧菜单选择 **"Storage"**
2. 点击 **"Get started"**
3. 按照向导完成存储桶创建：
   - 选择安全规则模式（测试/生产）
   - 选择存储位置（推荐与 Firestore 相同）

---

## 步骤 4: 配置环境变量

### 4.1 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件（如果不存在）。

### 4.2 添加配置

将步骤 2.2 中复制的配置信息填入以下模板：

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=你的_apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=你的_authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=你的_projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=你的_storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=你的_messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=你的_appId

# 站点配置（可选）
NEXT_PUBLIC_SITE_NAME=kukutx99
NEXT_PUBLIC_SITE_DESCRIPTION=个人技术博客
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_START_DATE=2025-01-01

# 管理员邮箱（可选，用于限制后台访问）
NEXT_PUBLIC_OWNER_EMAILS=your-email@example.com
```

**示例：**

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-blog-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-blog-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-blog-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 4.3 验证配置

访问 `http://localhost:3000/firebase-setup` 查看配置状态。

---

## 步骤 5: 重启开发服务器

配置完成后，重启开发服务器使环境变量生效：

```bash
# 停止当前服务器（Ctrl+C）
npm run dev
```

---

## ✅ 验证配置

### 检查清单

- [ ] Firebase 项目已创建
- [ ] Web 应用已注册
- [ ] Authentication 已启用（GitHub 登录）
- [ ] Firestore Database 已创建
- [ ] Storage 已启用
- [ ] `.env.local` 文件已创建并填写完整
- [ ] 开发服务器已重启

### 测试功能

1. **访问首页**：`http://localhost:3000`
   - 应该不再显示 Firebase 未配置的错误

2. **测试登录**：
   - 点击右上角的 "使用 GitHub 登录"
   - 应该能正常跳转到 GitHub 授权页面

3. **访问后台**：
   - 登录后访问 `/admin`
   - 应该能看到文章管理界面

---

## 🔧 故障排除

### 问题 1: 环境变量未生效

**解决方案：**
- 确保文件名为 `.env.local`（不是 `.env`）
- 确保文件在项目根目录
- 重启开发服务器

### 问题 2: GitHub 登录失败

**解决方案：**
- 检查 Firebase 中 GitHub 登录是否已启用
- 检查 GitHub OAuth App 的回调 URL 是否正确
- 确保 Client ID 和 Client secret 正确

### 问题 3: Firestore 权限错误

**解决方案：**
- 检查 Firestore 安全规则
- 确保已启用 Authentication
- 开发环境可以使用测试模式

### 问题 4: 配置页面显示"未配置"

**解决方案：**
- 检查 `.env.local` 文件是否存在
- 检查所有变量名是否正确（必须以 `NEXT_PUBLIC_` 开头）
- 检查变量值是否正确（没有多余的空格或引号）
- 重启开发服务器

---

## 📚 相关资源

- [Firebase 官方文档](https://firebase.google.com/docs)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub OAuth 应用创建指南](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

---

## 💡 提示

1. **开发环境 vs 生产环境**：
   - 开发环境可以使用测试模式
   - 生产环境务必配置正确的安全规则

2. **安全建议**：
   - 不要将 `.env.local` 文件提交到 Git
   - 生产环境使用环境变量管理工具（如 Vercel 的环境变量）

3. **数据库位置选择**：
   - 选择离用户最近的位置可以提高性能
   - 位置一旦选择无法更改

---

配置完成后，你就可以开始使用博客系统了！🎉

