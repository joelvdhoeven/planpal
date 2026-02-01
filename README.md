# PlanPal

Conversational planning tool that integrates with Google Calendar.

## Features

- Natural language planning - just tell it what you want to schedule in Dutch
- Google Calendar integration via OAuth
- Real-time calendar sync
- Secure authentication via Supabase

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Calendar**: Google Calendar API
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- Supabase account
- Google Cloud Console access

### 1. Clone and Install

```bash
git clone https://github.com/joelvdhoeven/planpal.git
cd planpal
pnpm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers > Google**
3. Enable Google provider
4. Add your Google OAuth credentials (see step 3)
5. Copy your project URL and anon key from **Settings > API**

### 3. Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Go to **APIs & Services > Library**
   - Search for "Google Calendar API"
   - Click **Enable**
4. Configure OAuth consent screen:
   - Go to **APIs & Services > OAuth consent screen**
   - Select "External" user type
   - Fill in app name, support email, developer email
   - Add scope: `https://www.googleapis.com/auth/calendar.events`
5. Create OAuth credentials:
   - Go to **APIs & Services > Credentials**
   - Click **Create Credentials > OAuth client ID**
   - Select "Web application"
   - Add authorized redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
6. Add credentials to Supabase:
   - Go to Supabase **Authentication > Providers > Google**
   - Paste Client ID and Client Secret

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### 5. Run the App

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Log in with your Google account
2. Type a message in Dutch to schedule an event:
   - "morgen om 14:00 meeting met Jan"
   - "volgende week maandag vergadering"
   - "overmorgen om 10 uur tandarts"
3. Confirm the event with "ja" or "ok"
4. The event will be created in your Google Calendar

## License

MIT
