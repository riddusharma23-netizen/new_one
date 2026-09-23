import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute } from "@/lib/db";
import { revalidatePublic } from "@/lib/revalidate";
import { asString } from "@/lib/validation";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_ROWS = 500;

type Row = Record<string, unknown>;

function read(row: Row, ...keys: string[]) {
  const entry = Object.entries(row).find(([key]) => keys.includes(key.trim().toLowerCase().replace(/\s+/g, "_")));
  return entry?.[1];
}

function text(row: Row, ...keys: string[]) {
  return asString(read(row, ...keys));
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, message: error ?? "Authentication required" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ success: false, message: "Please choose an Excel file" }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ success: false, message: "File must be smaller than 5 MB" }, { status: 400 });
  if (!["xlsx", "xls", "csv"].includes(file.name.split(".").pop()?.toLowerCase() ?? "")) return NextResponse.json({ success: false, message: "Use .xlsx, .xls, or .csv files" }, { status: 400 });

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });
    if (!rows.length) return NextResponse.json({ success: false, message: "The sheet has no data rows" }, { status: 400 });
    if (rows.length > MAX_ROWS) return NextResponse.json({ success: false, message: `Import up to ${MAX_ROWS} rows at a time` }, { status: 400 });

    const failures: Array<{ row: number; message: string }> = [];
    let imported = 0;
    for (const [index, row] of rows.entries()) {
      const title = text(row, "title", "name");
      const image = text(row, "image", "image_path", "image_url");
      const category = text(row, "category") || "Cultural Event";
      if (!title || !image) {
        failures.push({ row: index + 2, message: "Title and image path are required" });
        continue;
      }
      await execute(
        `INSERT INTO gallery (title, description, image, category, event_name, display_order, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, text(row, "description"), image, category, text(row, "event", "event_name") || null, Number(read(row, "display_order", "order")) || 0, text(row, "status") === "DRAFT" ? "DRAFT" : "PUBLISHED"]
      );
      imported += 1;
    }

    await logActivity(session.id, "IMPORT", "gallery", null, `Imported ${imported} gallery items`);
    revalidatePublic();
    return NextResponse.json({ success: true, message: `Imported ${imported} gallery item(s)`, data: { imported, failed: failures.length, failures } });
  } catch (importError) {
    console.error(importError);
    return NextResponse.json({ success: false, message: "Unable to import gallery file. Check the columns and format." }, { status: 500 });
  }
}
