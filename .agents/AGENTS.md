# Project Guidelines & AI Assistant Rules

## Strict Architecture & Data Storage Policy

1. **Backend Data Primacy (`backend/Data/` & Supabase)**:
   - ALL application data, datasets, mock object arrays, and database schemas MUST reside exclusively inside the **`backend/`** directory (under `e:\Projects-xyz\schollege-ms\backend\Data\`) or within **Supabase PostgreSQL** tables.
   - NEVER create or store mock datasets, inline data arrays, or data files inside the `frontend/` directory.

2. **Frontend Pure UI Role (`frontend/src/`)**:
   - The `frontend/` codebase is strictly reserved for user interface components, pages, styling, layout boundaries, and dynamic `fetch()` requests.
   - All role dashboards (Student, Admin, Teacher, Parent) must retrieve their data asynchronously via backend REST API routes (`/api/...`) or Supabase PostgreSQL SDK clients.
   - Do NOT use browser `localStorage` for primary application data storage.

3. **Styling & Design Constraints**:
   - All card containers, popovers, headers, modals, and buttons must use `rounded-md` corner radius.
   - Always enforce high visual contrast (`bg-black text-white` for active selections, `text-gray-900` for clear visibility).
