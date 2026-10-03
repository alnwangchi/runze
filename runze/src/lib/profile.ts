import { doc, getDoc, setDoc } from "firebase/firestore";
import { defaultAboutBody, defaultAboutTitle } from "@/content/about";
import { getFirebase, isFirebaseConfigured } from "@/lib/firebase";

export type SiteProfile = {
  aboutTitle: string;
  aboutBody: string;
  address: string;
  phone: string;
  registration: string;
};

export const emptyProfile: SiteProfile = {
  aboutTitle: "",
  aboutBody: "",
  address: "",
  phone: "",
  registration: "",
};

export const defaultProfile: SiteProfile = {
  ...emptyProfile,
  aboutTitle: defaultAboutTitle,
  aboutBody: defaultAboutBody,
};

function profileDoc() {
  const client = getFirebase();
  if (!client) throw new Error("尚未設定 Firebase");
  return doc(client.db, "site", "profile");
}

function readField(data: Record<string, unknown>, key: keyof SiteProfile) {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

export async function getProfile(): Promise<SiteProfile> {
  if (!isFirebaseConfigured()) return defaultProfile;
  const snapshot = await getDoc(profileDoc());
  if (!snapshot.exists()) return defaultProfile;
  const data = snapshot.data() as Record<string, unknown>;
  return {
    aboutTitle: readField(data, "aboutTitle"),
    aboutBody: readField(data, "aboutBody"),
    address: readField(data, "address"),
    phone: readField(data, "phone"),
    registration: readField(data, "registration"),
  };
}

export async function saveProfile(profile: SiteProfile) {
  await setDoc(profileDoc(), profile);
}
