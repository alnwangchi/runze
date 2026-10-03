"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { placeholderImages } from "@/content/images";
import { isFirebaseConfigured } from "@/lib/firebase";
import { formatStoryDate, listPublishedStories, type Story } from "@/lib/stories";

export function WorksSection() {
  const configured = isFirebaseConfigured();
  const [stories, setStories] = useState<Story[]>([]);
  const [message, setMessage] = useState(configured ? "載入中" : "尚無已上架的成果。");

  useEffect(() => {
    if (!configured) return;
    let ignore = false;
    listPublishedStories()
      .then((next) => {
        if (ignore) return;
        setStories(next);
        setMessage(next.length ? "" : "尚無已上架的成果。");
      })
      .catch(() => {
        if (!ignore) setMessage("成果暫時無法讀取。");
      });
    return () => {
      ignore = true;
    };
  }, [configured]);

  return (
    <section id="works" className="scroll-mt-24 border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs tracking-[0.35em] text-bronze">WORKS</p>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl">成果實紀</h2>
        {message ? <p className="mt-8 text-lg text-muted">{message}</p> : null}
        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {stories.map((story) => (
            <article key={story.id}>
              {story.imageUrl ? (
                <div className="relative mb-4 aspect-[16/10]">
                  <Image
                    src={story.imageUrl}
                    alt={story.alt || story.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <p className="mt-4 text-sm tracking-wide text-bronze">{formatStoryDate(story.date)}</p>
              <h3 className="mt-2 font-serif text-2xl leading-snug">{story.title}</h3>
              <p className="mt-4 leading-8 whitespace-pre-line text-muted">{story.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function creditsForStories(stories: Story[]) {
  const used = new Set(stories.map((story) => story.imageUrl));
  return placeholderImages.filter((image) => used.has(image.src));
}
