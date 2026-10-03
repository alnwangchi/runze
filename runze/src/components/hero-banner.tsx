import { heroSlides } from "@/content/images";

export function HeroBanner() {
  const slide = heroSlides[0];

  return (
    <section id="top" className="relative min-h-svh bg-pine-deep">
      <img
        src={slide.src}
        alt={slide.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-pine-deep/45" />
      <div className="relative flex min-h-svh items-end px-6 pb-20 pt-28 md:px-12">
        <div className="max-w-3xl text-paper">
          <p className="text-xs tracking-[0.42em] text-paper/80">RUNZE</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
            財團法人潤澤文化基金會
          </h1>
        </div>
      </div>
    </section>
  );
}
