"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { placeholderImages } from "@/content/images";
import { isFirebaseConfigured } from "@/lib/firebase";
import { resizeImage } from "@/lib/resize-image";
import {
  getStory,
  newStoryId,
  removeStoredImage,
  saveStory,
  uploadStoryImage,
  type StoryStatus,
} from "@/lib/stories";

type EditorProps = { storyId: string };

export function StoryEditor({ storyId }: EditorProps) {
  const router = useRouter();
  const isNew = storyId === "new";
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");
  const [alt, setAlt] = useState("");
  const [status, setStatus] = useState<StoryStatus>("draft");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [placeholder, setPlaceholder] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured || isNew) return;
    getStory(storyId)
      .then((story) => {
        if (!story) {
          setMessage("找不到這筆成果");
          return;
        }
        setTitle(story.title);
        setDate(story.date);
        setBody(story.body);
        setAlt(story.alt);
        setStatus(story.status);
        setImageUrl(story.imageUrl);
        setImagePath(story.imagePath);
      })
      .catch(() => setMessage("讀取失敗"));
  }, [configured, isNew, storyId]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const timer = window.setTimeout(() => setPreview(url), 0);
    return () => {
      window.clearTimeout(timer);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !date || !body.trim() || !alt.trim()) {
      setMessage("標題、日期、內文與替代文字都要填");
      return;
    }
    if (!file && !placeholder && !imageUrl) {
      setMessage("請上傳圖片或選擇一張暫代圖");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const id = isNew ? newStoryId() : storyId;
      let nextUrl = placeholder || imageUrl;
      let nextPath = placeholder ? "" : imagePath;
      if (file) {
        const blob = await resizeImage(file);
        const uploaded = await uploadStoryImage(id, blob);
        nextUrl = uploaded.imageUrl;
        nextPath = uploaded.imagePath;
      } else if (placeholder && imagePath) {
        await removeStoredImage(imagePath);
        nextPath = "";
      }
      await saveStory(
        id,
        {
          title: title.trim(),
          date,
          body: body.trim(),
          alt: alt.trim(),
          imageUrl: nextUrl,
          imagePath: nextPath,
          status,
        },
        isNew,
      );
      router.push("/admin/stories");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "儲存失敗");
      setSaving(false);
    }
  }

  if (!configured) {
    return <p className="text-sm text-muted">尚未設定 Firebase。請依 .env.example 建立 .env.local。</p>;
  }

  const previewUrl = file ? preview : placeholder || imageUrl;

  return (
    <form className="max-w-2xl space-y-5" onSubmit={onSubmit}>
      <label className="block text-sm">
        標題
        <input className="mt-2 w-full border border-line bg-paper px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="block text-sm">
        日期
        <input type="date" className="mt-2 border border-line bg-paper px-3 py-2" value={date} onChange={(event) => setDate(event.target.value)} />
      </label>
      <label className="block text-sm">
        內文
        <textarea className="mt-2 min-h-40 w-full border border-line bg-paper px-3 py-2" value={body} onChange={(event) => setBody(event.target.value)} />
      </label>
      <label className="block text-sm">
        替代文字
        <input className="mt-2 w-full border border-line bg-paper px-3 py-2" value={alt} onChange={(event) => setAlt(event.target.value)} />
      </label>
      <label className="block text-sm">
        狀態
        <select
          className="mt-2 border border-line bg-paper px-3 py-2"
          value={status}
          onChange={(event) => setStatus(event.target.value as StoryStatus)}
        >
          <option value="draft">草稿</option>
          <option value="published">已上架</option>
        </select>
      </label>
      <label className="block text-sm">
        上傳封面
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block text-sm"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setPlaceholder("");
          }}
        />
      </label>
      <div>
        <p className="text-sm">或使用暫代圖</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {placeholderImages.map((image) => (
            <button
              key={image.src}
              type="button"
              className={`border ${placeholder === image.src ? "border-pine" : "border-line"}`}
              onClick={() => {
                setPlaceholder(image.src);
                setAlt(image.alt);
                setFile(null);
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={480}
                height={300}
                className="aspect-[16/10] h-auto w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt={alt || "封面預覽"}
          width={1200}
          height={750}
          unoptimized
          className="aspect-[16/10] h-auto w-full object-cover"
        />
      ) : null}
      <button type="submit" disabled={saving} className="bg-pine px-4 py-2 text-sm text-paper disabled:opacity-60">
        {saving ? "儲存中" : "儲存"}
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}
