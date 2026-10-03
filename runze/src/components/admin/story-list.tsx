"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { deleteStory, formatStoryDate, listStories, type Story } from "@/lib/stories";

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [message, setMessage] = useState("");
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) return;
    listStories()
      .then(setStories)
      .catch(() => setMessage("讀取失敗，請確認 Firebase 規則與網域。"));
  }, [configured]);

  async function onDelete(story: Story) {
    if (!window.confirm(`刪除「${story.title}」？`)) return;
    try {
      await deleteStory(story);
      setStories((current) => current.filter((item) => item.id !== story.id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "刪除失敗");
    }
  }

  if (!configured) {
    return <p className="text-sm text-muted">尚未設定 Firebase。請依 .env.example 建立 .env.local。</p>;
  }

  return (
    <div>
      <Link href="/admin/stories/new" className="inline-block bg-pine px-4 py-2 text-sm text-paper">
        新增成果
      </Link>
      {message ? <p className="mt-4 text-sm text-bronze">{message}</p> : null}
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {stories.map((story) => (
          <li key={story.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="font-serif text-xl">{story.title}</p>
              <p className="mt-1 text-sm text-muted">
                {formatStoryDate(story.date)} · {story.status === "published" ? "已上架" : "草稿"}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href={`/admin/stories/${story.id}`}>編輯</Link>
              <button type="button" onClick={() => onDelete(story)}>
                刪除
              </button>
            </div>
          </li>
        ))}
      </ul>
      {stories.length === 0 && !message ? <p className="mt-6 text-sm text-muted">還沒有成果。</p> : null}
    </div>
  );
}
