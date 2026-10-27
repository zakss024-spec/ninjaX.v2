# NinjaX
Mobile-first cyber-style dashboard with Supabase realtime Global Chat.

## Setup
1. `npm install`
2. Copy `.env.local.example` to `.env.local`
3. Put your Supabase URL and Publishable Key in `.env.local`
4. Run `supabase/schema.sql` in Supabase SQL Editor
5. `npm run dev`

Never put a Supabase secret/service-role key in the frontend.

Cybersecurity labs in this starter are local simulations only.

## Environment file

Create `.env.local` in the project root (same level as `package.json`):

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

Do not rename those variable names.
