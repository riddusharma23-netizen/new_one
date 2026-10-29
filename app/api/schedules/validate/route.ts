import { fail } from "@/lib/http";

export async function POST() {
  return fail("Timetable conflict validation has been disabled.", 410);
}
