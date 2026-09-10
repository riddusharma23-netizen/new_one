# Smt. Champi Devi Inter College

The public website for Smt. Champi Devi Inter College, built with Next.js.

## Run locally

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

## Production deployment

This project is configured as a static export. Build the deployable site with:

```bash
npm.cmd run build
```

Upload the contents of the generated `out/` directory to any static web server, hosting panel, CDN, or object storage bucket. Do not upload the project root or `node_modules`.

### Apache deployment

Upload the contents inside `out/` directly into the Apache virtual host's `DocumentRoot` (for example, `/var/www/html/`), so the server contains `/var/www/html/index.html`. Do not upload the `out` directory itself as a nested folder unless the site's `DocumentRoot` points to that directory.

The export includes `index.html` at the root and `index.html` inside each route directory. `public/.htaccess` is copied into `out/.htaccess` during the build and handles directory indexes, route redirects, and the generated 404 page. Apache must allow overrides for the document root:

```apache
<Directory "/var/www/html">
	AllowOverride FileInfo Indexes Options
	Require all granted
</Directory>
```

After changing the Apache virtual host configuration, reload Apache and ensure the files are readable by the web-server user. If `.htaccess` is not permitted by the host, configure `DirectoryIndex index.html`, `Options -Indexes`, and equivalent rewrite rules in the virtual host instead. The homepage itself does not need a redirect or fallback file: `/index.html` is the direct root document.

For a Node.js host instead, remove `output: "export"` from `next.config.ts`, then deploy with `npm run build` followed by `npm run start`.

## Pre-deployment check

```bash
npm.cmd run lint
npm.cmd run build
```
