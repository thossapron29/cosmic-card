# Cosmic Card PWA

A spiritual manifestation web app where users reveal one card message from the universe each day. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Unlimited Reveals**: Reveal as many cosmic messages as you want, anytime.
- **PWA Ready**: Installable on iPhone and Android with a native app-like experience.
- **Fullscreen Mode**: Immersive standalone display.
- **Performance Optimized**: Smooth animations with Framer Motion.
- **Instagram Sharing**: Export beautiful 9:16 card images directly to Instagram Stories.
- **Journey History**: View all your past revealed cards in a beautiful timeline.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **PWA**: [Serwist](https://serwist.pages.dev/)

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Setup Supabase**: 
   - Run the SQL in `supabase/schema.sql` in your Supabase project.
   - **For unlimited reveals**: Run `supabase/migration_unlimited_reveals.sql` to remove the daily limit constraint.
4. **Environment Variables**: Add your Supabase credentials to `.env.local`.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key
   ```
5. **Run locally**: `npm run dev`

## Deployment

Recommended to deploy on [Vercel](https://vercel.com).
