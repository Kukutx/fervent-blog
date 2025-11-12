import { ReactNode } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

export const SiteShell = ({ children }: { readonly children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-12 md:py-20">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
