# Safro Vercel deployment

This package contains an explicit static deployment path for Vercel.

1. Push the complete project to the Git repository connected to Vercel.
2. Confirm Vercel is deploying the branch configured as the Production Branch.
3. Vercel should read `vercel.json`, run `npm run build:vercel`, and publish `dist`.
4. Redeploy without the existing build cache once after this update.
5. Open `/deploy-version.json` on the deployed domain. It must show version `8.4-immersive-20260721`.
6. Hard-refresh the browser or remove the old Safro service worker/site data once.

The Supabase browser key is already configured in `public/assets/js/core.js`. The `safaro_store` table and appropriate Row Level Security policies must exist in Supabase.
