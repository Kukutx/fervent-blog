#!/usr/bin/env tsx
/**
 * 从旧博客 GitHub 仓库导入 markdown 文章
 * 
 * 使用方法:
 * 1. 确保已配置 Firebase 环境变量
 * 2. 运行: npx tsx scripts/import-posts.ts <github-repo-url> [source-dir]
 * 
 * 示例:
 * npx tsx scripts/import-posts.ts https://github.com/Kukutx/kukuBlog.github.io source/_posts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// Firebase 配置
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface PostFrontmatter {
  title: string;
  date?: string;
  categories?: string | string[];
  tags?: string | string[];
  permalink?: string;
  [key: string]: unknown;
}

interface ImportedPost {
  title: string;
  slug: string;
  summary: string;
  content: string;
  locale: string;
  category?: string;
  tags?: string[];
  publishedAt: Date;
  coverImage?: string;
}

// 从 markdown 内容生成摘要
function generateSummary(content: string, maxLength = 150): string {
  // 移除 markdown 语法
  const plainText = content
    .replace(/^#+\s+/gm, "") // 移除标题标记
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // 移除图片
    .replace(/`([^`]+)`/g, "$1") // 移除代码标记
    .replace(/\*\*([^\*]+)\*\*/g, "$1") // 移除粗体
    .replace(/\*([^\*]+)\*/g, "$1") // 移除斜体
    .replace(/\n+/g, " ") // 替换换行为空格
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength) + "...";
}

// 从文件名或 permalink 生成 slug
function generateSlug(title: string, filename: string, permalink?: string): string {
  if (permalink) {
    return permalink.replace(/^\//, "").replace(/\/$/, "");
  }

  // 从文件名提取（去掉 .md 扩展名）
  const nameFromFile = filename.replace(/\.md$/, "");

  // 如果文件名看起来像日期格式（如 2022-09-27-title），提取标题部分
  const dateMatch = nameFromFile.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  if (dateMatch) {
    return dateMatch[1];
  }

  // 从标题生成 slug
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 移除特殊字符
    .replace(/\s+/g, "-") // 空格替换为连字符
    .replace(/-+/g, "-") // 多个连字符合并为一个
    .trim();
}

// 检测语言
function detectLocale(title: string, content: string): string {
  // 简单的语言检测：检查是否包含中文字符
  const hasChinese = /[\u4e00-\u9fa5]/.test(title + content);
  return hasChinese ? "zh" : "en";
}

// 处理分类和标签
function processCategories(categories?: string | string[]): string | undefined {
  if (!categories) return undefined;
  if (Array.isArray(categories)) {
    return categories[0]; // 取第一个分类
  }
  if (typeof categories === "string") {
    const cats = categories.split(/[,\s]+/).filter(Boolean);
    return cats[0];
  }
  return undefined;
}

function processTags(tags?: string | string[]): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags;
  }
  if (typeof tags === "string") {
    return tags.split(/[,\s]+/).filter(Boolean);
  }
  return [];
}

// 解析单个 markdown 文件
async function parseMarkdownFile(filePath: string): Promise<ImportedPost | null> {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const frontmatter = data as PostFrontmatter;
    const filename = path.basename(filePath);

    if (!frontmatter.title) {
      console.warn(`⚠️  跳过文件 ${filename}：缺少标题`);
      return null;
    }

    // 转换 markdown 为 HTML
    const processedContent = await remark().use(remarkHtml).process(content);
    const contentHtml = processedContent.toString();

    const locale = detectLocale(frontmatter.title, content);
    const slug = generateSlug(frontmatter.title, filename, frontmatter.permalink);
    const summary = generateSummary(content);

    // 解析日期
    let publishedAt: Date;
    if (frontmatter.date) {
      publishedAt = new Date(frontmatter.date);
    } else {
      // 尝试从文件名提取日期
      const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        publishedAt = new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`);
      } else {
        publishedAt = new Date(); // 默认使用当前日期
      }
    }

    return {
      title: frontmatter.title,
      slug,
      summary,
      content: contentHtml,
      locale,
      category: processCategories(frontmatter.categories),
      tags: processTags(frontmatter.tags),
      publishedAt,
      coverImage: frontmatter.coverImage as string | undefined,
    };
  } catch (error) {
    console.error(`❌ 解析文件 ${filePath} 时出错:`, error);
    return null;
  }
}

// 导入文章到 Firebase
async function importPostToFirebase(post: ImportedPost): Promise<void> {
  try {
    await addDoc(collection(db, "posts"), {
      ...post,
      publishedAt: Timestamp.fromDate(post.publishedAt),
    });
    console.log(`✅ 已导入: ${post.title} (${post.locale})`);
  } catch (error) {
    console.error(`❌ 导入文章 "${post.title}" 时出错:`, error);
    throw error;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(`
使用方法:
  npx tsx scripts/import-posts.ts <github-repo-url> [source-dir] [temp-dir]

参数:
  github-repo-url: GitHub 仓库 URL（如 https://github.com/Kukutx/kukuBlog.github.io）
  source-dir: 源文件目录（默认为 source/_posts）
  temp-dir: 临时克隆目录（默认为 .temp-blog-import）

示例:
  npx tsx scripts/import-posts.ts https://github.com/Kukutx/kukuBlog.github.io source/_posts
    `);
    process.exit(1);
  }

  const repoUrl = args[0];
  const sourceDir = args[1] || "source/_posts";
  const tempDir = args[2] || ".temp-blog-import";

  console.log(`📥 开始从 ${repoUrl} 导入文章...\n`);

  // 检查 Firebase 配置
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("❌ 错误: 请先配置 Firebase 环境变量");
    console.error("   创建 .env.local 文件并添加 NEXT_PUBLIC_FIREBASE_* 变量");
    process.exit(1);
  }

  try {
    // 克隆仓库到临时目录
    if (fs.existsSync(tempDir)) {
      console.log(`🗑️  清理临时目录 ${tempDir}...`);
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    console.log(`📦 克隆仓库到 ${tempDir}...`);
    execSync(`git clone --depth 1 ${repoUrl} ${tempDir}`, { stdio: "inherit" });

    const postsDir = path.join(tempDir, sourceDir);
    if (!fs.existsSync(postsDir)) {
      console.error(`❌ 错误: 找不到目录 ${postsDir}`);
      console.error(`   请检查 source-dir 参数是否正确`);
      process.exit(1);
    }

    // 读取所有 markdown 文件
    const files = fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => path.join(postsDir, file));

    console.log(`\n📄 找到 ${files.length} 个 markdown 文件\n`);

    // 解析并导入文章
    let successCount = 0;
    let skipCount = 0;

    for (const file of files) {
      const post = await parseMarkdownFile(file);
      if (post) {
        try {
          await importPostToFirebase(post);
          successCount++;
        } catch (error) {
          skipCount++;
          console.error(`   跳过: ${post.title}`);
        }
      } else {
        skipCount++;
      }
    }

    // 清理临时目录
    console.log(`\n🧹 清理临时目录...`);
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log(`\n✨ 导入完成!`);
    console.log(`   ✅ 成功: ${successCount} 篇`);
    console.log(`   ⚠️  跳过: ${skipCount} 篇`);
  } catch (error) {
    console.error("\n❌ 导入过程中出错:", error);
    process.exit(1);
  }
}

main().catch(console.error);

