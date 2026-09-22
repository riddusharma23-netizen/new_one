# Smt. Champi Devi Inter College

The public website for Smt. Champi Devi Inter College, built with Next.js.

## Run locally

```bash
npm.cmd install
copy .env.example .env
npm.cmd run dev
```

Open `http://localhost:3000`.

## MySQL setup

1. Install MySQL 8 or newer.
2. Create the schema and development data:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p champidevi < database/seed.sql
```

3. Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `AUTH_SECRET` in `.env`.
4. Change the development admin password before production use. The seed login is `admin@champidevi.local` / `Admin@12345`.

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
