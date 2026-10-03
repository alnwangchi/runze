import { StoryList } from "@/components/admin/story-list";

export default function AdminStoriesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl">成果實紀</h1>
      <p className="mt-3 mb-8 text-sm text-muted">首頁只顯示已上架、日期最新的四筆。日期由這裡決定。</p>
      <StoryList />
    </main>
  );
}
