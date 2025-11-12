import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ToolsBoard } from "@/components/tools/tools-board";

export const metadata: Metadata = {
  title: "Tools",
};

const ToolsPage = async () => {
  const t = await getTranslations();

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold uppercase tracking-[0.4em] text-muted">
          {t("tools.title")}
        </h1>
        <p className="max-w-3xl text-sm text-muted">{t("tools.description")}</p>
      </header>
      <ToolsBoard />
    </section>
  );
};

export default ToolsPage;
