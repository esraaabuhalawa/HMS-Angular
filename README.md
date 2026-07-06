# HMS Angular

A modern hotel management system built with Angular 21, featuring a public-facing website, a full authentication flow, and an admin dashboard for managing facilities, rooms, bookings, users, and ads.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-UI-06B6D4)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Internationalization](#internationalization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Demo Admin Access](#demo-admin-access)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

HMS Angular is designed to serve two distinct audiences from a single codebase:

- **Guests** browsing the public website for rooms, facilities, and services
- **Administrators** managing day-to-day hotel operations through a dedicated dashboard

The app is built to be fast, responsive, and fully bilingual (Arabic / English), with RTL support baked in for Arabic locales.

## Features

- 🏨 **Public Website** — browse rooms, facilities, and hotel services
- 🔐 **Authentication** — sign up, sign in, and account management flows
- 📊 **Admin Dashboard** — manage rooms, bookings, users, facilities, and ads
- 🌍 **Multi-language Support** — English and Arabic via `ngx-translate`, with RTL layout support
- 📱 **Responsive UI** — built with PrimeNG components and Tailwind CSS utilities
- ⚡ **Modern Angular** — standalone components and the latest Angular APIs

## Tech Stack

| Category         | Technology        |
|-------------------|-------------------|
| Framework          | Angular 21        |
| Language           | TypeScript        |
| UI Components      | PrimeNG           |
| Styling            | Tailwind CSS      |
| Reactive State     | RxJS              |
| Localization       | ngx-translate     |
| Routing            | Angular Router    |
| Icons              | Font Awesome      |

## Project Structure

```text
src/
├── app/
│   ├── features/
│   │   ├── Auth/          # Authentication screens and services
│   │   ├── Dashboard/     # Admin dashboard modules
│   │   └── Website/       # Public website modules
│   └── shared/            # Shared components, layouts, and reusable UI
└── environments/          # Environment configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (comes bundled with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd hms-angular
npm install
```

> If you run into peer dependency conflicts, use:
> ```bash
> npm install --legacy-peer-deps
> ```

### Run the Development Server

```bash
npm start
```

Then open your browser at:

```text
http://localhost:4200/
```

The app will automatically reload if you change any source files.

## Environment Configuration

The app uses Angular's environment files to configure API endpoints and asset URLs. These live in `src/environments/`:

```text
src/environments/
├── environment.ts           # Development config
└── environment.prod.ts      # Production config
```

Update the relevant file to point the app at a different backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-api-url.com',
  assetsUrl: 'https://your-assets-url.com'
};
```

## Available Scripts

| Command             | Description                                  |
|----------------------|-----------------------------------------------|
| `npm start`          | Run the dev server at `localhost:4200`        |
| `npm run build`      | Build the app for production                  |
| `npm test`           | Run the unit test suite                        |
| `npm run watch`      | Build in watch mode for development            |

## Internationalization

The app supports English and Arabic out of the box using `ngx-translate`. Translation files are typically located under `src/assets/i18n/`. Arabic includes full RTL layout support to ensure a native reading experience for Arabic-speaking users.

## Testing

Run the unit test suite with:

```bash
npm test
```

## Deployment

For production builds:

```bash
npm run build
```

The compiled output will be placed in the `dist/` directory, ready to be served by any static file host or CDN. If deploying to a platform like Vercel or Netlify, make sure your routing configuration falls back to `index.html` so Angular's client-side router can handle deep links correctly.

## Demo Admin Access

For evaluation purposes, a demo admin account is available in non-production environments:

- **Email:** `esr.saad123@gmail.com`
- **Password:** *2@Direction*


After signing in, navigate to the dashboard area to explore the admin features.

## Contributing

Contributions are welcome! Please open an issue to discuss any major changes before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch and open a PR

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

