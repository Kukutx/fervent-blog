import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const projects = [
  {
    key: "aurora",
    cover:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80",
    year: "2024",
  },
  {
    key: "atlas",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    year: "2023",
  },
  {
    key: "palette",
    cover:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80",
    year: "2022",
  },
];

export const metadata: Metadata = {
  title: "Portfolio",
};

const PortfolioPage = async () => {
  const t = await getTranslations();

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold uppercase tracking-[0.4em] text-muted">
          {t("portfolio.title")}
        </h1>
        <p className="max-w-3xl text-sm text-muted">{t("portfolio.description")}</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.key}
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/70 backdrop-blur"
          >
            <div className="relative h-48 w-full">
              <Image
                src={project.cover}
                alt={t(`portfolio.projects.${project.key}.title`)}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-accent">{project.year}</p>
              <h2 className="text-xl font-semibold text-white/90">
                {t(`portfolio.projects.${project.key}.title`)}
              </h2>
              <p className="flex-1 text-sm text-muted">
                {t(`portfolio.projects.${project.key}.summary`)}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {t(`portfolio.projects.${project.key}.role`)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PortfolioPage;
