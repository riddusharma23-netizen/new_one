import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { saveImageFile } from "@/lib/uploads";

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return fail("Please choose an image file");
    }

    const saved = await saveImageFile(file);
    if (saved.error || !saved.url) {
      return fail(saved.error ?? "Upload failed");
    }

    await logActivity(session.id, "UPLOAD", "files", null, `Uploaded ${saved.url}`);
    return ok({ url: saved.url }, "Image uploaded successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to upload image.", 500);
  }
}
