# Visitor Management System (VMS)

A complete Visitor Management System built with a feature-based architectural pattern on the backend (Node.js/Express) and a modern, dynamic frontend (React/TailwindCSS/Zustand).

## Architecture overview

The application is split into two parts:
1. **Backend**: A REST API built using Express.js and Mongoose, using a domain-driven feature folder structure (`src/features/`).
2. **Frontend**: A React application using Vite, styled with Tailwind CSS v4 and managed state via Zustand.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017/vms` or provide a `MONGO_URI` in `.env`)

### Setup the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example or use the defaults:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/vms
   JWT_SECRET=supersecretjwtkey12345
   CLIENT_URL=http://localhost:5173
   ```
4. Seed the initial admin user:
   ```bash
   node src/seed_data/adminSeeder.js
   ```
   *This creates an admin with email `admin@vms.com` and password `password123`.*
5. Start the server:
   ```bash
   npm run dev
   ```

### Setup the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Application Flow
1. **Login**: Access the application via `http://localhost:5173`. Sign in with the seeded admin credentials.
2. **Dashboard**: View high-level statistics for visitor passes and current check-ins.
3. **Settings**: Admin must first configure `Setting Templates` and `Setting Values` (Locations, Visit Purposes, Departments) so they can be selected when creating Gate Passes.
4. **Users**: Manage employees and system users.
5. **Gate Passes**: Create single-day or multi-day passes, attach visitor details, and track their Check-in/Check-out status.

## Technologies Used
- **Backend**: Express, Mongoose, Zod (Validation), JWT (Auth), Morgan & Winston (Logging).
- **Frontend**: React 19, Tailwind CSS v4, React Router v7, Zustand, Axios.
