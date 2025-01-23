
# Full-Stack React + Express Application

A modern full-stack web application built with React, Express, and TypeScript, featuring a comprehensive UI component library built with Shadcn/UI and Tailwind CSS.

## Features

- **Frontend Stack**
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - Shadcn/UI components
  - Wouter for routing
  - React Query for data fetching
  - Theme switching (light/dark mode)
  - Toast notifications

- **Backend Stack**
  - Express.js with TypeScript
  - Built-in API logging
  - PostgreSQL database with Drizzle ORM
  - Session-based authentication with Passport.js

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://0.0.0.0:5000`

## Project Structure

- `/client` - React frontend application
  - `/src/components` - UI components and shared components
  - `/src/pages` - Application pages/routes
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and configurations

- `/server` - Express backend application
  - `index.ts` - Server entry point
  - `routes.ts` - API route definitions
  - `vite.ts` - Development server configuration

- `/db` - Database schema and configurations

## Production

To build for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Technology Stack

- React 18+
- Express 4+
- TypeScript
- Tailwind CSS
- Shadcn/UI
- PostgreSQL
- Drizzle ORM
- Vite
