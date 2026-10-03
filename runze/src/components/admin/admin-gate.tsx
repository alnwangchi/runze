"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  endAdminSession,
  isAdminSession,
  startAdminSession,
  subscribeAdminSession,
} from "@/lib/admin-session";

export function AdminGate({ children }: { children: ReactNode }) {
  const authed = useSyncExternalStore(subscribeAdminSession, isAdminSession, () => false);
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      startAdminSession();
      setError("");
      setPassword("");
      return;
    }
    setError("帳號或密碼不正確");
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-6">
        <p className="text-xs tracking-[0.28em] text-bronze">ADMIN</p>
        <h1 className="mt-3 font-serif text-3xl">後台登入</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          這組帳密只存在這個畫面，重新開啟分頁後要再登入一次。
        </p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            帳號
            <input
              className="mt-2 w-full border border-line bg-paper px-3 py-2"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="block text-sm">
            密碼
            <input
              type="password"
              className="mt-2 w-full border border-line bg-paper px-3 py-2"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-bronze">{error}</p> : null}
          <button type="submit" className="bg-pine px-4 py-2 text-sm text-paper">
            登入
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-svh">
      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-sm">
          <div className="flex items-center gap-4">
            {pathname !== "/admin" ? (
              <Link href={pathname.startsWith("/admin/stories/") ? "/admin/stories" : "/admin"}>返回</Link>
            ) : null}
            <Link href="/admin" className="font-serif text-lg">
              潤澤後台
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/">回網站</Link>
            <button
              type="button"
              onClick={() => {
                endAdminSession();
              }}
            >
              登出
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
