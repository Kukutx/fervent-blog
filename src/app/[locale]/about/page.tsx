import { useTranslations } from "next-intl";
import { Github, Mail, Twitter } from "lucide-react";

const AboutPage = () => {
  const t = useTranslations();

  const skills = [
    { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { name: "Backend", items: ["Node.js", "Firebase", "PostgreSQL"] },
    { name: "Tools", items: ["Git", "VS Code", "Docker"] },
  ];

  const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com/Kukutx", color: "hover:text-[#333]" },
    { name: "Twitter", icon: Twitter, url: "#", color: "hover:text-[#1DA1F2]" },
    { name: "Email", icon: Mail, url: "mailto:your-email@example.com", color: "hover:text-accent" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 页头 */}
      <div className="mb-12 text-center sm:mb-16">
        <div className="mb-4 text-4xl sm:mb-6 sm:text-6xl">👋</div>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
          {t("about.title")}
        </h1>
        <p className="mt-3 text-lg text-muted sm:mt-4 sm:text-xl">{t("about.subtitle")}</p>
      </div>

      {/* 自我介绍 */}
      <section className="mb-8 rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur sm:mb-12 sm:rounded-3xl sm:p-8 md:p-12">
        <h2 className="mb-4 text-xl font-bold text-foreground sm:mb-6 sm:text-2xl">
          {t("about.introduction")}
        </h2>
        <div className="space-y-3 text-base leading-relaxed text-muted sm:space-y-4 sm:text-lg">
          <p>
            你好！我是 <span className="font-semibold text-accent">kukutx</span>，一名热爱技术的开发者。
          </p>
          <p>
            这个博客是我记录学习笔记、技术探索和生活感悟的地方。我相信通过分享知识，可以帮助更多的人，
            同时也能让自己对技术有更深入的理解。
          </p>
          <p>
            在这里，你可以找到关于前端开发、后端架构、编程语言等方面的文章。
            如果你对我的内容感兴趣，欢迎通过下面的社交链接与我交流！
          </p>
        </div>
      </section>

      {/* 技能栈 */}
      <section className="mb-8 sm:mb-12">
        <h2 className="mb-6 text-xl font-bold text-foreground sm:mb-8 sm:text-2xl">
          🛠️ {t("about.skills")}
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {skills.map((category) => (
            <div
              key={category.name}
              className="rounded-xl border border-white/10 bg-background/70 p-4 backdrop-blur sm:rounded-2xl sm:p-6"
            >
              <h3 className="mb-3 text-sm font-semibold text-accent sm:mb-4 sm:text-base">{category.name}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {category.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted sm:text-sm">
                    <span className="text-accent">▪</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 社交链接 */}
      <section className="rounded-2xl border border-white/10 bg-background/70 p-6 backdrop-blur sm:rounded-3xl sm:p-8 md:p-12">
        <h2 className="mb-6 text-center text-xl font-bold text-foreground sm:mb-8 sm:text-2xl">
          💬 {t("about.contact")}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:scale-105 hover:border-accent sm:gap-3 sm:px-6 sm:py-4 sm:text-base ${link.color}`}
            >
              <link.icon size={20} className="sm:w-6 sm:h-6" />
              <span className="font-semibold">{link.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 博客信息 */}
      <section className="mt-8 text-center sm:mt-12">
        <div className="inline-block rounded-xl border border-white/10 bg-background/70 px-6 py-3 backdrop-blur sm:rounded-2xl sm:px-8 sm:py-4">
          <p className="text-xs text-muted sm:text-sm">
            {t("about.built")} <span className="font-semibold text-accent">Next.js 15</span> +{" "}
            <span className="font-semibold text-accent">React 19</span> +{" "}
            <span className="font-semibold text-accent">Firebase</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

