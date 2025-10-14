# Project Structure

```
voting/
├── src/                    # Next.js application source code
│   ├── app/               # App Router (Next.js 13+)
│   │   ├── globals.css    # Global styles with TailwindCSS
│   │   ├── layout.tsx     # Root layout component
│   │   └── page.tsx       # Home page component
│   ├── components/        # React components
│   │   ├── AdminDashboard.tsx      # Admin interface
│   │   ├── CreateVotingCardForm.tsx # Form for creating voting topics
│   │   ├── LoginForm.tsx           # User login form
│   │   ├── RegisterForm.tsx        # User registration form
│   │   ├── VotingCardItem.tsx      # Individual voting topic component
│   │   └── VotingCardsList.tsx     # List of voting topics
│   ├── contexts/          # React Context providers
│   │   └── AuthContext.tsx         # Authentication context
│   ├── lib/               # Utilities and configurations
│   │   └── supabase.ts            # Supabase client configuration
│   └── services/          # API services
│       └── api.ts                 # Supabase API calls
├── supabase-schema.sql    # Database schema for Supabase
├── SETUP.md              # Quick setup guide
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
- `SETUP.md` - Quick setup guide for new users

### Application Logic

- `src/app/page.tsx` - Main application entry point
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/lib/supabase.ts` - Supabase client setup and database types
- `src/services/api.ts` - All database operations and API calls

## Getting Started

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

The application will be available at `http://localhost:3000`
