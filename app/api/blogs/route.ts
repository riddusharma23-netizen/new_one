import { fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const blogs = await query(
      `SELECT id, title, slug, excerpt, content, featured_image, author, category, published_at
       FROM blogs
       WHERE status = 'PUBLISHED' AND (published_at IS NULL OR published_at <= NOW())
       ORDER BY COALESCE(published_at, created_at) DESC`
    );
    return ok(blogs);
  } catch (error) {
    console.error(error);
    return fail("Unable to load blogs.", 500);
  }
}
