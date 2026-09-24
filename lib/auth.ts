import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { queryOne, execute } from "@/lib/db";

function scryptAsync(password: string, salt: Buffer, keyLength: number, options: { N: number; r: number; p: number }) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey as Buffer);
    });
  });
}

export const SESSION_COOKIE = "cdic_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "ACCOUNTANT";

export type SessionPayload = {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  exp: number;
};

export type AdminRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: AdminRole;
  status: "ACTIVE" | "INACTIVE";
};

function secret() {
  return process.env.AUTH_SECRET || "";
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const key = await scryptAsync(password, salt, 64, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return bcrypt.compare(password, stored);
  }

  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4], "hex");
  const expected = Buffer.from(parts[5], "hex");
  const actual = (await scryptAsync(password, salt, expected.length, { N, r, p })) as Buffer;

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

function encodeSession(payload: SessionPayload) {
  const key = secret();
  if (!key) {
    throw new Error("Missing required environment variable: AUTH_SECRET");
  }
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", key).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function decodeSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const key = secret();
  if (!key) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", key).update(body).digest("base64url");
  const given = Buffer.from(signature);
  const good = Buffer.from(expected);
  if (given.length !== good.length || !timingSafeEqual(given, good)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload?.id || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(admin: Pick<AdminRow, "id" | "email" | "name" | "role">) {
  return encodeSession({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
}

export function getSessionFromRequest(request: NextRequest) {
  return decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function getSession() {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { session: null as SessionPayload | null, error: "Authentication required" };
  }

  const admin = await queryOne<AdminRow>(
    "SELECT id, name, email, password_hash, role, status FROM admins WHERE id = ? LIMIT 1",
    [session.id]
  );

  if (!admin || admin.status !== "ACTIVE") {
    return { session: null as SessionPayload | null, error: "Authentication required" };
  }

  return { session, error: null as string | null };
}

export async function findAdminByEmail(email: string) {
  return queryOne<AdminRow>(
    "SELECT id, name, email, password_hash, role, status FROM admins WHERE email = ? LIMIT 1",
    [email]
  );
}

export async function touchLastLogin(id: number) {
  await execute("UPDATE admins SET last_login_at = NOW() WHERE id = ?", [id]);
}

export async function logActivity(
  adminId: number | null,
  action: string,
  entity: string,
  entityId: number | null,
  message: string
) {
  await execute(
    "INSERT INTO activity_logs (admin_id, action, entity, entity_id, message) VALUES (?, ?, ?, ?, ?)",
    [adminId, action, entity, entityId, message]
  );
}

export async function countTable(table: string, where = "1=1", params: Array<string | number | boolean | null> = []) {
  const allowed = new Set([
    "teachers",
    "classes",
    "subjects",
    "gallery",
    "blogs",
    "events",
    "departments",
    "facilities",
    "laboratories",
    "students",
    "enquiries",
    "schedules",
  ]);
  if (!allowed.has(table)) {
    throw new Error("Invalid table");
  }
  const row = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM ${table} WHERE ${where}`,
    params
  );
  return Number(row?.total ?? 0);
}
