import { type DbParam, query, queryOne } from "@/lib/db";
import { parsePositiveInt } from "@/lib/http";

export async function paginate<T>(options: {
  request: Request;
  table: string;
  columns?: string;
  searchColumns?: string[];
  defaultWhere?: string;
  defaultParams?: unknown[];
  extraWhere?: string[];
  extraParams?: unknown[];
  orderBy?: string;
  joins?: string;
}) {
  const url = new URL(options.request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const pageSize = Math.min(parsePositiveInt(url.searchParams.get("pageSize"), 10), 50);
  const status = url.searchParams.get("status")?.trim() ?? "";

  const where = [options.defaultWhere ?? "1=1", ...(options.extraWhere ?? [])];
  const params: DbParam[] = [...(options.defaultParams ?? []), ...(options.extraParams ?? [])] as DbParam[];

  if (status) {
    where.push(`${options.joins ? options.table + "." : ""}status = ?`);
    params.push(status);
  }

  if (q && options.searchColumns?.length) {
    where.push(`(${options.searchColumns.map((col) => `${col} LIKE ?`).join(" OR ")})`);
    for (let i = 0; i < options.searchColumns.length; i += 1) {
      params.push(`%${q}%`);
    }
  }

  const whereSql = where.join(" AND ");
  const fromSql = `${options.table} ${options.joins ?? ""}`;
  const countRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM ${fromSql} WHERE ${whereSql}`,
    params
  );
  const total = Number(countRow?.total ?? 0);
  const items = await query<T>(
    `SELECT ${options.columns ?? `${options.table}.*`} FROM ${fromSql}
     WHERE ${whereSql}
     ${options.orderBy ?? "ORDER BY id DESC"}
     LIMIT ? OFFSET ?`,
    [...params, pageSize, (page - 1) * pageSize] as DbParam[]
  );

  return { items, total, page, pageSize };
}

export async function getIdParam(params: Promise<{ id: string }>) {
  const { id } = await params;
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
}
