"use client";

import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

const FirebaseSetupPage = () => {
  const t = useTranslations("firebaseSetup");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const envTemplate = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 站点配置
NEXT_PUBLIC_SITE_NAME=kukutx99
NEXT_PUBLIC_SITE_DESCRIPTION=个人技术博客
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_START_DATE=2025-01-01`;

  const currentConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "未配置",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "未配置",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "未配置",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "未配置",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "未配置",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "未配置",
  };

  const isConfigured = Object.values(currentConfig).every((value) => value !== "未配置");

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Firebase 配置向导</h1>
        <p className="mt-4 text-lg text-muted">
          按照以下步骤配置 Firebase，让你的博客系统正常运行
        </p>
      </div>

      {/* 当前配置状态 */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${isConfigured ? "bg-green-500" : "bg-yellow-500"}`}
          />
          <h2 className="text-xl font-semibold">
            配置状态：{isConfigured ? "已配置 ✓" : "未配置"}
          </h2>
        </div>
        <div className="grid gap-2 text-sm">
          {Object.entries(currentConfig).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-white/5 py-2">
              <span className="text-muted">{key}:</span>
              <span className={value === "未配置" ? "text-yellow-500" : "text-green-500"}>
                {value === "未配置" ? value : "●●●●●●"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 步骤1：创建Firebase项目 */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
            1
          </span>
          创建 Firebase 项目
        </h2>
        <ol className="ml-10 space-y-3 text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
            <span>
              访问{" "}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline"
              >
                Firebase 控制台
                <ExternalLink className="h-4 w-4" />
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
            <span>点击"添加项目"，创建一个新的 Firebase 项目</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
            <span>按照向导完成项目创建（可选择是否启用 Google Analytics）</span>
          </li>
        </ol>
      </div>

      {/* 步骤2：获取配置信息 */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
            2
          </span>
          获取 Firebase 配置
        </h2>
        <ol className="ml-10 space-y-3 text-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
            <span>在 Firebase 控制台，点击项目概览旁的齿轮图标 → "项目设置"</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
            <span>滚动到"您的应用"部分，点击 Web 应用图标（&lt;/&gt;）</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
            <span>注册应用，给应用起个名字（例如：my-blog）</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
            <span>复制显示的 Firebase SDK 配置信息</span>
          </li>
        </ol>
      </div>

      {/* 步骤3：启用服务 */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
            3
          </span>
          启用 Firebase 服务
        </h2>
        <div className="ml-10 space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Authentication (身份验证)</h3>
            <ol className="space-y-2 text-sm text-muted">
              <li>• 在左侧菜单选择"Authentication"</li>
              <li>• 点击"Get started"</li>
              <li>• 在"Sign-in method"标签页，启用"GitHub"登录</li>
              <li>• 按照提示配置 GitHub OAuth 应用</li>
            </ol>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Firestore Database (数据库)</h3>
            <ol className="space-y-2 text-sm text-muted">
              <li>• 在左侧菜单选择"Firestore Database"</li>
              <li>• 点击"创建数据库"</li>
              <li>• 选择"生产模式"或"测试模式"（测试模式仅用于开发）</li>
              <li>• 选择数据库位置（推荐：asia-east1）</li>
            </ol>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Storage (存储)</h3>
            <ol className="space-y-2 text-sm text-muted">
              <li>• 在左侧菜单选择"Storage"</li>
              <li>• 点击"Get started"</li>
              <li>• 按照向导完成存储桶创建</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 步骤4：配置环境变量 */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
            4
          </span>
          配置环境变量
        </h2>
        <div className="ml-10 space-y-4">
          <p className="text-muted">
            在项目根目录创建 <code className="rounded bg-accent/20 px-2 py-1">.env.local</code>{" "}
            文件，并添加以下内容：
          </p>
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-[#0f172a] p-4 text-sm text-foreground">
              {envTemplate}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard(envTemplate, "template")}
              className="absolute right-2 top-2 rounded-lg border border-white/10 bg-background/80 p-2 transition hover:border-accent hover:bg-background"
            >
              {copiedField === "template" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-muted">
            将 <code className="rounded bg-accent/20 px-1">your_*_here</code>{" "}
            替换为从Firebase控制台获取的实际值
          </p>
        </div>
      </div>

      {/* 步骤5：重启开发服务器 */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-background">
            5
          </span>
          重启开发服务器
        </h2>
        <div className="ml-10 space-y-3">
          <p className="text-muted">配置完成后，重启开发服务器使环境变量生效：</p>
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-[#0f172a] p-4 text-sm text-foreground">
              npm run dev
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard("npm run dev", "command")}
              className="absolute right-2 top-2 rounded-lg border border-white/10 bg-background/80 p-2 transition hover:border-accent hover:bg-background"
            >
              {copiedField === "command" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 完成提示 */}
      {isConfigured ? (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-xl font-semibold text-green-500">配置完成！</h3>
              <p className="mt-1 text-sm text-muted">
                你的 Firebase 已经配置成功，现在可以开始使用博客系统了。
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-yellow-500/20 p-2">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-500">等待配置</h3>
              <p className="mt-1 text-sm text-muted">
                请按照上述步骤完成 Firebase 配置，配置完成后刷新页面查看状态。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseSetupPage;

