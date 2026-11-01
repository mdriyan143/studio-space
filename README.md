# StudioSpace — Creative Studio Booking Platform

**Live Website:** https://studio-space-mdriyan143.vercel.app/

**Client Repository:** https://github.com/mdriyan143/studio-space

## About the Project

StudioSpace is a peer-to-peer creative workspace booking platform that connects creators with studio owners. It allows photographers, filmmakers, musicians, podcasters, and other creative professionals to discover, explore, and book suitable creative spaces.

Studio owners can list and manage their studios, while creators can browse available workspaces, make reservations, manage bookings, and save their favorite studios.

## Key Features

- **Studio Discovery:** Explore creative workspaces, including photography studios, film stages, podcast rooms, music suites, and workshops.
- **Studio Management:** Authenticated users can add, update, and delete their own studio listings.
- **Authentication:** Secure user registration and login with Better Auth, including Google authentication.
- **Studio Booking:** View studio details, select booking dates and times, and submit reservations.
- **Booking Management:** View booking history, check reservation statuses, and cancel eligible pending bookings.
- **Saved Studios Wishlist:** Save favorite studios using the heart button and manage them from the wishlist page.
- **PDF Booking Invoice:** Download PDF invoices for confirmed studio bookings.
- **Dashboard:** Access personalized information about studio listings and bookings.
- **Theme Customization:** Switch between light and dark themes.
- **Responsive Design:** Optimized interface for desktop, tablet, and mobile devices.
- **Notifications:** User-friendly toast notifications for application actions.
- **Studio Reviews:** Explore studio reviews and ratings.


## Examiner Test Credentials

**Website:** https://studio-space-mdriyan143.vercel.app/

**Login Email:** demo@gmail.com

**Login Password:** DEmo1234@

Google authentication is also available.

## Technology Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Swiper.js
- Sonner
- React Hook Form
- Zod

### Backend
- Express.js
- Node.js
- MongoDB
- REST API

### Authentication
- Better Auth
- MongoDB Adapter
- Google OAuth
- JWT

### Additional Tools
- jsPDF (PDF invoice generation)
- Vercel (Frontend Deployment)
- Git & GitHub

## Installation and Local Setup

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mdriyan143/studio-space.git
```

### 2. Navigate to the Client Directory

```bash
cd studio-space
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Use the environment variable names and values configured in your actual deployment and backend. Never commit secret credentials to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/studios` | Explore all studios |
| `/studios/[id]` | Studio details |
| `/add-studio` | Add a new studio |
| `/studios/edit/[id]` | Update a studio |
| `/my-listings` | Manage studio listings |
| `/my-bookings` | Manage reservations |
| `/wishlist` | View saved studios |
| `/dashboard` | User dashboard |
| `/login` | User login |
| `/register` | User registration |
| `/about` | About StudioSpace |
| `/how-it-works` | How the platform works |

## Examiner Test Credentials

**Website:** https://studio-space-mdriyan143.vercel.app/

**Login Email:** demo@gmail.com

**Login Password:** DEmo1234@

Google authentication is also available.


---

Developed as a creative workspace booking platform for the StudioSpace project assignment.
