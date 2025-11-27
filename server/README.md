# Student Results Server

RIZO Server — Express + Supabase

This Express server provides the REST API for the RIZO application. It uses Supabase (Postgres) as the data backend.

Quick start:

1. Create a Supabase project and set the `SUPABASE_URL` and `SUPABASE_KEY`.
2. Run the SQL in `db.sql` in your Supabase SQL editor to create required tables and sample subjects.
3. Copy `.env.example` to `.env` and fill in your values.
4. Install and run:

```powershell
cd server
npm install
npm run dev    # requires nodemon, or use npm start
```

Faculty credentials used in the demo (developer-provided):
- username: `faculty@college.local`
- password: `FacultyPass123`

Developers:
- Debajyoti Basu
- Abhijit Kunar

The server exposes endpoints used by the React client (see client/README).
