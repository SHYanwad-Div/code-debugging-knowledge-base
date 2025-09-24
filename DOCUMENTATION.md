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
