# Documentation — Day 1 (22-Sept-2025)

## Project
Code Debugging Knowledge Base

## Day 1 Objectives
- Initialize repo and project folders
- Setup backend skeleton (Flask health endpoint)
- Setup frontend skeleton (React + Vite)
- Document actions and verify local run

## Commands executed
See the Day 1 log in the Word doc.

## Verification
- Backend health endpoint:
  GET /api/health -> {"status":"ok"}
- Frontend: Vite development server responding (http://localhost:5173)

## Next steps
1. Replace minimal backend with full CRUD + seed data.
2. Implement frontend components: SearchBar, IssueList, AddIssueForm.
3. Add naive `suggest` endpoint and then upgrade to embeddings/FAISS.
4. Dockerize full app.
## Sept 24 — Backend API & Frontend Integration (Day 2)

**Objective:** Extend the project with a working Flask backend (CRUD + suggest) and connect the React frontend so the app can store and retrieve debugging solutions.

### What I implemented
**Backend**
- Flask app with SQLAlchemy `Issue` model (fields: `id`, `title`, `description`, `tags`, `solution`, `created_at`).
- CRUD endpoints:
  - `GET /api/health` — health check
  - `GET /api/issues` — list (supports optional `q` search param)
  - `POST /api/issues` — create new issue
  - `GET /api/issues/<id>` — read one
  - `PUT /api/issues/<id>` — update existing
  - `DELETE /api/issues/<id>` — delete
  - `GET /api/suggest?q=` — keyword suggestions from issues
- CORS enabled (`CORS(app)`) for frontend-backend communication.
- Database initializes automatically when running `python app.py`. Issues can be added manually using API requests.

**Frontend**
- `frontend/src/api.js`: axios wrapper with functions (`listIssues`, `createIssue`, `getIssue`, `updateIssue`, `deleteIssue`, `suggest`).
- Components built:
  - `SearchBar`, `IssueList`, `AddIssueForm`, `IssueCard`.
- Frontend now fetches issues from backend and allows creating new ones.
- Dashboard layout styled with defensive coding (no crashes when fields are missing).

### How to run
1. **Backend**
   ```bash
   cd backend
   .\venv\Scripts\activate
   python app.py
## 25 sept -- git basics & branches (Day 3)
## tasks completed
1. **Git Basics**
   - Initialized a Git repository using `git init`.
   - Learned to stage changes with `git add` and commit using `git commit`.
   - Checked repository status with `git status` and viewed commit history using `git log`.
   - Practiced organizing project files and tracking daily work using Git.
## Day 4 – Styling Polish & Deployment Prep
- **Purpose**: Improve UI/UX and prepare for deployment.
- **Progress**:
  - Added `App.css` with responsive styling (grid, spacing, button styles).
  - Introduced `.env` support:
    - `VITE_API_BASE` → API base URL, with fallback `http://127.0.0.1:5000/api`.
    - Updated `App.jsx` to use `API_BASE` from env.
  - Error handling & UX improvements:
    - Show red error text if API fails.
    - Optimistic UI updates when adding issues.
    - Disable “Add New Issue” button while saving.
  - Verified `.gitignore` excludes `node_modules`, `dist`, `.env`.
- **Verification**:
  - `npm run dev` → frontend runs at `http://localhost:5173`.
  - `flask run` → backend runs at `http://127.0.0.1:5000`.
  - Issues load, search works, add/edit/delete works with polished styling.