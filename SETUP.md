# Quick Setup Guide

## 🚀 Getting Started with Supabase + Next.js Voting System

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization and enter:
   - **Name**: voting-system
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for setup to complete

### Step 2: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` and paste it
4. Click "Run" to execute the SQL script
5. Verify that 4 tables were created: `users`, `voting_cards`, `votes`, `comments`

### Step 3: Get Your Credentials

1. In Supabase dashboard, go to **Settings > API**
2. Copy these values:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 4: Configure Application

1. Run the startup script (it will automatically create the environment file):

```bash
./start.sh
```

Or manually create the environment file:

```bash
cp env.example .env.local
```

2. Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your voting system!

### Step 6: Create Your First Admin User

1. Register a new account through the web interface
2. In Supabase dashboard, go to **Table Editor > users**
3. Find your user and change `role` from `user` to `admin`
4. Save the changes
5. Refresh the web app - you should now see admin controls

## 🎉 You're Ready!

Your voting system is now running with:

- ✅ User authentication
- ✅ Admin dashboard
- ✅ Voting functionality
- ✅ Comments system
- ✅ Real-time updates

## 🔧 Troubleshooting

**"Failed to fetch voting cards"**: Check your Supabase URL and API key in `.env.local`

**"User not authenticated"**: Make sure you're logged in and the Supabase auth is working

**Admin features not showing**: Verify your user role is set to `admin` in the database

## 📚 Next Steps

- Customize the UI with your branding
- Add email notifications
- Implement voting deadlines
- Add data export features
- Deploy to production (Vercel + Supabase)
