import { ProfileForm } from "@/components/admin/profile-form";

export default function AdminProfilePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl">關於與頁尾</h1>
      <p className="mt-3 mb-8 text-sm text-muted">內文保留換行。頁尾沒有電子郵件欄位。</p>
      <ProfileForm />
    </main>
  );
}
