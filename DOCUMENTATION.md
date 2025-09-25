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
