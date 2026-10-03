const maxEdge = 1600;
const maxBytes = 1024 * 1024;
const accepted = ["image/jpeg", "image/png", "image/webp"];

type CompressRequest = { file: File };
type CompressResponse = { ok: true; blob: Blob } | { ok: false; message: string };

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<CompressRequest>) => void) | null;
  postMessage: (message: CompressResponse) => void;
};

scope.onmessage = async (event) => {
  const { file } = event.data;
  if (!accepted.includes(file.type)) {
    scope.postMessage({ ok: false, message: "只接受 JPEG、PNG 或 WebP" });
    return;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("無法處理圖片");
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.82 });
    if (blob.size > maxBytes) {
      blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.62 });
    }
    if (blob.size > maxBytes) {
      scope.postMessage({ ok: false, message: "圖片壓縮後仍超過 1MB，請換一張較小的圖" });
      return;
    }
    scope.postMessage({ ok: true, blob });
  } catch {
    scope.postMessage({ ok: false, message: "無法壓縮圖片" });
  }
};
