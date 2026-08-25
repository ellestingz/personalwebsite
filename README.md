# Personal Portfolio Website

A Next.js portfolio site with a built-in admin panel for editing homepage content in the browser. The project is designed to work in two modes:

- Local demo mode: uses in-memory content when Supabase is not configured.
- Production mode: stores content in Supabase so website edits persist across restarts and deployments.

This README is meant to be used when the site is uploaded to a real domain or hosting platform.

## Project structure

- `src/app/page.tsx` – public portfolio homepage
- `src/app/admin/page.tsx` – admin editor page
- `src/lib/site-content.ts` – content model, defaults, and Supabase persistence logic
- `src/app/api/site/route.ts` – public content API
- `src/app/api/admin/login/route.ts` – admin login API
- `.env.example` – environment template

## Default admin login

- Username: `Admin01`
- Password: `Admin4321`

These values are used as the default fallback if no real environment variables are provided.

## Required production setup

For the site to keep edits after deployment, add the actual Supabase values in a production environment file or hosting dashboard.

### 1) Create a Supabase project

1. Go to Supabase.
2. Create a new project.
3. Copy the project URL and anon key.

### 2) Add environment variables

Create a `.env.local` file in the project root for local development, or set these variables in your hosting platform for production.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_USERNAME=Admin01
ADMIN_PASSWORD=Admin4321
NEXT_PUBLIC_SITE_BASE_URL=https://your-domain.com
```

Important:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for persistent storage.
- `NEXT_PUBLIC_SITE_BASE_URL` should be your real domain URL.

### 3) Create the database table

Run this in the Supabase SQL editor:

```sql
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger site_content_updated_at
before update on public.site_content
for each row
execute function public.handle_updated_at();
```

This creates the `site_content` table and stores the homepage content as JSON.

## Local development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Then open:

- Local site: `http://localhost:3001`
- Admin page: `http://localhost:3001/admin`

## Production deployment

This app is built for a standard Next.js deployment. The recommended path is a hosting platform like Vercel, or a custom Node/Next deployment service.

### Vercel deployment example

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add the environment variables listed above.
4. Deploy.
5. Set the custom domain.
6. Open the live admin page and log in with the default credentials.

### Important deployment note

If the Supabase variables are not configured in production, the site will still run, but admin edits will not be permanent. The content will behave like a temporary local session and may reset after a new deployment or server restart.

## Admin editing workflow

1. Visit `/admin` on the live website.
2. Log in with `Admin01` / `Admin4321`.
3. Edit the portfolio copy, email, skills, project cards, or image URLs.
4. Save changes.
5. The app saves to Supabase if configured, so the live site updates persistently.

## Troubleshooting

### Blank page after changes

If the site goes blank or shows a broken runtime state:

```bash
rm -rf .next
npm run build
npm run dev
```

This clears the stale Next.js cache and rebuilds the app cleanly.

### Changes disappear after upload

This usually means the Supabase environment variables were not configured or the `site_content` table was not created.

Check:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- database table exists in Supabase
- the app is using the production domain URL in `NEXT_PUBLIC_SITE_BASE_URL`

## AI-assistant usage notes

When a future owner or assistant is updating the site, they should follow this checklist:

1. Confirm the real Supabase project is connected.
2. Confirm `.env.local` or hosting environment variables are set correctly.
3. Confirm the `site_content` table exists in Supabase.
4. Log in to `/admin` to edit content.
5. Test the live site after saving.

## Summary

This project is ready for a real domain deployment, but persistent editing requires the Supabase database setup described above. Without that config, the admin panel works only as a temporary local editing environment.

For production use, always configure the Supabase URL and anon key before publishing the site.
