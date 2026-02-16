# AtomicStore Dashboard

## Overview
AtomicStore Dashboard is a Vite + React + TanStack Router application for managing an e-commerce store. It features product management, orders, categories, tags, coupons, images, and shipping settings.

## Recent Changes (Feb 16, 2026)
- Created Orders feature (`src/features/orders/`) with adapters, hooks, types - real API integration
- Created Shipping feature (`src/features/shipping/`) with 6 adapters and 6 hooks for methods/settings CRUD
- Refactored `orders.tsx` to use real API data via `useOrders()` hook (removed mock JSON)
- Refactored `settings_.shipping.tsx` to use real API via shipping hooks
- Refactored `products_.add.tsx` from 1443 → 611 lines by extracting 4 components:
  - `product-video-section.tsx`, `product-variants-section.tsx`, `variant-edit-drawer.tsx`, `variant-image-picker-drawer.tsx`
- Configured for Replit environment with proper host settings
- Removed `@tailwindcss/vite` plugin (causes extreme CPU in Replit) - using `@tailwindcss/postcss` instead
- Removed TanStack Router Vite plugin (causes extreme CPU) - route tree is pre-generated
- Added `source("../src")` directive to `styles.css` to limit Tailwind v4's file scanning scope
- Downgraded Vite from v7.x to v5.4.21 for compatibility

## Architecture
- **Framework**: React with TanStack Router (file-based routing)
- **Styling**: Tailwind CSS v4 via PostCSS (NOT Vite plugin)
- **Build Tool**: Vite 5.4.21
- **State/Data**: TanStack React Query
- **Routes**: Pre-generated in `src/routeTree.gen.ts` - dynamic `/$store` parameter routes
- **Entry**: `src/main.tsx` -> renders `RouterProvider`

## Key Configuration Notes
- **Tailwind CSS**: Must use `@tailwindcss/postcss` (not `@tailwindcss/vite`) to avoid CPU issues
- **TanStack Router Plugin**: Must NOT be included in `vite.config.ts` - causes runaway CPU. Routes are pre-generated.
- **Source Scanning**: `styles.css` uses `@import "tailwindcss" source("../src")` to limit Tailwind's file scanning
- **Server**: Bound to `0.0.0.0:5000` with `allowedHosts: true`

## Project Structure
- `src/routes/` - TanStack Router file-based routes
  - `__root.tsx` - Root layout
  - `$store/_layout/` - Store dashboard pages (products, orders, categories, etc.)
  - `_auth/` - Authentication pages (signin)
- `src/features/` - Feature modules (adapters + hooks + types pattern)
  - `orders/` - Order listing, detail, status updates
  - `shipping/` - Shipping methods & settings CRUD
  - `products/` - Product form, components (video, variants, drawers)
  - `categories/`, `tags/`, `coupons/`, `images/` - Other features
- `src/routeTree.gen.ts` - Auto-generated route tree (do NOT edit manually)
- `vite.config.ts` - Vite configuration (React plugin only)
- `postcss.config.mjs` - PostCSS config with Tailwind CSS

## Running
- Workflow: `npx vite --host 0.0.0.0 --port 5000`
- URL pattern: `/<store-name>` (e.g., `/demo-store`)

## Authentication
- Uses `better-auth` client library with bearer token authentication
- Tokens are stored in localStorage (`auth_bearer_token`) to work around cross-origin cookie restrictions in Replit's iframe/proxy environment
- `src/lib/auth.ts` - Auth client with token storage helpers
- `src/hooks/use-auth.ts` - React hook for auth state, sign-in, sign-out
- `src/services/api.ts` - Axios client with bearer token interceptor
- `src/lib/auth-utils.ts` - Utility functions for session/auth checks
- Backend API: `VITE_API_URL` env var (https://api.oatomicstore.com)

## User Preferences
- Language: Portuguese (BR)
