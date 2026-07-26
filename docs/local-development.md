# Local database development

Development is isolated from the remote MySQL database by `.env.local`. Adonis loads this file
before `.env`, so the development process uses SQLite at `tmp/db.sqlite3`.

To configure a new checkout:

```bash
cp .env.local.example .env.local
npm rebuild better-sqlite3
npm run db:local:setup
```

No dummy accounts, drivers, vehicles, bookings, promotions, or MVest earnings are created
automatically. Create development records through the application APIs.

`npm run db:local:banks` fetches the current bank list from the configured provider and upserts it
without deleting existing records. If the provider is unavailable, it fails without emptying the
table.

Do not remove `.env.local` when doing local development. Without it, the values in `.env` become
active again.
