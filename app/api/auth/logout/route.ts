import { cookies } from "next/headers";
import { fail, ok } from "@/lib/http";
import { SESSION_COOKIE, getSession, logActivity } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();
    const store = await cookies();
    store.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    if (session) {
      await logActivity(session.id, "LOGOUT", "auth", session.id, "Admin signed out");
    }

    return ok(null, "Logged out successfully");
  } catch (error) {
    console.error(error);
    return fail("Unable to sign out.", 500);
  }
}
