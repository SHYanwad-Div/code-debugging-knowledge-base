# Code Debugging Knowledge Base

Project skeleton: Flask backend (API) + React frontend (Vite). This repo contains the Day 1 setup (health checks, venv, frontend scaffold).

## How to run (Day 1)
Backend:
cd backend
python -m venv venv
# activate venv (platform-specific)
pip install -r requirements.txt
python app.py

Frontend:
cd frontend
npm install
npm run dev
# Code Debugging Knowledge Base – Day 2

## 📌 Purpose
Set up the backend using Flask and SQLite with basic CRUD APIs.

---

## ✅ Progress
- Initialized **Flask app** with `flask_sqlalchemy`.
- Added **CORS** to allow frontend requests.
- Created `Issue` model:
  - `id`, `title`, `description`, `solution`, `language`, `tags`.
- Implemented CRUD endpoints:
  - `GET /api/issues` → fetch all issues.
  - `POST /api/issues` → add new issue.
  - `PUT /api/issues/<id>` → update issue.
  - `DELETE /api/issues/<id>` → delete issue.
- Added `/api/health` for backend health check.

---

## 🛠️ How to Run
```sh
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt

# start backend
python app.py

---

## 📄 `README-Day3.md`
```md
# Code Debugging Knowledge Base – Day 3

## 📌 Purpose
Set up the frontend with React (Vite) and connect to backend APIs.

---

## ✅ Progress
- Bootstrapped **Vite React app** in `frontend/`.
- Added core components:
  - `Header` → App title.
  - `SearchBar` → Search/filter issues.
  - `IssueList` → Show issues with edit/delete buttons.
  - `AddIssueForm` → Submit new issues.
- Connected frontend to backend APIs using `fetch`.
- Implemented basic search functionality.

---

## 🛠️ How to Run
```sh
cd frontend
npm install
npm run dev

---

## 📄 `README-Day4.md`
```md
# Code Debugging Knowledge Base – Day 4

## 📌 Purpose
Polish the UI, improve error handling, and prepare for deployment.

---

## ✅ Progress
- Added **styling** (`App.css`):
  - Responsive layout with spacing & grid.
  - Styled buttons, forms, and list items.
- Introduced **.env support**:
  - `VITE_API_BASE=http://127.0.0.1:5000/api`
  - `App.jsx` uses `import.meta.env.VITE_API_BASE`.
- Improved UX:
  - Show error messages in red if API fails.
  - Disable “Add Issue” button while saving.
  - Optimistic updates when adding issues.
- Verified `.gitignore` excludes:
  - `node_modules`, `dist`, `.env`.

---

## 🛠️ How to Run
```sh
# Backend
cd backend
python app.py

# Frontend
cd frontend
npm run dev
