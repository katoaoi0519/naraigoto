NaraiGoto Prime Database (PostgreSQL)

Files:

- 01_schema.sql: Creates enums, tables, and indexes.
- 02_seed.sql: Inserts demo data with fixed UUIDs.
- 03_reset.sql: Drops all Phase 2 objects (use before re-creating schema).

Prerequisites:

- PostgreSQL 13+ (RDS or local).
- psql client available in PATH.

Run steps (PowerShell, one command per line):

1. Change directory to the repo root:

```powershell
cd "C:\Users\0622d\OneDrive - OUMail (Osaka University)\就活\aws\bootcamp\naraigoto"
```

2. Set connection parameters (edit for your environment):

```powershell
$env:PGHOST = "<your-rds-endpoint>"
$env:PGPORT = "5432"
$env:PGUSER = "<db-username>"
$env:PGDATABASE = "<db-name>"
$env:PGPASSWORD = "<db-password>"
```

3. Create schema:

```powershell
psql -v ON_ERROR_STOP=1 -f ".\database\postgres\01_schema.sql"
```

4. Seed demo data:

```powershell
psql -v ON_ERROR_STOP=1 -f ".\database\postgres\02_seed.sql"
```

5. Reset (optional). Then re-run steps 3 and 4:

```powershell
psql -v ON_ERROR_STOP=1 -f ".\database\postgres\03_reset.sql"
```

Notes:

- Uses built-in POINT type for `schools.location` (no PostGIS required).
- Uses `pgcrypto` for UUID generation (`gen_random_uuid()`).
- Enum values are minimal to match the tech document; extend as needed.


