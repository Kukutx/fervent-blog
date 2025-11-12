import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const experience = [
  {
    company: "Nebula Collective",
    role: "Lead Product Designer",
    period: "2022 — Present",
    description:
      "Leading cross-functional pods to craft immersive editorial experiences and data storytelling products.",
  },
  {
    company: "Studio Lumen",
    role: "Senior UX Engineer",
    period: "2018 — 2022",
    description:
      "Prototyped motion-rich interfaces, shipped design systems and bridged design with engineering teams.",
  },
];

const education = [
  {
    school: "Parsons School of Design",
    degree: "MFA Design + Technology",
    year: "2018",
  },
  {
    school: "Tongji University",
    degree: "BDes Industrial Design",
    year: "2015",
  },
];

export const metadata: Metadata = {
  title: "Resume",
};

const ResumePage = async () => {
  const t = await getTranslations();

  return (
    <section className="space-y-12">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold uppercase tracking-[0.4em] text-muted">
            {t("resume.title")}
          </h1>
          <p className="max-w-2xl text-sm text-muted">{t("resume.subtitle")}</p>
        </div>
        <a
          href="/resume.pdf"
          className="rounded-full border border-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-accent transition hover:bg-accent hover:text-background"
        >
          {t("resume.download")}
        </a>
      </header>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-muted">Experience</h2>
          <div className="space-y-4">
            {experience.map((item) => (
              <article
                key={item.company}
                className="rounded-3xl border border-white/10 bg-background/70 p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white/90">{item.company}</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted">
                    {item.period}
                  </span>
                </div>
                <p className="text-sm text-accent">{item.role}</p>
                <p className="mt-3 text-sm text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-muted">Education</h2>
          <div className="space-y-4">
            {education.map((item) => (
              <article
                key={item.school}
                className="rounded-3xl border border-white/10 bg-background/70 p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white/90">{item.school}</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted">{item.year}</span>
                </div>
                <p className="text-sm text-accent">{item.degree}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumePage;
