import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_BYTES = 5 * 1024 * 1024;

export async function saveImageFile(file: File) {
  if (!file || file.size === 0) {
    return { error: "Please choose an image file" as const, url: null };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image must be 5MB or smaller" as const, url: null };
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    return { error: "Only JPG, PNG, WEBP and GIF images are allowed" as const, url: null };
  }

  const original = file.name.toLowerCase();
  if (!/\.(jpe?g|png|webp|gif)$/.test(original)) {
    return { error: "Invalid image file name" as const, url: null };
  }

  const fileName = `${Date.now()}-${randomBytes(6).toString("hex")}${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory, fileName), buffer);

  return { error: null, url: `/uploads/${fileName}` as const };
}
