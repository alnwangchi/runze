"use client";

import { useEffect, useState } from "react";
import { heroSlides, type LicensedImage } from "@/content/images";
import { isFirebaseConfigured } from "@/lib/firebase";
import { emptyProfile, getProfile, type SiteProfile } from "@/lib/profile";
import { listPublishedStories } from "@/lib/stories";
import { creditsForStories } from "@/components/works-section";

export function SiteFooter() {
  const [profile, setProfile] = useState<SiteProfile>(emptyProfile);
  const [credits, setCredits] = useState<LicensedImage[]>(heroSlides);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    getProfile()
      .then(setProfile)
      .catch(() => setProfile(emptyProfile));
    listPublishedStories()
      .then((stories) => setCredits([...heroSlides, ...creditsForStories(stories)]))
      .catch(() => setCredits(heroSlides));
  }, []);

  const rows = [
    profile.address.trim() || "地址尚未填寫",
    profile.phone.trim() || "電話尚未填寫",
    profile.registration.trim() || "登記字號尚未填寫",
  ];

  return (
    <footer id="footer" className="scroll-mt-24 bg-pine-deep px-6 py-16 text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-2xl">財團法人潤澤文化基金會</p>
          <ul className="mt-6 space-y-2 text-sm text-paper/80">
            {rows.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
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
