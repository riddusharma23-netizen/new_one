import { cookies } from "next/headers";
import { fail, ok } from "@/lib/http";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  findAdminByEmail,
  logActivity,
  touchLastLogin,
  verifyPassword,
} from "@/lib/auth";
import { asString, isEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!isEmail(email) || !password) {
      return fail("Invalid email or password", 401);
    }

    const admin = await findAdminByEmail(email);
    if (!admin || admin.status !== "ACTIVE") {
      return fail("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) {
      return fail("Invalid email or password", 401);
    }

    const token = createSessionToken(admin);
    const store = await cookies();
    store.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    await touchLastLogin(admin.id);
    await logActivity(admin.id, "LOGIN", "auth", admin.id, "Admin signed in");

    return ok(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      "Logged in successfully"
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error && /DB_HOST|DB_USER|DB_NAME|AUTH_SECRET/.test(error.message)) {
      return fail("Server configuration is incomplete. Check the environment variables and restart the server.", 503);
    }
    if (error && typeof error === "object" && "code" in error) {
      return fail("The database is unavailable. Start MySQL and verify the database settings.", 503);
    }
    return fail("Unable to sign in. Please try again.", 500);
  }
}
