"use client";

import { ReactNode, useState } from "react";

import { Footer } from "./footer";
import { Header } from "./header";
import { DynamicLines } from "../effects/dynamic-lines";
import { Snowflakes } from "../effects/snowflakes";
import { Live2D } from "../effects/live2d";

export const SiteShell = ({ children }: { readonly children: ReactNode }) => {
  // 特效开关（可以从localStorage读取用户偏好）
  const [effectsEnabled, setEffectsEnabled] = useState({
    dynamicLines: true,
    snowflakes: false, // 默认关闭雪花，可以根据季节或用户偏好开启
    live2d: false, // 默认关闭Live2D，配置完模型后可开启
  });

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* 背景特效 */}
      {effectsEnabled.dynamicLines && <DynamicLines />}
      {effectsEnabled.snowflakes && <Snowflakes />}
      {effectsEnabled.live2d && <Live2D />}

      {/* 主要内容 */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl space-y-16 px-6 py-12 md:py-20">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
