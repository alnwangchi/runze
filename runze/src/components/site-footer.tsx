import { heroSlides, placeholderImages } from "@/content/images";

export function SiteFooter() {
  const credits = [...heroSlides, ...placeholderImages];

  return (
    <footer id="footer" className="scroll-mt-24 bg-pine-deep px-6 py-16 text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-2xl">財團法人潤澤文化基金會</p>
          <dl className="mt-6 space-y-2 text-sm text-paper/80">
            <div>地址尚未填寫</div>
            <div>電話尚未填寫</div>
            <div>登記字號尚未填寫</div>
          </dl>
        </div>
        <div>
          <p className="text-xs tracking-[0.28em] text-paper/60">IMAGE CREDITS</p>
          <ul className="mt-4 space-y-2 text-sm text-paper/75">
            {credits.map((image) => (
              <li key={image.src}>
                {image.alt}／{image.credit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
