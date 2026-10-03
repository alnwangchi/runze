"use client";

import { useEffect, useState } from "react";
import { emptyProfile, getProfile, type SiteProfile } from "@/lib/profile";
import { isFirebaseConfigured } from "@/lib/firebase";

export function AboutSection() {
  const configured = isFirebaseConfigured();
  const [profile, setProfile] = useState<SiteProfile>(emptyProfile);
  const [message, setMessage] = useState(configured ? "載入中" : "介紹尚未填寫。");

  useEffect(() => {
    if (!configured) return;
    let ignore = false;
    getProfile()
      .then((next) => {
        if (ignore) return;
        setProfile(next);
        setMessage(next.aboutBody.trim() ? "" : "介紹尚未填寫。");
      })
      .catch(() => {
        if (!ignore) setMessage("介紹暫時無法讀取。");
      });
    return () => {
      ignore = true;
    };
  }, [configured]);

  const title = profile.aboutTitle.trim() || "關於潤澤";

  return (
    <section id="about" className="scroll-mt-24 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.35em] text-bronze">ABOUT</p>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl">{title}</h2>
        {message ? (
          <p className="mt-8 text-lg leading-9 text-muted">{message}</p>
        ) : (
          <div className="mt-8 space-y-6 text-lg leading-9 whitespace-pre-line">
            {profile.aboutBody}
          </div>
        )}
      </div>
    </section>
  );
}
