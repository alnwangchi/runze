import { StoryEditor } from "@/components/admin/story-editor";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl">{id === "new" ? "新增成果" : "編輯成果"}</h1>
      <div className="mt-8">
        <StoryEditor storyId={id} />
      </div>
    </main>
  );
}
