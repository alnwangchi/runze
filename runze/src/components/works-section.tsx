import { placeholderImages } from "@/content/images";

export function WorksSection() {
  return (
    <section id="works" className="scroll-mt-24 border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs tracking-[0.35em] text-bronze">WORKS</p>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl">成果實紀</h2>
        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {placeholderImages.map((image) => (
            <article key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-[16/10] w-full object-cover"
              />
              <p className="mt-4 text-sm tracking-wide text-bronze">{image.credit}</p>
              <h3 className="mt-2 font-serif text-2xl leading-snug">{image.alt}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
