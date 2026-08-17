# SmartBudget 💰

A full-stack personal finance web app that helps you track expenses, visualise spending patterns, and get AI-powered financial advice — all in one place.

---

## Features

### Dashboard (Home)
- **Budget Summary Card** — shows total spent this month, remaining balance, and a live progress bar that turns red when you're over budget
- **Category Spending** — colour-coded breakdown of spending per category with per-category budget limits
- **Recent Transactions** — quick list of your latest expenses with delete support

### Add Expense
- Log expenses with amount, category, title, date, and optional note
- 9 built-in categories (Food, Groceries, Transport, Entertainment, Shopping, Health, Bills, Travel, Other)
- Inline form validation before submission

### Analytics
- **Monthly trend bar chart** — last 6 months of spending at a glance
- **Spending by category pie chart** — visual share of each category
- **Category breakdown table** — per-category spent vs. limit with progress bars and over-budget warnings
- **Stat cards** — total spent, remaining, savings rate %, and 6-month average

### AI Assistant (Gemini-powered)
- Floating chat widget on the home screen
- Answers questions about your actual spending data (not generic advice)
- Persists chat history in `localStorage` per user
- Supports multi-turn conversations with proper history management
- One-tap suggestion prompts on fresh chat
- Clear history button

### Profile & Settings
- Edit your name, email, monthly budget, and currency
- Set individual spending limits per category
- Supports USD, EUR, GBP, CAD, AUD, INR
- Sign out

### Auth
- Register / Login with JWT-based authentication
- New accounts get 9 default categories pre-seeded with sensible limits
- Protected routes — unauthenticated users are redirected to login

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Bar & pie charts |
| Axios | HTTP client |
| react-markdown | Render AI replies as Markdown |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Stateless auth |
| bcryptjs | Password hashing |
| Google Generative AI SDK | Gemini AI integration |
| dotenv | Environment variable management |

### Deployment targets
- **Frontend** — Vercel
- **Backend** — Render (or any Node host)
- **Database** — MongoDB Atlas

---

## Project Structure

```
smart-budget-app/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT protect middleware
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── auth.js          # register / login / logout
│   │   ├── transactions.js  # CRUD for expenses
│   │   ├── budget.js        # monthly budget data
│   │   ├── analytics.js     # charts & trend data
│   │   ├── profile.js       # user settings
│   │   └── ai.js            # Gemini chat endpoint
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        ├── pages/           # Home, AddExpense, Analytics, Profile, Login, Register
        ├── components/      # BudgetSummary, CategorySpending, RecentTransactions, AIChat, AIChatButton
        ├── context/         # AuthContext, ThemeContext
        ├── hooks/           # useBudgetData
        ├── services/        # api.js (Axios instance)
        └── utils/           # currency helpers
```

---

## How I Built It

1. **Backend first** — set up Express with Mongoose models for `User`, `Transaction`, and `Category`. Auth is handled with JWT (`jsonwebtoken`) and passwords are hashed with `bcryptjs`. On registration, 9 default categories are seeded for each new user.

2. **AI route** — the `/api/ai/chat` endpoint fetches the user's real financial data (monthly totals, category breakdown, budget remaining) and injects it as a system prompt into Gemini. This makes every AI reply context-aware rather than generic.

3. **Frontend** — built with React + Vite. A single `useBudgetData` hook fetches all the data the app needs (user info, transactions, categories, monthly trend) and passes it as props down to each page. React Router handles navigation between Home, Analytics, Add Expense, and Profile.

4. **Charts** — Recharts renders the bar chart (monthly trend) and pie chart (category split) on the Analytics page.

5. **Responsive layout** — sidebar navigation on desktop, bottom tab bar on mobile, using Tailwind breakpoints.

6. **Deployment** — frontend deployed to Vercel, backend to Render, database on MongoDB Atlas.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the repo

```bash
git clone https://github.com/your-username/smart-budget-app.git
cd smart-budget-app
```

### 2. Set up the backend

```bash
cd smart-budget-app/backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Register an account

Head to `/register`, create an account, and you're ready to go. Your account comes pre-loaded with 9 spending categories.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Add transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/analytics` | Charts & trend data |
| GET | `/api/budget` | Budget summary |
| GET/PUT | `/api/profile` | User settings |
| POST | `/api/ai/chat` | AI chat (Gemini) |

All routes except auth require a `Bearer <token>` header.

---

## Environment Variables

### Backend (`.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLIENT_URL` | Frontend URL for CORS (e.g. Vercel URL) |

### Frontend (`.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## License

MIT
