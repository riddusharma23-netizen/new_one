import { fail, ok } from "@/lib/http";
import { countTable, requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);

  try {
    const todayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = todayNames[new Date().getDay()];

    const [
      students,
      teachers,
      classes,
      subjects,
      gallery,
      blogs,
      upcomingEvents,
      todaySchedule,
      recentActivity,
    ] = await Promise.all([
      countTable("students", "status = 'ACTIVE'"),
      countTable("teachers", "status = 'ACTIVE' AND staff_type = 'TEACHER'"),
      countTable("classes", "status = 'ACTIVE'"),
      countTable("subjects", "status = 'ACTIVE'"),
      countTable("gallery", "status = 'PUBLISHED'"),
      countTable("blogs", "status = 'PUBLISHED'"),
      query(
        `SELECT id, title, event_date, location
         FROM events
         WHERE status = 'PUBLISHED' AND event_date >= CURDATE()
         ORDER BY event_date ASC
         LIMIT 5`
      ),
      query(
        `SELECT s.id, s.period_number, s.start_time, s.end_time, s.room,
                t.name AS teacher_name, sub.subject_name,
                CONCAT(c.class_name, '-', c.section) AS class_label
         FROM schedules s
         JOIN teachers t ON t.id = s.teacher_id
         JOIN subjects sub ON sub.id = s.subject_id
         JOIN classes c ON c.id = s.class_id
         WHERE s.status = 'ACTIVE' AND s.day_of_week = ?
         ORDER BY s.period_number ASC
         LIMIT 12`,
        [today]
      ),
      query(
        `SELECT id, action, entity, message, created_at
         FROM activity_logs
         ORDER BY created_at DESC
         LIMIT 8`
      ),
    ]);

    return ok({
      totals: { students, teachers, classes, subjects, gallery, blogs },
      upcomingEvents,
      todaySchedule,
      recentActivity,
      today,
    });
  } catch (err) {
    console.error(err);
    return fail("Unable to load dashboard.", 500);
  }
}
