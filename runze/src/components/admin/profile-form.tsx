"use client";

import { useEffect, useState, type FormEvent } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { emptyProfile, getProfile, saveProfile, type SiteProfile } from "@/lib/profile";

const fields: Array<{ key: keyof SiteProfile; label: string; multiline?: boolean }> = [
  { key: "aboutTitle", label: "關於標題" },
  { key: "aboutBody", label: "關於內文", multiline: true },
  { key: "address", label: "地址" },
  { key: "phone", label: "電話" },
  { key: "registration", label: "登記字號" },
];

export function ProfileForm() {
  const [profile, setProfile] = useState<SiteProfile>(emptyProfile);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) return;
    getProfile()
      .then(setProfile)
      .catch(() => setMessage("讀取失敗，請確認 Firebase 規則與網域。"));
  }, [configured]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await saveProfile(profile);
      setMessage("已儲存");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  if (!configured) {
    return <p className="text-sm text-muted">尚未設定 Firebase。請依 .env.example 建立 .env.local。</p>;
  }

  return (
    <form className="max-w-2xl space-y-5" onSubmit={onSubmit}>
      {fields.map((field) => (
        <label key={field.key} className="block text-sm">
          {field.label}
          {field.multiline ? (
            <textarea
              className="mt-2 min-h-48 w-full border border-line bg-paper px-3 py-2"
              value={profile[field.key]}
              onChange={(event) =>
                setProfile((current) => ({ ...current, [field.key]: event.target.value }))
              }
            />
          ) : (
            <input
              className="mt-2 w-full border border-line bg-paper px-3 py-2"
              value={profile[field.key]}
              onChange={(event) =>
                setProfile((current) => ({ ...current, [field.key]: event.target.value }))
              }
            />
          )}
        </label>
      ))}
      <button type="submit" disabled={saving} className="bg-pine px-4 py-2 text-sm text-paper disabled:opacity-60">
        {saving ? "儲存中" : "儲存"}
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}
