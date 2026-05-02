
---

# DBSight Frontend ⚡

Frontend for DBSight — an AI-powered interface to query databases using natural language.

Built with React + Vite and deployed on Vercel.

---
# Demo

https://github.com/user-attachments/assets/b64fb8d0-c6c7-4751-824c-32069ea1fff8

[screen-capture (1).webm](https://github.com/user-attachments/assets/ff78da88-b28d-4477-94a4-c97282eec494)

---

## 🧠 What This Does

Provides a UI where users can:
- Enter natural language queries
- View generated SQL
- See results in table format
- Handle errors & rate limits
- Interact with backend APIs seamlessly

---

## 🛠️ Tech Stack

- React (Vite)
- Tailwind CSS
- MUI
- react RTK (API calls)
- Vercel (Deployment)

---

## 🎯 Features

### 🔹 AI Query Interface
- Input box for natural language
- Sends prompt to backend
- Displays SQL + results

### 🔹 Error Handling
- Handles:
  - API failures
  - Rate limits
  - Invalid queries

### 🔹 Clean UI
- Minimal distraction
- Focused on productivity

### 🔹 Backend Proxying
- Routes `/api/*` to backend VPS

---

## ⚙️ Setup

### 1. Clone Repo

git clone https://github.com/your-username/dbsight-fe.git

cd dbsight-fe

npm install

npm run dev

