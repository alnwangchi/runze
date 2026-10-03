import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebase } from "@/lib/firebase";

export type StoryStatus = "draft" | "published";

export type Story = {
  id: string;
  title: string;
  date: string;
  body: string;
  alt: string;
  imageUrl: string;
  imagePath: string;
  status: StoryStatus;
};

export type StoryInput = Omit<Story, "id">;

function requireClient() {
  const client = getFirebase();
  if (!client) throw new Error("尚未設定 Firebase");
  return client;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function mapStory(id: string, data: DocumentData): Story {
  return {
    id,
    title: text(data.title),
    date: text(data.date),
    body: text(data.body),
    alt: text(data.alt),
    imageUrl: text(data.imageUrl),
    imagePath: text(data.imagePath),
    status: data.status === "published" ? "published" : "draft",
  };
}

export function formatStoryDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export async function listPublishedStories() {
  const client = requireClient();
  const stories = collection(client.db, "stories");
  try {
    const snapshot = await getDocs(
      query(stories, where("status", "==", "published"), orderBy("date", "desc"), limit(4)),
    );
    return snapshot.docs.map((item) => mapStory(item.id, item.data()));
  } catch (error) {
    if (!(error instanceof FirebaseError) || error.code !== "failed-precondition") throw error;
    const snapshot = await getDocs(stories);
    return snapshot.docs
      .map((item) => mapStory(item.id, item.data()))
      .filter((story) => story.status === "published")
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4);
  }
}

export async function listStories() {
  const client = requireClient();
  const snapshot = await getDocs(collection(client.db, "stories"));
  return snapshot.docs
    .map((item) => mapStory(item.id, item.data()))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getStory(id: string) {
  const client = requireClient();
  const snapshot = await getDoc(doc(client.db, "stories", id));
  if (!snapshot.exists()) return null;
  return mapStory(snapshot.id, snapshot.data());
}

export async function saveStory(id: string, input: StoryInput, created: boolean) {
  const client = requireClient();
  await setDoc(
    doc(client.db, "stories", id),
    {
      ...input,
      ...(created ? { createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function uploadStoryImage(id: string, file: Blob) {
  const client = requireClient();
  const imagePath = `stories/${id}/cover`;
  const imageRef = ref(client.storage, imagePath);
  await uploadBytes(imageRef, file, { contentType: file.type || "image/jpeg" });
  const imageUrl = await getDownloadURL(imageRef);
  return { imageUrl, imagePath };
}

export async function removeStoredImage(imagePath: string) {
  if (!imagePath) return;
  const client = requireClient();
  await deleteObject(ref(client.storage, imagePath));
}

export async function deleteStory(story: Story) {
  const client = requireClient();
  await deleteDoc(doc(client.db, "stories", story.id));
  if (story.imagePath) {
    await deleteObject(ref(client.storage, story.imagePath)).catch(() => undefined);
  }
}

export function newStoryId() {
  return doc(collection(requireClient().db, "stories")).id;
}
