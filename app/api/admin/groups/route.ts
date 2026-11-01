import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { paginate } from "@/lib/list";
import { prepareTimetable } from "@/lib/timetable";
import { asInteger, asOptionalString, asString } from "@/lib/validation";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  await prepareTimetable();
  try {
    const url = new URL(request.url);
    const extraWhere: string[] = [];
    const extraParams: unknown[] = [];
    const classId = asInteger(url.searchParams.get("class_id"));
    if (classId) {
      extraWhere.push("class_groups.class_id = ?");
      extraParams.push(classId);
    }
    const result = await paginate({
      request,
      table: "class_groups",
      columns: "class_groups.*, classes.class_name, CONCAT(classes.class_name, '-', classes.section) AS class_label",
      joins: "JOIN classes ON classes.id = class_groups.class_id",
      extraWhere,
      extraParams,
      searchColumns: ["class_groups.name", "classes.class_name"],
      orderBy: "ORDER BY classes.class_name, class_groups.name",
    });
    return ok(result);
  } catch (err) {
    console.error(err);
    return fail("Unable to load student groups.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  await prepareTimetable();
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    const classId = asInteger(body.class_id);
    if (!name || !classId) return fail("Group name and class are required.");
    const result = await execute(
      "INSERT INTO class_groups (name, class_id, description, active) VALUES (?, ?, ?, ?)",
      [name, classId, asOptionalString(body.description), asString(body.active) === "INACTIVE" ? "INACTIVE" : "ACTIVE"]
    );
    const subjectIds = Array.isArray(body.subject_ids) ? body.subject_ids.map((id) => asInteger(id)).filter((id): id is number => Boolean(id)) : [];
    for (const subjectId of subjectIds) {
      await execute("INSERT IGNORE INTO group_subjects (group_id, subject_id) VALUES (?, ?)", [result.insertId, subjectId]);
    }
    await logActivity(session.id, "CREATE", "groups", result.insertId, `Created student group ${name}`);
    return ok(await queryOne("SELECT * FROM class_groups WHERE id = ?", [result.insertId]), "Student group created", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create student group.", 500);
  }
}
