# Veronica's Library Management System

A modern Library Management System featuring a full-stack architecture using Node.js, Express, MongoDB (Backend) and React, Tailwind CSS, Redux (Frontend).

## 🚀 Unique Selling Point
- **Real-time availability sync** with borrowing operations.
- **Modern AI-ready architecture** primed for user-borrowing history recommendations.
- Built for seamless transition from local JSON testing to full **MongoDB Atlas cloud hosting**.

## 🏗️ Architecture Stack
- **Database**: MongoDB via Mongoose ODM connected to `lmsdb` via Compass
- **Backend**: Node.js/Express.js MVC (Models, Views/Routes, Controllers)
- **Frontend**: React + Vite, styled securely & beautifully with Tailwind CSS
- **State Management**: Redux Toolkit for seamless frontend operations

## 💼 Business Rules
1. **Borrow Limit**: Users can borrow a maximum of 5 books concurrently.
2. **Fine Calculation**: Books overdue trigger a $1 per day fine after the 7-day initial borrow period.
3. **Availability State**: `availableCopies` track active inventory when users issue/return books. Max value is strictly bounded by `totalCopies`.
4. **Role Checks**: Only Admin identities can add/remove books; standard users access the Catalog for exploring & borrowing.

## 🛠️ Usage / Run Instructions

### 1. Database Setup
1. Download **MongoDB Compass** and start a local database.
2. Connection string standard: `mongodb://localhost:27017/lmsdb`.

### 2. Backend API
```sh
cd backend
npm install
npm run dev
```
*API will run on `http://localhost:5000`.*

**Available Enpoints**:
- `POST /api/v1/auth/register` : User Registration
- `POST /api/v1/auth/login` : Connect & get JWT Token
- `GET /api/v1/books` : Catalog browsing / search queries
- `POST /api/v1/transactions/issue` : Borrow a book
- `POST /api/v1/transactions/return` : Return a book (initiates Fine checks)

### 3. Frontend App
```sh
cd frontend
npm install
npm run dev
```
*Frontend runs beautifully styled with Tailwind CSS on `http://localhost:5173`.*

## 🛣 Next Steps for CI/CD Deployment
- Deploy via Vercel for Frontend
- Deploy via Render for Backend REST API
- MongoDB Atlas configuration via `.env` variables (`MONGODB_URI`)
