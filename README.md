PROJECT: SkillVault AI — Personalized Learning Path Generator
BATCH: 22CSEC11
TEAM: Gaddam Abinayateja, Nadakuditi Nani, Gidda Rishendra, Thompala Umesh
GUIDE: Venkata Sandeep Edara

HOW TO RUN:

FRONTEND:
  cd frontend
  npm install
  npm run dev
  Open: http://localhost:3000

BACKEND:
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload
  API runs at: http://localhost:8000

DATASET GENERATION:
  Open dataset_generation/Untitled18.ipynb in Google Colab
  Run all cells with Groq API key

TECH STACK:
  Frontend  : Next.js, TypeScript, Tailwind CSS, Framer Motion
  Backend   : FastAPI, Python, PyPDF2, Sentence Transformers
  Database  : Firebase Firestore, Firebase Auth, Firebase Storage
  AI/LLM    : Groq API (LLaMA 3.3 70B)
  Dataset   : Generated using Groq API in Google Colab
