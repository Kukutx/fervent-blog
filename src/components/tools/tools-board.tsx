"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const randomHex = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;

const generatePalette = () => Array.from({ length: 5 }, randomHex);

export const ToolsBoard = () => {
  const t = useTranslations();
  const [palette, setPalette] = useState<string[]>(() => generatePalette());
  const [text, setText] = useState("");
  const [timestamp, setTimestamp] = useState<string>(
    () => Math.floor(Date.now() / 1000).toString(),
  );

  const words = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const characters = text.length;

  const humanReadableDate = useMemo(() => {
    const numeric = Number(timestamp);
    if (Number.isNaN(numeric)) {
      return "-";
    }
    const date = new Date(numeric * 1000);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.toUTCString();
  }, [timestamp]);

  const copyColor = (value: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="space-y-4 rounded-3xl border border-white/10 bg-background/70 p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            {t("tools.paletteTitle")}
          </h2>
          <button
            type="button"
            onClick={() => setPalette(generatePalette())}
            className="rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent hover:text-background"
          >
            {t("common.refresh")}
          </button>
        </header>
        <div className="grid grid-cols-5 gap-3">
          {palette.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => copyColor(color)}
              style={{ backgroundColor: color }}
              className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl text-xs font-semibold uppercase tracking-[0.3em] text-background/80 transition hover:scale-[1.02]"
            >
              {color}
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-white/10 bg-background/70 p-6">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            {t("tools.wordTitle")}
          </h2>
          <p className="text-xs text-muted">{t("tools.wordSubtitle")}</p>
        </header>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-background/60 p-4 text-sm text-white focus:border-accent focus:outline-none"
          placeholder={t("tools.wordPlaceholder")}
        />
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
          <span>{t("tools.wordsLabel", { count: words })}</span>
          <span>{t("tools.charactersLabel", { count: characters })}</span>
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-white/10 bg-background/70 p-6">
        <header className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            {t("tools.timestampTitle")}
          </h2>
          <p className="text-xs text-muted">{t("tools.timestampDescription")}</p>
        </header>
        <input
          value={timestamp}
          onChange={(event) => setTimestamp(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-background/60 p-4 text-sm text-white focus:border-accent focus:outline-none"
          placeholder={t("tools.timestampPlaceholder")}
        />
        <div className="rounded-2xl border border-white/5 bg-background/80 p-4 text-xs text-muted">
          {humanReadableDate}
        </div>
      </section>
    </div>
  );
};
