const links = [
  { href: "#about", label: "關於潤澤" },
  { href: "#works", label: "成果實紀" },
  { href: "#footer", label: "基本資訊" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-pine-deep/90 text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="font-serif text-lg tracking-wide">
          財團法人潤澤文化基金會
        </a>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
