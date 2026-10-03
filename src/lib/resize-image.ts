const maxEdge = 1600;
const maxBytes = 1024 * 1024;

export async function resizeImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("只接受 JPEG、PNG 或 WebP");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("無法處理圖片");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await exportJpeg(canvas, 0.82);
  if (blob.size <= maxBytes) return blob;
  const smaller = await exportJpeg(canvas, 0.62);
  if (smaller.size <= maxBytes) return smaller;
  throw new Error("圖片壓縮後仍超過 1MB，請換一張較小的圖");
}

function exportJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("無法壓縮圖片"))),
      "image/jpeg",
      quality,
    );
  });
}

type WorkerResponse = { ok: true; blob: Blob } | { ok: false; message: string };

export function startImagePreparation(file: File) {
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") {
    return resizeImage(file);
  }

  return new Promise<Blob>((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL("./compress-image.worker.ts", import.meta.url));
    } catch {
      resizeImage(file).then(resolve, reject);
      return;
    }

    const finish = () => worker.terminate();
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      finish();
      if (event.data.ok) resolve(event.data.blob);
      else reject(new Error(event.data.message));
    };
    worker.onerror = () => {
      finish();
      resizeImage(file).then(resolve, reject);
    };
    worker.postMessage({ file });
  });
}
