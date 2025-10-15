# Project Structure

```
voting-system/
├── src/                    # Next.js application source code
│   ├── app/               # App Router (Next.js 14+)
│   │   ├── globals.css    # Global styles with TailwindCSS
│   │   ├── layout.tsx     # Root layout component (Server Component)
│   │   └── page.tsx       # Home page component (Server Component)
│   ├── components/        # React components
│   │   ├── AdminDashboard.tsx       # Admin interface (Client Component)
│   │   ├── AuthButtons.tsx          # Authentication buttons (Client Component)
│   │   ├── AuthForms.tsx            # Login/Register form wrapper (Client Component)
│   │   ├── CreateVotingCardForm.tsx # Form for creating voting topics
│   │   ├── LoginForm.tsx            # User login form
│   │   ├── RegisterForm.tsx         # User registration form
│   │   ├── ToasterProvider.tsx      # Toast notification provider
│   │   ├── VotingCardItem.tsx       # Individual voting topic component
│   │   └── VotingCardsList.tsx      # List of voting topics
│   ├── lib/               # Utilities and configurations
│   │   ├── auth.ts                  # Server-side auth utilities
│   │   └── supabase/                # Supabase client configurations
│   │       ├── client.ts            # Browser client (for Client Components)
│   │       ├── server.ts            # Server client (for Server Components)
│   │       ├── types.ts             # Database type definitions
│   │       └── index.ts             # Barrel exports
│   ├── services/          # API services
│   │   └── api.ts                   # Supabase API calls
│   └── middleware.ts      # Next.js middleware for session refresh
├── supabase-schema.sql    # Database schema for Supabase
├── PROJECT_STRUCTURE.md   # This file
├── README.md             # Main documentation
├── start.sh              # Startup script
├── env.example           # Environment variables template
├── package.json          # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── postcss.config.js     # PostCSS configuration
```

## Key Files

### Configuration

- `package.json` - Project dependencies and npm scripts
- `next.config.js` - Next.js framework configuration
- `tailwind.config.js` - TailwindCSS styling configuration
- `tsconfig.json` - TypeScript compiler configuration

### Environment

- `env.example` - Template for environment variables
- `.env.local` - Local environment variables (create this from env.example)

### Database

- `supabase-schema.sql` - Complete database schema with tables and policies

### Documentation

- `README.md` - Main project documentation

### Application Logic

- `src/app/page.tsx` - Main application entry point (Server Component)
- `src/app/layout.tsx` - Root layout (Server Component)
- `src/middleware.ts` - Session refresh and auth middleware
- `src/lib/auth.ts` - Server-side authentication utilities
- `src/lib/supabase/` - Supabase client configurations (client/server separation)
- `src/services/api.ts` - All database operations and API calls

## Architecture

This project uses **Next.js 14 App Router with SSR-first architecture**:

### Server Components (Default)

- `app/page.tsx` - Renders auth state server-side
- `app/layout.tsx` - Root layout without client-side state
- `lib/auth.ts` - Server-side auth checks using `createServerComponentClient`

### Client Components (Interactive)

- All components in `components/` are marked with `"use client"`
- Use `createClient` from `lib/supabase/client.ts`
- Handle user interactions, form submissions, and real-time updates

### Key Patterns

1. **Auth Flow**:

   - Middleware refreshes session on every request
   - Server Components fetch auth state directly from Supabase
   - Client Components use `router.refresh()` after auth actions

2. **Import Rules**:

   - Client Components: Import from `@/lib/supabase/client`
   - Server Components: Import from `@/lib/supabase/server`
   - Never import server code in client components

3. **Benefits**:
   - Better SEO and initial page load
   - Server-side auth checks prevent flash of wrong content
   - Smaller JavaScript bundle sent to browser
   - Leverages Next.js App Router features

## Getting Started

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

The application will be available at `http://localhost:3000`
