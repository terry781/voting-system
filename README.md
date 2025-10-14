# Voting System

A modern voting system built with Supabase and Next.js, allowing administrators to create voting topics and users to vote and comment on them.

## Features

### Administrator Capabilities

- Create voting cards with category, title, and description
- View all voting topics and results
- Delete voting topics
- Access admin dashboard

### User Capabilities

- View available voting topics
- Submit votes (Agree, Neutral, Disagree)
- Add comments to topics
- View voting results and statistics

## Tech Stack

- **Backend**: Supabase (Database, Authentication, Real-time)
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, React Hook Form
- **Authentication**: Supabase Auth with role-based access control

## Quick Start

```bash
git clone <your-repo>
cd voting
./start.sh
# Follow the on-screen instructions to configure Supabase
```

## Setup Instructions

### Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Install Node.js 18+ from [nodejs.org](https://nodejs.org)

### Supabase Setup

1. **Create a new Supabase project**:

   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and enter project details
   - Wait for the project to be created

2. **Set up the database schema**:

   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL script to create all tables and policies

3. **Get your project credentials**:
   - Go to Settings > API in your Supabase dashboard
   - Copy your Project URL and anon/public key

### Application Setup

1. **Clone and start the application**:

```bash
git clone <your-repo>
cd voting
./start.sh
```

The startup script will automatically:

- Install dependencies
- Create `.env.local` from template
- Start the development server

2. **Configure Supabase credentials**:

Edit `.env.local` with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The application will be available at `http://localhost:3000`

**Alternative manual setup**:

```bash
npm install
cp env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

## Database Schema

The system uses PostgreSQL with the following tables:

- **users**: id, email, name, role, created_at
- **voting_cards**: id, category, title, description, created_at, updated_at
- **votes**: id, option (agree/neutral/disagree), user_id, voting_card_id, created_at
- **comments**: id, content, user_id, voting_card_id, created_at

### Row Level Security (RLS)

All tables have Row Level Security enabled with the following policies:

- Users can view their own profile
- Everyone can view voting cards, votes, and comments
- Only admins can create, update, or delete voting cards
- Authenticated users can vote and comment (one vote per user per topic)

## Usage

1. **Register/Login**: Create an account or login to access the system
2. **Admin**: Admins can create, manage, and delete voting topics
3. **Users**: Regular users can view topics, vote, and add comments
4. **Voting**: Users can vote Agree, Neutral, or Disagree on each topic
5. **Comments**: Users can add text comments to discuss topics
6. **Results**: View real-time voting statistics and percentage breakdowns

## Creating Admin Users

To create an admin user:

1. Register normally through the app
2. Go to your Supabase dashboard
3. Navigate to Table Editor > users
4. Find your user and change the `role` field from `user` to `admin`
5. Save the changes

## Development

The system is built with modern development practices:

- TypeScript for type safety
- Component-based architecture
- Responsive design with TailwindCSS
- Real-time updates via Supabase
- Error handling and user feedback

## Security Features

- Supabase Auth with email/password authentication
- Row Level Security (RLS) policies
- Role-based access control
- Input validation
- Automatic user profile creation on signup

## Deployment

### Application Deployment

You can deploy the application to any static hosting service:

1. **Vercel** (Recommended):

   ```bash
   npm run build
   # Deploy to Vercel
   ```

2. **Netlify**:
   ```bash
   npm run build
   # Deploy to Netlify
   ```

Make sure to set the environment variables in your hosting platform.

### Database

The database is hosted on Supabase, so no additional setup is needed for the backend.

## Project Structure

```
voting/
├── src/                    # Next.js application source
│   ├── app/               # App router pages and layouts
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utilities and configurations
│   └── services/         # API services
├── supabase-schema.sql   # Database setup
├── start.sh              # Automated startup script
├── SETUP.md              # Quick setup guide
├── README.md             # This file
└── package.json          # Dependencies and scripts
```

## API Reference

The application uses Supabase's auto-generated APIs:

- **Authentication**: `supabase.auth.*`
- **Database**: `supabase.from('table_name').*`
- **Real-time**: `supabase.channel('channel_name').*`

See the [Supabase documentation](https://supabase.com/docs) for detailed API information.
