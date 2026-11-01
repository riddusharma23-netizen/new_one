import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { getPool, queryOne } from "@/lib/db";
import { DEFAULT_TIME_SLOTS } from "@/lib/schedule-master";

async function run(connection: PoolConnection, sql: string) {
  try {
    await connection.execute(sql);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : "";
    if (code !== "ER_DUP_FIELDNAME" || !/^\s*ALTER TABLE .+ ADD COLUMN /i.test(sql)) throw error;
  }
}

export async function ensureTimetableSchema() {
  const connection = await getPool().getConnection();
  try {
    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS academic_years (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20) NOT NULL,
        start_date DATE NULL,
        end_date DATE NULL,
        status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_academic_year_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    const [groupTables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('groups', 'class_groups')"
    );
    const existingGroupTables = (groupTables as Array<{ TABLE_NAME: string }>).map((table) => table.TABLE_NAME);
    if (!existingGroupTables.includes("class_groups") && existingGroupTables.includes("groups")) {
      await connection.query("RENAME TABLE `groups` TO class_groups");
    } else if (existingGroupTables.includes("class_groups") && existingGroupTables.includes("groups")) {
      const [conflicts] = await connection.query(
        `SELECT legacy.id
         FROM \`groups\` legacy
         JOIN class_groups current ON current.id = legacy.id
         WHERE current.name <> legacy.name OR current.class_id <> legacy.class_id
         LIMIT 1`
      );
      if ((conflicts as unknown[]).length) {
        throw new Error("Cannot migrate legacy student groups because class_groups contains conflicting IDs.");
      }
      await connection.query(
        `INSERT IGNORE INTO class_groups (id, name, class_id, description, active, created_at, updated_at)
         SELECT id, name, class_id, description, active, created_at, updated_at FROM \`groups\``
      );
    }

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS class_groups (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(120) NOT NULL,
        class_id INT UNSIGNED NOT NULL,
        description TEXT NULL,
        active ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_class_groups_class (class_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS rooms (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(80) NOT NULL,
        room_type VARCHAR(40) NOT NULL DEFAULT 'CLASSROOM',
        building VARCHAR(80) NULL,
        capacity INT UNSIGNED NULL,
        active ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_rooms_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS time_slots (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        academic_year VARCHAR(20) NULL,
        label VARCHAR(120) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        slot_order INT UNSIGNED NOT NULL DEFAULT 1,
        slot_type ENUM('REGULAR','BREAK','LUNCH','ASSEMBLY','OTHER') NOT NULL DEFAULT 'REGULAR',
        is_break TINYINT(1) NOT NULL DEFAULT 0,
        is_lunch TINYINT(1) NOT NULL DEFAULT 0,
        active ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_time_slots_order (slot_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(connection, "ALTER TABLE teachers ADD COLUMN short_name VARCHAR(40) NULL");
    await run(connection, "ALTER TABLE teachers ADD COLUMN teacher_code VARCHAR(40) NULL");
    await run(connection, "ALTER TABLE teachers ADD COLUMN availability_notes TEXT NULL");
    await run(connection, "ALTER TABLE classes ADD COLUMN capacity INT UNSIGNED NULL");
    await run(connection, "ALTER TABLE classes ADD COLUMN category VARCHAR(40) NULL");
    await run(connection, "ALTER TABLE subjects ADD COLUMN category VARCHAR(80) NULL");
    await run(connection, "ALTER TABLE rooms ADD COLUMN building VARCHAR(80) NULL");
    await run(connection, "ALTER TABLE rooms ADD COLUMN capacity INT UNSIGNED NULL");
    await run(connection, "ALTER TABLE time_slots ADD COLUMN academic_year VARCHAR(20) NULL");
    await run(
      connection,
      "ALTER TABLE schedules MODIFY COLUMN day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL"
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS teacher_subjects (
        teacher_id INT UNSIGNED NOT NULL,
        subject_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (teacher_id, subject_id),
        KEY idx_teacher_subjects_subject (subject_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS group_subjects (
        group_id INT UNSIGNED NOT NULL,
        subject_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (group_id, subject_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS teacher_availability (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        teacher_id INT UNSIGNED NOT NULL,
        day_of_week VARCHAR(16) NOT NULL,
        start_time TIME NULL,
        end_time TIME NULL,
        is_available TINYINT(1) NOT NULL DEFAULT 1,
        notes VARCHAR(255) NULL,
        PRIMARY KEY (id),
        KEY idx_teacher_availability (teacher_id, day_of_week)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS timetable_versions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        academic_year VARCHAR(20) NOT NULL,
        name VARCHAR(160) NOT NULL,
        status ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
        notes TEXT NULL,
        created_by INT UNSIGNED NULL,
        published_by INT UNSIGNED NULL,
        published_at DATETIME NULL,
        restored_from_id INT UNSIGNED NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_timetable_versions_year (academic_year, status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS schedule_groups (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        version_id INT UNSIGNED NOT NULL,
        class_id INT UNSIGNED NOT NULL,
        student_group_id INT UNSIGNED NULL,
        time_slot_id INT UNSIGNED NOT NULL,
        day_of_week VARCHAR(16) NOT NULL,
        name VARCHAR(160) NOT NULL,
        sort_order INT UNSIGNED NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_schedule_groups_cell (version_id, class_id, day_of_week, time_slot_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS schedule_assignments (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        schedule_group_id INT UNSIGNED NOT NULL,
        subject_id INT UNSIGNED NULL,
        room_id INT UNSIGNED NULL,
        notes TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_schedule_assignments_group (schedule_group_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS schedule_assignment_teachers (
        assignment_id INT UNSIGNED NOT NULL,
        teacher_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (assignment_id, teacher_id),
        KEY idx_sat_teacher (teacher_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await run(
      connection,
      `CREATE TABLE IF NOT EXISTS timetable_audit_logs (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        version_id INT UNSIGNED NULL,
        admin_id INT UNSIGNED NULL,
        action VARCHAR(80) NOT NULL,
        message VARCHAR(255) NOT NULL,
        payload JSON NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_timetable_audit_version (version_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    const year = await queryOne<{ id: number }>("SELECT id FROM academic_years WHERE name = ? LIMIT 1", ["2025-26"]);
    if (!year) {
      await connection.execute(
        "INSERT INTO academic_years (name, start_date, end_date, status) VALUES (?, ?, ?, 'ACTIVE')",
        ["2025-26", "2025-04-01", "2026-03-31"]
      );
    }

    const slotCount = await queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM time_slots");
    if (!Number(slotCount?.total)) {
      for (const slot of DEFAULT_TIME_SLOTS) {
        await connection.execute(
          `INSERT INTO time_slots (label, start_time, end_time, slot_order, slot_type, is_break, is_lunch, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
          [slot.label, slot.start_time, slot.end_time, slot.slot_order, slot.slot_type, slot.is_break ? 1 : 0, slot.is_lunch ? 1 : 0]
        );
      }
    }

    await seedTimetableClasses(connection);
  } finally {
    connection.release();
  }
}

async function seedTimetableClasses(connection: PoolConnection) {
  const needed = [
    { name: "6", section: "A", category: "JUNIOR" },
    { name: "7", section: "A", category: "JUNIOR" },
    { name: "8", section: "A", category: "JUNIOR" },
    { name: "Junior Extra", section: "A", category: "JUNIOR" },
    { name: "9", section: "A", category: "MIDDLE" },
    { name: "10", section: "A", category: "MIDDLE" },
    { name: "11", section: "A", category: "SENIOR" },
    { name: "12", section: "A", category: "SENIOR" },
  ];

  for (const item of needed) {
    const [rows] = await connection.execute(
      "SELECT id FROM classes WHERE class_name = ? AND academic_year = ? LIMIT 1",
      [item.name, "2025-26"]
    );
    const existing = rows as Array<{ id: number }>;
    if (existing.length) {
      await connection.execute("UPDATE classes SET category = COALESCE(category, ?) WHERE id = ?", [item.category, existing[0].id]);
      continue;
    }
    await connection.execute(
      `INSERT INTO classes (class_name, section, academic_year, class_teacher_id, room, status, category)
       VALUES (?, ?, '2025-26', NULL, NULL, 'ACTIVE', ?)`,
      [item.name, item.section, item.category]
    );
  }
}

export async function auditTimetable(adminId: number | null, action: string, message: string, versionId?: number | null, payload?: unknown) {
  const pool = getPool();
  await pool.execute(
    "INSERT INTO timetable_audit_logs (version_id, admin_id, action, message, payload) VALUES (?, ?, ?, ?, ?)",
    [versionId ?? null, adminId, action, message, payload ? JSON.stringify(payload) : null]
  );
}

export async function tableHasRows(table: string) {
  const row = await queryOne<{ total: number }>(`SELECT COUNT(*) AS total FROM ${table}`);
  return Number(row?.total ?? 0) > 0;
}

export async function insertId(connection: PoolConnection, sql: string, params: Array<string | number | boolean | null>) {
  const [result] = await connection.execute(sql, params);
  return Number((result as ResultSetHeader).insertId);
}
