# Smt. Champi Devi Inter College

The public website for Smt. Champi Devi Inter College, built with Next.js.

## Run locally

```bash
npm.cmd install
copy .env.example .env
npm.cmd run dev
```

Open `http://localhost:3000`.

## MySQL setup with XAMPP

1. Start Apache and MySQL from the XAMPP Control Panel.
2. Import `database/schema.sql` and then `database/seed.sql` using phpMyAdmin, or run:

```bash
mysql -u root < database/schema.sql
mysql -u root < database/seed.sql
```

The included `.env.example` uses XAMPP's default MySQL host, port, and root user with no password. Copy it to `.env` and adjust it if your XAMPP MySQL settings differ. The database name is `cdic`.

The timetable schema is upgraded automatically when the timetable APIs run. Existing assignments default to Theory Class; practical assignments are stored in the same versioned timetable and are included when a version is published.

Change the development admin password and replace `AUTH_SECRET` with a unique random value before production use. The seed login is `admin@champidevi.local` / `Admin@12345`.

## Production deployment

This is a server-rendered Next.js application because its API routes and MySQL connection must run on a Node.js host. Do not deploy it as a static export.

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```

The application serves the admin panel at `/admin/login`. Admin APIs are protected by the signed `cdic_session` cookie; public APIs only return active or published content.

## Verification

```bash
npm.cmd run lint
npm.cmd run build
```
