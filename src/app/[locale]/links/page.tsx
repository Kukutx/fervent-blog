"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const LinksPage = () => {
  const t = useTranslations();

  // 友链数据 - 实际项目中可以从Firebase读取
  const friendLinks = [
    {
      name: "Example Blog",
      url: "https://example.com",
      avatar: "/images/default-post.png",
      description: "一个优秀的技术博客",
    },
    {
      name: "Tech Hub",
      url: "https://example.com",
      avatar: "/images/default-post.png",
      description: "分享前沿技术资讯",
    },
    {
      name: "Developer Zone",
      url: "https://example.com",
      avatar: "/images/default-post.png",
      description: "开发者学习交流平台",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          🔗 {t("links.title")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("links.description")}</p>
      </div>

      {/* 申请友链说明 */}
      <div className="mb-12 rounded-3xl border border-accent/20 bg-accent/5 p-8 backdrop-blur">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          ✨ {t("links.applyTitle")}
        </h2>
        <div className="space-y-3 text-muted">
          <p>{t("links.applyDescription")}</p>
          <ul className="ml-6 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-accent">▪</span>
              <span>网站内容积极健康，无违法违规信息</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">▪</span>
              <span>网站可以正常访问，非频繁更换域名</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">▪</span>
              <span>原创博客优先，转载需注明出处</span>
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-white/5 p-4 font-mono text-sm">
            <strong className="text-accent">本站信息：</strong>
            <br />
            名称：{process.env.NEXT_PUBLIC_SITE_NAME || "kukutx99"}
            <br />
            链接：{process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}
            <br />
            描述：{process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "个人技术博客"}
          </p>
        </div>
      </div>

      {/* 友链列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {friendLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover group rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur transition hover:border-accent"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                <Image src={link.avatar} alt={link.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground transition group-hover:text-accent">
                    {link.name}
                  </h3>
                  <ExternalLink
                    size={16}
                    className="text-muted opacity-0 transition group-hover:opacity-100"
                  />
                </div>
                <p className="mt-2 text-sm text-muted line-clamp-2">{link.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {friendLinks.length === 0 && (
        <div className="py-20 text-center text-muted">
          <p className="text-lg">{t("links.empty")}</p>
        </div>
      )}
    </div>
  );
};

export default LinksPage;

