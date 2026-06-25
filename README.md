# 💰 FinTrack — Personal Finance Tracker

> A full-stack personal finance tracker built with React, TypeScript, Flask, and MySQL.
>
> **Author:** Ibrahim Fayyad — [github.com/ibrahimf90](https://github.com/ibrahimf90)

---

## 🖥️ Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend  | Python Flask REST API                       |
| Database | MySQL                                       |
| Charts   | Recharts                                    |
| Icons    | Lucide React                                |

---

## ✨ Features

- 📊 **Dashboard** — Total balance, income, and expenses at a glance
- 🥧 **Pie Chart** — Visual breakdown of spending by category
- ➕ **Add Transactions** — Income or expense with category, amount, description, and date
- ✏️ **Edit Transactions** — Update any transaction via modal popup
- 🗑️ **Delete Transactions** — Remove any transaction instantly
- 🔍 **Filter** — Filter by type (income/expense) or category
- 💾 **Persistent Data** — All data saved in MySQL via Flask API
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 📁 Project Structure

```
fintrack/
├── backend/
│   ├── app.py              # Flask REST API
│   ├── schema.sql          # MySQL database schema + seed data
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (DB config)
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── types.ts
        ├── api.ts
        └── components/
            ├── Dashboard.tsx
            ├── SpendingChart.tsx
            ├── TransactionForm.tsx
            └── TransactionList.tsx
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL (WAMP / XAMPP / native)

---

### 1️⃣ Database Setup

1. Start your MySQL server (WAMP)
2. Open `http://localhost/phpmyadmin`
3. Click the **SQL** tab
4. Paste the content of `backend/schema.sql` and click **Go**

---

### 2️⃣ Backend Setup

```bash
cd fintrack/backend
```

Edit `.env` and set your MySQL password (leave empty for WAMP default):

```
MYSQL_PASSWORD=
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

Flask will run at: `http://localhost:5000`

---

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd fintrack/frontend
npm install
npm run dev
```

Open your browser at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint                          | Description           |
| ------ | --------------------------------- | --------------------- |
| GET    | `/api/transactions`               | Get all transactions  |
| GET    | `/api/transactions?type=expense`  | Filter by type        |
| GET    | `/api/transactions?category=Food` | Filter by category    |
| POST   | `/api/transactions`               | Add a new transaction |
| DELETE | `/api/transactions/<id>`          | Delete a transaction  |
| GET    | `/api/summary`                    | Get balance & totals  |
| GET    | `/api/health`                     | Health check          |

---

## 📦 Categories

`Salary` · `Food` · `Rent` · `Transport` · `Entertainment` · `Health` · `Shopping` · `Other`

---

## 🌐 Environment Variables

| Variable       | Default   | Description    |
| -------------- | --------- | -------------- |
| MYSQL_HOST     | localhost | MySQL host     |
| MYSQL_USER     | root      | MySQL username |
| MYSQL_PASSWORD |           | MySQL password |
| MYSQL_DB       | fintrack  | Database name  |
| MYSQL_PORT     | 3306      | MySQL port     |

---

## 📸 Screenshots

> Dashboard with balance cards, pie chart, transaction form, and filterable transaction list.

---

## 📄 License

MIT License © 2025 Ibrahim Fayyad
