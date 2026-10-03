export default function AdminHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl">後台</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        關於潤澤與成果實紀會寫進 Firebase。輪播圖仍放在專案裡。
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href="/admin/profile" className="border border-line bg-paper p-6">
          <p className="font-serif text-2xl">關於與頁尾</p>
          <p className="mt-2 text-sm text-muted">標題、介紹、地址、電話、登記字號</p>
        </a>
        <a href="/admin/stories" className="border border-line bg-paper p-6">
          <p className="font-serif text-2xl">成果實紀</p>
          <p className="mt-2 text-sm text-muted">新增、編輯、上架或改回草稿</p>
        </a>
      </div>
    </main>
  );
}
