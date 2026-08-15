import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Persists a base64 data: URL to the local filesystem under
 * public/uploads/<leagueId>/ and returns its public path.
 *
 * NOTE: local filesystem storage is fine for this MVP/dev environment, but
 * ephemeral on most serverless hosts. Swap for S3/Supabase Storage before
 * a production launch — see PROJECT_NOTES.md.
 */
export async function saveDataUrlImage(
  dataUrl: string,
  leagueId: string,
): Promise<string | null> {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const [, mime, base64] = match;
  const ext = MIME_EXT[mime.toLowerCase()];
  if (!ext) return null;

  const dir = path.join(UPLOAD_ROOT, leagueId);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(base64, "base64");
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${leagueId}/${filename}`;
}
