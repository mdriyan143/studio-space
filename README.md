# StudioSpace — Creative Studio Booking Platform

StudioSpace is a peer-to-peer creative workspace booking platform that connects creators with studio owners. It allows photographers, filmmakers, musicians, podcasters, and other creative professionals to discover, explore, and book suitable creative spaces.

Studio owners can list and manage their studios, while creators can browse available workspaces, make reservations, manage bookings, and save their favorite studios.




**Live Site:** https://studio-space-mdriyan143.vercel.app/<br>
**Client Repo:** https://github.com/mdriyan143/studio-space<br>
**Server Repo:** https://github.com/mdriyan143/studio_server<br>
**API:** https://studio-server-zeta.vercel.app/<br>


## Examiner Test Credentials

| Email | Password |
|---|---|
| demo@gmail.com | DEmo1234@ |

Google login also works.

## Features

- **Explore studios:** search, filter by category, and view full details with a photo gallery, amenities, host info and reviews.
- **Host tools:** add, update and delete your own studio listings, with image upload through imgbb.
- **Booking system:** pick a date and hours, send a request (Pending), and cancel while it is still pending.
- **Double-booking protection:** time overlaps with Confirmed bookings are rejected with a clear message.
- **Secure auth:** Better Auth with email/password and Google, session in an HTTPOnly cookie, JWT checked by the server (401 if invalid).
- **Password rules:** at least 6 characters, one uppercase and one lowercase letter.
- **Reviews and ratings:** guests can rate and review studios.
- **Saved studios:** heart icon to save favourites, shown on the wishlist page.
- **PDF invoice:** download a receipt for confirmed bookings.
- **Dark / light theme** toggle, responsive layout, toast notifications, skeleton loaders, custom 404 page.

## Tech Stack

- **Client:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Swiper, Sonner, React Hook Form, Zod, jsPDF
- **Auth:** Better Auth, MongoDB adapter, Google OAuth, JWT
- **Server:** Express.js, MongoDB (see server repo)
- **Hosting:** Vercel

## Local Setup

```bash
git clone https://github.com/mdriyan143/studio-space.git
cd studio-space
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
```

Start the server repo first (port 8000), then run:

```bash
npm run dev
```

Open http://localhost:3000. Never commit `.env.local`.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/studios` | Explore studios |
| `/studios/[id]` | Studio details |
| `/add-studio` | Add studio (private) |
| `/studios/edit/[id]` | Update studio (private) |
| `/my-listings` | My listings (private) |
| `/my-bookings` | My bookings (private) |
| `/wishlist` | Saved studios (private) |
| `/dashboard` | Dashboard (private) |
| `/login`, `/register` | Auth |
| `/about`, `/how-it-works` | Info pages |




Developed as a creative workspace booking platform for the StudioSpace project assignment.
