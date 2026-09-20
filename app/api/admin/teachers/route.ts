import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString } from "@/lib/validation";

type Teacher = Record<string, unknown>;

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);

  try {
    const url = new URL(request.url);
    const extraWhere: string[] = [];
    const extraParams: unknown[] = [];
    const staffType = url.searchParams.get("staff_type");
    if (staffType) {
      extraWhere.push("staff_type = ?");
      extraParams.push(staffType);
    }

    const result = await paginate<Teacher>({
      request,
      table: "teachers",
      searchColumns: ["name", "designation", "department", "subject", "email"],
      extraWhere,
      extraParams,
      orderBy: "ORDER BY display_order ASC, id DESC",
    });
    return ok(result);
  } catch (err) {
    console.error(err);
    return fail("Unable to load teachers.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    const designation = asString(body.designation);
    if (!name || !designation) {
      return fail("Name and designation are required");
    }

    const result = await execute(
      `INSERT INTO teachers
        (name, designation, department, subject, qualification, experience, email, phone, image, bio, staff_type, status, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        designation,
        asOptionalString(body.department),
        asOptionalString(body.subject),
        asOptionalString(body.qualification),
        asOptionalString(body.experience),
        asOptionalString(body.email),
        asOptionalString(body.phone),
        asOptionalString(body.image),
        asOptionalString(body.bio),
        asString(body.staff_type) === "SUPPORT" ? "SUPPORT" : "TEACHER",
        asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        Number(body.display_order) || 0,
      ]
    );

    const created = await queryOne("SELECT * FROM teachers WHERE id = ?", [result.insertId]);
    await logActivity(session.id, "CREATE", "teachers", result.insertId, `Created teacher ${name}`);
    revalidatePublic();
    return ok(created, "Teacher created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create teacher.", 500);
  }
}
