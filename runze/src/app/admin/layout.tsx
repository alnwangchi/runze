import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminGate } from "@/components/admin/admin-gate";

export const metadata: Metadata = {
  title: "後台｜財團法人潤澤文化基金會",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
