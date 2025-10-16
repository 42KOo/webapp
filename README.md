# Kubiciranje Paleta

Starter repo for Kubiciranje Paleta (backend, PWA frontend, Expo mobile).

How to run each part:
- Backend: cd backend && cp .env.example .env && npm install && npm run dev
- Web: cd web-frontend && npm install && npm run dev
- Mobile: cd mobile-expo && npm install && npx expo start

This repo was generated automatically.


## Added features
- Export endpoints: GET /api/shipments/export?format=excel|pdf
- GitHub Actions workflow for building and pushing docker images
- Terraform templates expanded with OKE and Autonomous DB resources (template)
- PWA service worker with background sync skeleton and client conflict resolution UI


## Export tests & frontend buttons
- Backend tests: `npm run test` to check Excel/PDF export
- Frontend: Shipments page now has 'Export Excel' and 'Export PDF' buttons
