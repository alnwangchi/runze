"use client";

import { useEffect, useState } from "react";
import { heroSlides } from "@/content/images";

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const slide = heroSlides[index];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  function go(next: number) {
    const total = heroSlides.length;
    setIndex((next + total) % total);
  }

  return (
    <section id="top" className="relative min-h-svh bg-pine-deep">
      <img
        src={slide.src}
        alt={slide.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-pine-deep/45" />
      <div className="relative flex min-h-svh flex-col justify-end px-6 pb-20 pt-28 md:px-12">
        <div className="max-w-3xl text-paper">
          <p className="text-xs tracking-[0.42em] text-paper/80">RUNZE</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
            財團法人潤澤文化基金會
          </h1>
        </div>
        <div className="mt-8 flex items-center gap-3 text-sm text-paper">
          <button type="button" className="border border-white/40 px-3 py-2" onClick={() => go(index - 1)}>
            上一張
          </button>
          <button type="button" className="border border-white/40 px-3 py-2" onClick={() => go(index + 1)}>
            下一張
          </button>
          {reduceMotion ? (
            <span className="text-paper/70">已配合減少動態</span>
          ) : (
            <button
              type="button"
              className="border border-white/40 px-3 py-2"
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? "播放" : "暫停"}
            </button>
          )}
          <div className="ml-2 flex gap-2" role="tablist" aria-label="輪播圖">
            {heroSlides.map((item, itemIndex) => (
              <button
                key={item.src}
                type="button"
                role="tab"
                aria-selected={itemIndex === index}
                aria-label={item.alt}
                className={`h-2.5 w-2.5 rounded-full ${itemIndex === index ? "bg-paper" : "bg-paper/40"}`}
                onClick={() => setIndex(itemIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
