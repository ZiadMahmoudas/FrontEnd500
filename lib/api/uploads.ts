import { API_URL, ApiError, apiFetch, getStoredToken } from "./client";

export type UploadKind = "video" | "pdf" | "image";

export interface CompletedUpload {
  upload_id: string;
  kind: UploadKind;
  name: string;
  stored_name: string;
  mime_type: string;
  size: number;
  url?: string | null;
}

async function parseFailure(response: Response): Promise<never> {
  const payload = await response.json().catch(() => ({}));
  throw new ApiError(payload.message || "تعذر رفع جزء من الملف.", response.status);
}

export async function uploadFileInChunks(
  file: File,
  kind: UploadKind,
  onProgress?: (progress: number, uploadedBytes: number, totalBytes: number) => void,
  signal?: AbortSignal,
): Promise<CompletedUpload> {
  const init = await apiFetch<{ success: true; upload_id: string; chunk_size: number; total_chunks: number }>("/uploads/init", {
    method: "POST",
    body: JSON.stringify({ kind, name: file.name, size: file.size, mime: file.type }),
    signal,
  });

  const token = getStoredToken();
  let uploadedBytes = 0;
  try {
    for (let index = 0; index < init.total_chunks; index += 1) {
      const start = index * init.chunk_size;
      const end = Math.min(file.size, start + init.chunk_size);
      const blob = file.slice(start, end);
      let lastError: unknown;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const response = await fetch(`${API_URL}/uploads/${init.upload_id}/chunk`, {
            method: "PUT",
            body: blob,
            signal,
            headers: {
              "Content-Type": "application/octet-stream",
              "X-Chunk-Index": String(index),
              "X-Chunk-Total": String(init.total_chunks),
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          });
          if (!response.ok) await parseFailure(response);
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          if (signal?.aborted || attempt === 3) throw error;
          await new Promise((resolve) => window.setTimeout(resolve, attempt * 700));
        }
      }
      if (lastError) throw lastError;
      uploadedBytes = end;
      onProgress?.(Math.round((uploadedBytes / file.size) * 100), uploadedBytes, file.size);
    }
    const completed = await apiFetch<{ success: true } & CompletedUpload>(`/uploads/${init.upload_id}/complete`, {
      method: "POST",
      body: JSON.stringify({}),
      signal,
    });
    onProgress?.(100, file.size, file.size);
    return completed;
  } catch (error) {
    apiFetch(`/uploads/${init.upload_id}`, { method: "DELETE" }).catch(() => undefined);
    throw error;
  }
}
