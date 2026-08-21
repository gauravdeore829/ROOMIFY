# RoomEase – Smart & Verified Room Rental and Accommodation Finder

> **"Find the right room before you visit."**

RoomEase is a full-stack accommodation discovery platform for students and working professionals. It empowers users to search, filter, compare, and apply for verified rooms, PGs, and apartments with AI-driven recommendations, interactive maps, database-backed notifications, and role-based access control (User, Owner, Admin).

---

## 🌟 Key Features

### 👤 User Features
- **Smart & Filtered Search:** Search by city, location, budget, room type (Single, 2-Sharing, etc.), and amenities.
- **AI Recommendation Engine:** Get personalized match scores based on your budget, preferred distance, and room preferences.
- **Natural Language Search:** Express your needs in plain language (e.g. *"Single room near college under 6000 with wifi and AC"*).
- **Interactive Maps:** View listing locations on OpenStreetMap powered by Leaflet.
- **Room Applications & Favorites:** Apply for rooms directly, view application status real-time, and shortlist favorite properties.
- **Reviews & Ratings:** Multi-category detailed reviews (Cleanliness, Location, Safety, Facilities, Owner behavior, Value).

### 🏠 Owner Features
- **Property & Room Management:** Full CRUD controls for properties, total beds, occupied beds, rent, deposits, amenities, and house rules.
- **Automated Occupancy Logic:** Real-time calculation of available vs occupied beds to prevent overbooking.
- **Application Portal:** Review and accept/reject tenant applications with automatic notifications.
- **Verification Submissions:** Submit owner details and property documents for Admin approval.
- **Analytics Dashboard:** Track properties, occupied beds, pending applications, and average ratings.

### 🛡️ Admin Features
- **Verification Portal:** Inspect and approve/reject Owner verification and Property listing requests.
- **System Analytics & Charts:** Comprehensive visual metrics for users, owners, active rooms, and pending reports using Recharts.
- **Content & User Moderation:** Suspend abusive accounts, manage reported listings, and moderate inappropriate reviews.

---

## 🏗️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Leaflet, Recharts, Axios.
- **Backend:** Node.js, Express.js, Prisma ORM, JWT Authentication, bcryptjs, express-validator.
- **Database:** PostgreSQL (with Prisma seed data).
- **AI Microservice:** Python 3.10+, FastAPI, Weighted Scoring Engine, Heuristic Rule NLP Parser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **User (Student)** | `student@example.com` | `Demo@12345` | Public & User Dashboard |
| **Property Owner** | `owner@example.com` | `Demo@12345` | Owner Portal & Property Management |
| **System Admin** | `admin@example.com` | `Demo@12345` | Admin Controls & Verification |

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL installed & running locally (or via Docker)

### 1. Database & Backend Setup

```bash
cd backend
npm install
```

Copy environment variables:
Create `.env` file in `backend/` based on `.env.example`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/roomease?schema=public"
PORT=5000
JWT_SECRET="roomease_super_secret_jwt_key_2026"
AI_SERVICE_URL="http://localhost:8000"
```

Run migrations & seed initial demo data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Start the Express backend:
```bash
npm run dev
```

---

### 2. AI Recommendation Service Setup

```bash
cd ai-service
pip install -r requirements.txt
python run.py
```
*(Runs FastAPI server on `http://localhost:8000`)*

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*(Opens web app at `http://localhost:5173`)*

---

## 🌐 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | User/Owner Registration |
| `POST` | `/api/auth/login` | JWT Authentication |
| `GET` | `/api/properties` | Filtered Property Listing Search |
| `GET` | `/api/properties/:id` | Full details, rooms, rules & reviews |
| `POST` | `/api/applications` | Submit room application |
| `POST` | `/api/recommendations` | AI weighted match scoring |
| `POST` | `/api/ai/search` | NLP Search query parser |
| `GET` | `/api/admin/dashboard` | Admin analytics & counts |

---

## 📄 License
MIT License. Built for students and room seekers.
