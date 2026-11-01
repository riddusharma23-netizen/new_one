-- =====================================================================
-- Smt. Champi Devi Inter College - database schema (MySQL 8 / InnoDB)
-- Safe to re-run: every table uses CREATE TABLE IF NOT EXISTS.
-- For changes on an existing database, write a migration (ALTER TABLE).
--
-- NOTE: the old table `groups` is now `class_groups`, because GROUPS is a
-- reserved word in MySQL 8.0.2+ and broke the old script.
-- Update any Node.js queries that referenced `groups`.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS cdic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cdic;

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- Auth / admin
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'ACCOUNTANT') NOT NULL DEFAULT 'ADMIN',
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email),
  KEY idx_admins_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(120) NOT NULL,
  setting_value TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Academic structure
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_years (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_academic_year_name (name),
  KEY idx_academic_years_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teachers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  designation VARCHAR(160) NOT NULL,
  department VARCHAR(160) NULL,
  subject VARCHAR(160) NULL,
  qualification VARCHAR(255) NULL,
  experience VARCHAR(80) NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(40) NULL,
  image VARCHAR(255) NULL,
  bio TEXT NULL,
  staff_type ENUM('TEACHER', 'SUPPORT') NOT NULL DEFAULT 'TEACHER',
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_teachers_status (status),
  KEY idx_teachers_name (name),
  KEY idx_teachers_type (staff_type),
  KEY idx_teachers_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS classes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_name VARCHAR(40) NOT NULL,
  section VARCHAR(20) NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  class_teacher_id INT UNSIGNED NULL,
  room VARCHAR(40) NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_classes_name_section_year (class_name, section, academic_year),
  KEY idx_classes_status (status),
  CONSTRAINT fk_classes_teacher
    FOREIGN KEY (class_teacher_id) REFERENCES teachers (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject_name VARCHAR(120) NOT NULL,
  subject_code VARCHAR(40) NOT NULL,
  class_id INT UNSIGNED NOT NULL,
  teacher_id INT UNSIGNED NULL,
  weekly_periods INT UNSIGNED NOT NULL DEFAULT 1,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_subjects_code (subject_code),
  KEY idx_subjects_status (status),
  KEY idx_subjects_class (class_id),
  KEY idx_subjects_teacher (teacher_id),
  CONSTRAINT fk_subjects_class
    FOREIGN KEY (class_id) REFERENCES classes (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_subjects_teacher
    FOREIGN KEY (teacher_id) REFERENCES teachers (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Renamed from `groups` (reserved word in MySQL 8).
CREATE TABLE IF NOT EXISTS class_groups (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  class_id INT UNSIGNED NOT NULL,
  description TEXT NULL,
  active ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_class_groups_class (class_id),
  CONSTRAINT fk_class_groups_class
    FOREIGN KEY (class_id) REFERENCES classes (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rooms (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  room_type VARCHAR(40) NOT NULL DEFAULT 'CLASSROOM',
  active ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rooms_name (name),
  KEY idx_rooms_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS time_slots (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
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
  KEY idx_time_slots_order (slot_order),
  KEY idx_time_slots_status (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Timetable
-- ---------------------------------------------------------------------
-- Simple weekly timetable (period based).
-- Clash checks (same teacher / class / room in the same period) are done
-- in the API; these composite indexes make those checks fast.
CREATE TABLE IF NOT EXISTS schedules (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  teacher_id INT UNSIGNED NOT NULL,
  class_id INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  period_number TINYINT UNSIGNED NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(40) NULL,
  academic_year VARCHAR(20) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_schedules_teacher (teacher_id, day_of_week, period_number, academic_year, status),
  KEY idx_schedules_class (class_id, day_of_week, period_number, academic_year, status),
  KEY idx_schedules_room (room, day_of_week, period_number, academic_year, status),
  KEY idx_schedules_subject (subject_id),
  KEY idx_schedules_year (academic_year),
  CONSTRAINT fk_schedules_teacher
    FOREIGN KEY (teacher_id) REFERENCES teachers (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_schedules_class
    FOREIGN KEY (class_id) REFERENCES classes (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_schedules_subject
    FOREIGN KEY (subject_id) REFERENCES subjects (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advanced timetable (time-slot based, supports breaks / lunch / activities).
CREATE TABLE IF NOT EXISTS schedule_entries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  academic_year_id INT UNSIGNED NULL,
  class_id INT UNSIGNED NULL,
  group_id INT UNSIGNED NULL,
  subject_id INT UNSIGNED NULL,
  teacher_id INT UNSIGNED NULL,
  room_id INT UNSIGNED NULL,
  time_slot_id INT UNSIGNED NULL,
  day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NULL,
  entry_type ENUM('SUBJECT','BREAK','LUNCH','ACTIVITY','ASSEMBLY','FREE','OTHER') NOT NULL DEFAULT 'SUBJECT',
  start_slot_id INT UNSIGNED NULL,
  end_slot_id INT UNSIGNED NULL,
  display_label VARCHAR(160) NULL,
  notes TEXT NULL,
  color_override VARCHAR(20) NULL,
  status ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_schedule_entries_year (academic_year_id),
  KEY idx_schedule_entries_class_time (class_id, day_of_week, time_slot_id),
  KEY idx_schedule_entries_teacher_time (teacher_id, day_of_week, time_slot_id),
  KEY idx_schedule_entries_room_time (room_id, day_of_week, time_slot_id),
  KEY idx_schedule_entries_status (status),
  CONSTRAINT fk_schedule_entries_academic_year
    FOREIGN KEY (academic_year_id) REFERENCES academic_years (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_class
    FOREIGN KEY (class_id) REFERENCES classes (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_group
    FOREIGN KEY (group_id) REFERENCES class_groups (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_subject
    FOREIGN KEY (subject_id) REFERENCES subjects (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_teacher
    FOREIGN KEY (teacher_id) REFERENCES teachers (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_room
    FOREIGN KEY (room_id) REFERENCES rooms (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_time_slot
    FOREIGN KEY (time_slot_id) REFERENCES time_slots (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_start_slot
    FOREIGN KEY (start_slot_id) REFERENCES time_slots (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_schedule_entries_end_slot
    FOREIGN KEY (end_slot_id) REFERENCES time_slots (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Public website content
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  event_name VARCHAR(160) NULL,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('PUBLISHED', 'DRAFT') NOT NULL DEFAULT 'PUBLISHED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gallery_status (status),
  KEY idx_gallery_category (category),
  KEY idx_gallery_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blogs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  excerpt TEXT NULL,
  content MEDIUMTEXT NULL,
  featured_image VARCHAR(255) NULL,
  author VARCHAR(120) NULL,
  category VARCHAR(80) NULL,
  status ENUM('PUBLISHED', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
  published_at DATETIME NULL,
  seo_title VARCHAR(220) NULL,
  seo_description VARCHAR(320) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blogs_slug (slug),
  KEY idx_blogs_status (status),
  KEY idx_blogs_published (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(220) NOT NULL,
  description TEXT NULL,
  event_date DATE NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  location VARCHAR(180) NULL,
  image VARCHAR(255) NULL,
  status ENUM('PUBLISHED', 'DRAFT', 'CANCELLED') NOT NULL DEFAULT 'PUBLISHED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_events_date (event_date),
  KEY idx_events_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS departments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description TEXT NULL,
  hero_image VARCHAR(255) NULL,
  icon_name VARCHAR(80) NULL,
  color VARCHAR(20) NULL,
  extra_json JSON NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_departments_slug (slug),
  KEY idx_departments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS facilities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description TEXT NULL,
  image VARCHAR(255) NULL,
  features JSON NULL,
  extra_json JSON NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_facilities_slug (slug),
  KEY idx_facilities_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS laboratories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description TEXT NULL,
  images JSON NULL,
  facilities JSON NULL,
  extra_json JSON NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_laboratories_slug (slug),
  KEY idx_laboratories_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NULL,
  subject VARCHAR(200) NULL,
  message TEXT NOT NULL,
  status ENUM('PENDING', 'READ', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_enquiries_status (status),
  KEY idx_enquiries_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Students & results
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_name VARCHAR(160) NOT NULL,
  father_name VARCHAR(160) NULL,
  mother_name VARCHAR(160) NULL,
  class_id INT UNSIGNED NULL,
  class_label VARCHAR(40) NULL,
  section VARCHAR(20) NULL,
  roll_no VARCHAR(40) NOT NULL,
  session VARCHAR(20) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_student_roll_session (roll_no, session),
  KEY idx_students_name (student_name),
  KEY idx_students_class (class_id),
  CONSTRAINT fk_students_class
    FOREIGN KEY (class_id) REFERENCES classes (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS results (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_id INT UNSIGNED NOT NULL,
  session VARCHAR(20) NOT NULL,
  overall_grade VARCHAR(10) NULL,
  result_status ENUM('PASS', 'FAIL') NOT NULL DEFAULT 'PASS',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_result_student_session (student_id, session),
  CONSTRAINT fk_results_student
    FOREIGN KEY (student_id) REFERENCES students (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS result_subjects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  result_id INT UNSIGNED NOT NULL,
  subject VARCHAR(120) NOT NULL,
  max_marks INT NOT NULL DEFAULT 100,
  obtain_marks INT NOT NULL DEFAULT 0,
  grade VARCHAR(10) NULL,
  PRIMARY KEY (id),
  KEY idx_result_subjects_result (result_id),
  CONSTRAINT fk_result_subjects_result
    FOREIGN KEY (result_id) REFERENCES results (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Audit
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_id INT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  entity_id INT UNSIGNED NULL,
  message VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_created (created_at),
  KEY idx_activity_admin (admin_id),
  CONSTRAINT fk_activity_admin
    FOREIGN KEY (admin_id) REFERENCES admins (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;