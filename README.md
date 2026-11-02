# StudioSpace — Creative Studio Booking Platform

StudioSpace is a peer-to-peer platform where creators can find and book studios (photography, recording, podcast, video, dance, meeting rooms), and studio owners can list and manage their own spaces.

- **Live Site:** https://studio-space-mdriyan143.vercel.app/
- **Client Repo:** https://github.com/mdriyan143/studio-space
- **Server Repo:** https://github.com/mdriyan143/studio_server
- **API:** https://studio-server-zeta.vercel.app/

## Test Credentials

| Email | Password |
|---|---|
| demo@gmail.com | DEmo1234@ |

Google login also works.

## Features

- **Explore studios:** search, filter by category, full details page with gallery, amenities, host info and reviews.
- **Host tools:** add, edit and delete your own listings. Images are uploaded through imgbb.
- **Booking flow:** choose a date and hours, send a request (Pending), and cancel it while it is still pending. The host can confirm, decline or mark it completed.
- **Double-booking protection:** a slot that overlaps a Confirmed booking is rejected with a clear message.
- **Notifications:** bell icon with unread count for booking updates.
- **Reviews and ratings:** guests can review a studio after a completed booking.
- **Saved studios:** heart icon to save favourites, shown on the wishlist page.
- **PDF invoice:** download a receipt for confirmed bookings.
- **Host profile:** public page with name, photo, bio and location (email and phone are never exposed).
- **Auth:** email/password and Google through Better Auth. Password needs 6+ characters with one uppercase and one lowercase letter.
- **UI:** dark/light theme, responsive layout, toasts, skeleton loaders, custom 404 page.

## Tech Stack

| Part | Tools |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Forms and UI | React Hook Form, Zod, Swiper, Embla Carousel, Sonner, date-fns, jsPDF |
| Auth | Better Auth (MongoDB adapter, Google OAuth, JWT plugin) |
| Backend | Express + MongoDB (separate repo) |
| Hosting | Vercel |

## How Auth Works

The session lives in an HTTPOnly cookie. For protected requests the client calls its own `/api/proxy/...`, which gets a JWT from Better Auth and forwards the request to the Express server as a Bearer token. The server checks the token against this app's `/api/auth/jwks` and returns `401` if it is missing or invalid.

## Getting Started

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

Start the server repo first (port 8000), then:

```bash
npm run dev
```

Open http://localhost:3000. Never commit `.env.local`.

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/studios` | Explore studios | Public |
| `/studios/[id]` | Studio details | Public |
| `/hosts/[id]` | Host profile | Public |
| `/login`, `/register` | Auth | Public |
| `/about`, `/how-it-works`, `/privacy`, `/terms` | Info pages | Public |
| `/add-studio` | Add studio | Private |
| `/studios/edit/[id]` | Edit studio | Private |
| `/my-listings` | My listings and incoming bookings | Private |
| `/my-bookings` | My bookings | Private |
| `/wishlist` | Saved studios | Private |
| `/dashboard` | Dashboard | Private |
| `/profile` | Edit profile | Private |

## Project Structure

```text
studio-space/
├── public/studios/        # local images
└── src/
    ├── app/               # pages, plus api/auth, api/hosts, api/proxy
    ├── components/
    │   ├── site/          # app components (header, cards, booking dialog...)
    │   └── ui/            # shadcn/ui components
    └── lib/               # auth, db, api helpers, invoice, imgbb
```

## Related

The REST API is in the [studio_server](https://github.com/mdriyan143/studio_server) repo.

Developed as a creative workspace booking platform for the StudioSpace project assignment.
