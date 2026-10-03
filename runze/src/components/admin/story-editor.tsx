"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { placeholderImages } from "@/content/images";
import { isFirebaseConfigured } from "@/lib/firebase";
import { startImagePreparation } from "@/lib/resize-image";
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
  const [compressing, setCompressing] = useState(false);
  const [preparedBytes, setPreparedBytes] = useState<number | null>(null);
  const prepared = useRef<Promise<Blob> | null>(null);
  const prepareId = useRef(0);
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

  function selectCover(next: File | null) {
    const id = prepareId.current + 1;
    prepareId.current = id;
    setFile(next);
    setPlaceholder("");
    setPreparedBytes(null);
    prepared.current = null;
    if (!next) {
      setCompressing(false);
      return;
    }

    setCompressing(true);
    setMessage("");
    const task = startImagePreparation(next);
    prepared.current = task;
    task
      .then((blob) => {
        if (prepareId.current !== id) return;
        setPreparedBytes(blob.size);
        setCompressing(false);
      })
      .catch((error) => {
        if (prepareId.current !== id) return;
        prepared.current = null;
        setCompressing(false);
        setMessage(error instanceof Error ? error.message : "無法壓縮圖片");
      });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !date || !body.trim() || (!isNew && !alt.trim())) {
      setMessage(isNew ? "標題、日期與內文都要填" : "標題、日期、內文與替代文字都要填");
      return;
    }
    if (!isNew && !file && !placeholder && !imageUrl) {
      setMessage("請上傳圖片或選擇一張暫代圖");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const id = isNew ? newStoryId() : storyId;
      let nextUrl = isNew ? "" : placeholder || imageUrl;
      let nextPath = isNew || placeholder ? "" : imagePath;
      if (!isNew && file) {
        const blob = await (prepared.current ?? startImagePreparation(file));
        const uploaded = await uploadStoryImage(id, blob);
        nextUrl = uploaded.imageUrl;
        nextPath = uploaded.imagePath;
      } else if (!isNew && placeholder && imagePath) {
        await removeStoredImage(imagePath);
        nextPath = "";
      }
      await saveStory(
        id,
        {
          title: title.trim(),
          date,
          body: body.trim(),
          alt: isNew ? title.trim() : alt.trim(),
          imageUrl: nextUrl,
          imagePath: nextPath,
          status: isNew ? "published" : status,
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
      {isNew ? null : (
        <>
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
          onChange={(event) => selectCover(event.target.files?.[0] ?? null)}
        />
        {compressing ? <p className="mt-2 text-sm text-muted">正在背景壓縮並轉成 JPEG，完成後才會上傳。</p> : null}
        {preparedBytes != null ? (
          <p className="mt-2 text-sm text-muted">已壓成約 {Math.max(1, Math.round(preparedBytes / 1024))} KB，按下儲存才會上傳。</p>
        ) : null}
      </label>
      <div>
        <p className="text-sm">或使用暫代圖</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {placeholderImages.map((image) => (
            <button
              key={image.src}
              type="button"
              className={`overflow-hidden border ${placeholder === image.src ? "border-pine" : "border-line"}`}
              onClick={() => {
                setPlaceholder(image.src);
                setAlt(image.alt);
                setFile(null);
                prepared.current = null;
                setCompressing(false);
                setPreparedBytes(null);
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
        </>
      )}
      <button type="submit" disabled={saving} className="bg-pine px-4 py-2 text-sm text-paper disabled:opacity-60">
        {saving ? "儲存中" : "儲存"}
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}
