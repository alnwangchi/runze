"use client";

import { useEffect, useState, type FormEvent } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { defaultProfile, getProfile, saveProfile, type SiteProfile } from "@/lib/profile";

const fields: Array<{ key: keyof SiteProfile; label: string; multiline?: boolean }> = [
  { key: "aboutTitle", label: "關於標題" },
  { key: "aboutBody", label: "關於內文", multiline: true },
  { key: "address", label: "地址" },
  { key: "phone", label: "電話" },
  { key: "registration", label: "登記字號" },
];

export function ProfileForm() {
  const [profile, setProfile] = useState<SiteProfile>(defaultProfile);
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
    return (
      <div className="max-w-2xl space-y-5">
        <p className="text-sm text-muted">
          尚未設定 Firebase。首頁目前顯示這份定稿。連線後可在此修改並儲存，之後以資料庫內容為準。
        </p>
        <AboutFields profile={profile} disabled onChange={setProfile} />
      </div>
    );
  }

  return (
    <form className="max-w-2xl space-y-5" onSubmit={onSubmit}>
      <AboutFields profile={profile} onChange={setProfile} />
      <button type="submit" disabled={saving} className="bg-pine px-4 py-2 text-sm text-paper disabled:opacity-60">
        {saving ? "儲存中" : "儲存"}
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}

function AboutFields({
  profile,
  disabled,
  onChange,
}: {
  profile: SiteProfile;
  disabled?: boolean;
  onChange: (profile: SiteProfile) => void;
}) {
  return (
    <>
      {fields.map((field) => (
        <label key={field.key} className="block text-sm">
          {field.label}
          {field.multiline ? (
            <textarea
              disabled={disabled}
              className="mt-2 min-h-48 w-full border border-line bg-paper px-3 py-2 disabled:opacity-70"
              value={profile[field.key]}
              onChange={(event) => onChange({ ...profile, [field.key]: event.target.value })}
            />
          ) : (
            <input
              disabled={disabled}
              className="mt-2 w-full border border-line bg-paper px-3 py-2 disabled:opacity-70"
              value={profile[field.key]}
              onChange={(event) => onChange({ ...profile, [field.key]: event.target.value })}
            />
          )}
        </label>
      ))}
    </>
  );
}
