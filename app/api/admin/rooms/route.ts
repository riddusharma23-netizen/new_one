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
    return ok(
      await paginate({
        request,
        table: "rooms",
        searchColumns: ["name", "room_type", "building"],
        orderBy: "ORDER BY name",
      })
    );
  } catch (err) {
    console.error(err);
    return fail("Unable to load classrooms.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  await prepareTimetable();
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    if (!name) return fail("Room name is required.");
    const result = await execute(
      "INSERT INTO rooms (name, room_type, building, capacity, active) VALUES (?, ?, ?, ?, ?)",
      [
        name,
        asString(body.room_type) || "CLASSROOM",
        asOptionalString(body.building),
        asInteger(body.capacity),
        asString(body.active) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      ]
    );
    await logActivity(session.id, "CREATE", "rooms", result.insertId, `Created classroom ${name}`);
    return ok(await queryOne("SELECT * FROM rooms WHERE id = ?", [result.insertId]), "Classroom created", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create classroom.", 500);
  }
}
