"use client";

import { useState } from "react";

const links = [
  { href: "#about", label: "關於潤澤" },
  { href: "#works", label: "成果實紀" },
  { href: "#footer", label: "基本資訊" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-pine-deep/90 text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="font-serif text-lg tracking-wide">
          財團法人潤澤文化基金會
        </a>
        <button
          type="button"
          className="text-sm md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "關閉" : "選單"}
        </button>
        <nav
          id="site-nav"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-4 border-b border-white/15 bg-pine-deep px-6 py-5 text-sm md:static md:flex md:flex-row md:gap-6 md:border-0 md:bg-transparent md:p-0`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
