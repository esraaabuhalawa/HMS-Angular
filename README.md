# HMS Angular

A modern Angular 21 hotel management system with a public website, authentication flow, and an admin dashboard for managing facilities, rooms, bookings, users, and ads.

## Overview

This application is designed to support both customers and administrators:

- Public website experience for browsing rooms and hotel services
- Authentication and account management for users
- Admin dashboard for operational management
- Multi-language support with Arabic and English
- Responsive UI built with Angular and PrimeNG

## Tech Stack

- Angular 21
- TypeScript
- PrimeNG
- Tailwind CSS
- RxJS
- ngx-translate
- Angular Router
- Font Awesome

## Project Structure

- src/app/features/Auth - authentication screens and services
- src/app/features/Dashboard - admin dashboard modules
- src/app/features/Website - public website modules
- src/app/shared - shared components, layouts, and reusable UI
- src/environments - environment configuration

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (recommended: 20+)
- npm

### Installation

```bash
npm install
```

### Run the development server

```bash
npm start
```

Then open your browser at:

```text
http://localhost:4200/
```

### Build for production

```bash
npm run build
```

## Demo Admin Access

To explore the admin area, you can use the following demo credentials:

- Email: esr.saad123@gmail.com
- Password: 2@Direction

After signing in, navigate to the dashboard area to view the admin features.

## Testing

Run the test suite with:

```bash
npm test
```

## Notes

The app uses environment-based configuration for API and asset URLs. Update the values in the environment files if you need to point the app to a different backend.
