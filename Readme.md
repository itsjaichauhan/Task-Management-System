
# Task Management System – Setup Guide

## 📌 Requirements
- Node.js 18+
- npm / yarn / pnpm
- SQLite (no install needed — Prisma manages it)
- Backend & Frontend run separately

---

# 🚀 Backend Setup (Express + TypeScript + Prisma)

## 1️⃣ Install dependencies
```sh
cd backend
npm install
```

## 2️⃣ Set up environment variables
Create a `.env` file in the `backend` folder:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"
PORT=5000
```

✔ Replace `your_jwt_secret_here` with a strong random string.

---

# 🗂 SQLite Setup (Prisma)

### 1️⃣ Push the schema to create the SQLite DB
```sh
npx prisma db push
```

### 2️⃣ (Optional) View DB in Prisma Studio
```sh
npx prisma studio
```

This opens a UI to inspect the SQLite database.

---

# ▶ Run Backend
```sh
npm run dev
```
Runs TypeScript backend in watch mode.

To run compiled JS:
```sh
npm run build
npm start
```

---

# 💻 Frontend Setup (Next.js)

## 1️⃣ Install dependencies
```sh
cd frontend
npm install
```

## 2️⃣ Environment variables for frontend
Create a `.env.local` in `frontend`:

```
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

---

# ▶ Run Frontend (Next.js)
```sh
npm run dev
```

Then visit:
```
http://localhost:3000
```

---

# 📦 Build for Production

### Backend:
```sh
npm run build
npm start
```

### Frontend:
```sh
npm run build
npm start
```

---

# ✅ Project Structure

```
task-management-system/
 ├── backend/
 │    ├── src/
 │    ├── prisma/
 │    ├── package.json
 │    └── .env (you create)
 ├── frontend/
 │    ├── app/
 │    ├── components/
 │    ├── package.json
 │    └── .env.local (you create)
 └── README.md
```

---

# 🎯 Notes
- SQLite DB is stored at: `backend/prisma/dev.db`
- Backend must be running before frontend
- Update API URL if backend runs on a different port
- Use Prisma Studio to easily manage DB

---

# 🙌 Done!
Your Task Management System is ready to run.
