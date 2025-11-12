# 文章导入工具

这个工具可以从你的旧 Hexo 博客 GitHub 仓库中导入所有 markdown 文章到新的 Firebase 博客。

## 前置要求

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置 Firebase**
   - 确保 `.env.local` 文件已配置所有 Firebase 环境变量
   - 参考 `.env.example` 文件

## 使用方法

### 基本用法

```bash
npm run import-posts https://github.com/Kukutx/kukuBlog.github.io
```

### 指定源目录

如果你的文章不在默认的 `source/_posts` 目录：

```bash
npm run import-posts https://github.com/Kukutx/kukuBlog.github.io source/_posts
```

### 完整参数

```bash
npm run import-posts <github-repo-url> [source-dir] [temp-dir]
```

参数说明：
- `github-repo-url`: GitHub 仓库 URL（必需）
- `source-dir`: 源文件目录（默认: `source/_posts`）
- `temp-dir`: 临时克隆目录（默认: `.temp-blog-import`）

## 导入过程

1. **克隆仓库**: 脚本会临时克隆你的 GitHub 仓库
2. **解析文件**: 读取所有 `.md` 文件并解析 frontmatter
3. **转换格式**: 
   - 提取标题、日期、分类、标签
   - 将 markdown 转换为 HTML
   - 生成摘要
   - 检测语言（中文/英文）
4. **导入 Firebase**: 将文章添加到 Firestore
5. **清理**: 删除临时克隆的仓库

## 支持的前置元数据（Frontmatter）

脚本支持以下 frontmatter 字段：

- `title` (必需): 文章标题
- `date`: 发布日期（格式: `YYYY-MM-DD` 或 ISO 格式）
- `categories`: 分类（字符串或数组）
- `tags`: 标签（字符串或数组）
- `permalink`: 自定义链接（可选）
- `coverImage`: 封面图片 URL（可选）

示例：

```markdown
---
title: 我的第一篇文章
date: 2022-09-27
categories: 生活
tags: [原创, 随笔]
permalink: /my-first-post
coverImage: /images/cover.jpg
---

文章内容...
```

## 注意事项

1. **重复导入**: 如果文章已存在（相同 slug），可能会创建重复文章。建议先清空 Firestore 中的 posts 集合，或手动检查。

2. **日期格式**: 
   - 如果 frontmatter 中有 `date` 字段，会使用该日期
   - 如果文件名包含日期格式（如 `2022-09-27-title.md`），会从文件名提取
   - 否则使用当前日期

3. **语言检测**: 
   - 自动检测文章语言（基于标题和内容中的中文字符）
   - 包含中文 → `zh`
   - 不包含中文 → `en`

4. **分类和标签**: 
   - 如果 frontmatter 中分类是数组，使用第一个分类
   - 标签支持数组或逗号分隔的字符串

## 故障排除

### 错误: Firebase 未配置
确保 `.env.local` 文件存在且包含所有必需的 Firebase 变量。

### 错误: 找不到目录
检查 `source-dir` 参数是否正确。Hexo 博客的文章通常在 `source/_posts` 目录。

### 错误: Git 克隆失败
确保：
- 仓库 URL 正确
- 有网络连接
- 仓库是公开的（或已配置 SSH 密钥）

## 示例输出

```
📥 开始从 https://github.com/Kukutx/kukuBlog.github.io 导入文章...

📦 克隆仓库到 .temp-blog-import...
📄 找到 10 个 markdown 文件

✅ 已导入: PWM (zh)
✅ 已导入: Electronic circuit (en)
✅ 已导入: Resistor (zh)
...

✨ 导入完成!
   ✅ 成功: 10 篇
   ⚠️  跳过: 0 篇
```

