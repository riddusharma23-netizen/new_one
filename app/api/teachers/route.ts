import { fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim();
    const params: string[] = [];
    const where = ["status = 'ACTIVE'", "staff_type = 'TEACHER'"];

    if (search) {
      where.push("(name LIKE ? OR designation LIKE ? OR department LIKE ? OR subject LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const teachers = await query(
      `SELECT id, name, designation, department, subject, qualification, experience,
              email, phone, image, bio, display_order
       FROM teachers
       WHERE ${where.join(" AND ")}
       ORDER BY display_order ASC, id ASC`,
      params
    );
    return ok(teachers);
  } catch (error) {
    console.error(error);
    return fail("Unable to load teachers.", 500);
  }
}
