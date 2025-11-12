"use client";

import { useEffect, useState } from "react";

/**
 * Live2D 看板娘组件
 * 
 * 使用说明：
 * 1. 下载 Live2D 模型文件到 public/live2d/ 目录
 * 2. 安装 live2d-widget 库：npm install live2d-widget
 * 3. 在本组件中集成 Live2D 加载逻辑
 * 
 * 推荐模型来源：
 * - https://github.com/xiazeyu/live2d-widget-models
 * - https://github.com/Eikanya/Live2d-model
 */

export const Live2D = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // TODO: 集成 Live2D 加载逻辑
    // 示例代码（需要安装相关库）：
    // import loadlive2d from 'live2d-widget';
    // loadlive2d("live2d", "/live2d/model.json");
    
    console.log("Live2D component mounted - Please configure Live2D models");
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 z-40">
      {/* Live2D 容器 */}
      <div id="live2d" className="h-[300px] w-[300px]">
        {/* 占位内容 - 配置完成后会被 Live2D 模型替换 */}
        <div className="flex h-full w-full items-center justify-center rounded-tl-3xl border-l border-t border-white/10 bg-background/80 p-4 backdrop-blur">
          <div className="text-center text-sm text-muted">
            <div className="mb-2 text-4xl">🐱</div>
            <p>Live2D 看板娘</p>
            <p className="mt-2 text-xs">请配置模型文件</p>
            <button
              onClick={() => setIsVisible(false)}
              className="mt-4 rounded-lg bg-white/5 px-3 py-1 text-xs transition hover:bg-accent/10 hover:text-accent"
            >
              隐藏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

