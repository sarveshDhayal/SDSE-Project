# 💎 Welcome to Finaura! 

This is a complete, AI-augmented financial intelligence and personal wealth management platform.

This document is written so that anyone—even without a deep background in finance or platform engineering—can understand exactly what this system does, how the parts fit together, and how data moves through the application to empower your financial decisions.

---

## 🎯 What is Finaura?
**Finaura** is an automated financial command center. Instead of manually tracking expenses in a boring spreadsheet or guessing your monthly savings, Finaura rapidly scans your financial behavior for you. It analyzes spending momentum, tracks category-specific budgets, and provides **Aura AI**, an assistant that uses natural language to alert you to overspending risks and financial trends before they impact your net position.

It acts as your personalized, AI-driven portfolio tracking and wealth optimization assistant.

---

## 🏗️ System Architecture
Finaura is split into two primary pieces that communicate seamlessly: the **Frontend** (what you see and touch) and the **Backend** (the brain doing the heavy lifting).

### 1. The Frontend (React/Vite)
- **Role**: Handles the User Interface (UI), dynamic spending charts, high-contrast financial cards, and interactivity.
- **Tech Stack**: **React (TypeScript)** for robust components, **Tailwind CSS** for a premium "dark-mode" aesthetic, **Vite** for ultra-fast compiling, and **Recharts** for interactive financial data visualization.
- **Key Experience**: Features smooth micro-animations powered by **Framer Motion** and responsive navigation for both desktop and mobile layouts.

### 2. The Backend (Node.js / Express)
- **Role**: Acts as the data crunching engine. The frontend asks the backend questions (e.g., "What is my current savings rate?" or "Am I over budget in Food?"), and the backend performs the math, talks to the intelligence models, and sends the answers back.
- **Tech Stack**: **Node.js**, **Express.js** (for efficient request handling), and **TypeScript** for end-to-end type safety.
- **Intelligence Engine**: Integrated **Aura AI Service** for natural language processing of financial queries.
- **Database**: Uses **MySQL** (via **Prisma ORM**) to permanently remember your transactions, budget limits, and user history.

---

## ⚙️ How Data Flows (The Data Pipeline)
How exactly does Finaura decide your financial health? It follows a strict 4-step data pipeline built into the core:

### Step 1: Data Ingestion (Prisma & MySQL)
When you add a transaction, the backend securely stores it in our relational database. All entities (Users, Transactions, Categories, Budgets) are strictly modeled to ensure zero data loss and perfect consistency.

### Step 2: Technical Aggregation (DataAggregationService)
Once we have the raw data, we feed it into our mathematical engine. We calculate several key metrics:
- **Monthly Burn Rate**: Total expenses for the current month.
- **Savings Rate**: The percentage of your income that is successfully retained as wealth.
- **Financial Health Score**: A weighted multi-factor rating from 0 to 100 based on your savings performance.

### Step 3: Central Signal Engine (BudgetMonitor & Observer Pattern)
This is the heart of Finaura's proactive layer. It uses the **Observer Pattern** to monitor spending in real-time.
- **Threshold Detection**: If category spending hits **80%**, the system flags a "Warning". 
- **Breach Alert**: If it hits **100%**, it flags as "Exceeded".
- This ensures you never have to guess how much of your budget "envelope" is left.

### Step 4: AI Intelligence & Reporting (AIService & ReportBuilder)
Finally, Finaura translates numbers into human concepts:
- **Aura Chat**: Processes your natural language query (Step 2+3 data) into a conversational response.
- **Report Generation**: Uses the **Builder Pattern** to construct a comprehensive monthly overview, aggregating statistics and category breakdowns for historical analysis.

---

## 📁 Codebase Structure
If you're looking around the files, here's the mapping of the system's core components:

```text
SDSE-Project/
├── client/                        # 🎨 Frontend (React/Vite)
│   ├── src/
│   │   ├── components/            # UI components (AIAssistant, Card, ProgressBar, etc.)
│   │   ├── pages/                 # Full screen views (Dashboard, Transactions, Budgets, Reports)
│   │   ├── assets/                # Static assets and brand imagery
│   │   ├── App.tsx                # Main application controller and routing
│   │   └── index.css              # Global styles and design system tokens
│   └── package.json               # Frontend dependencies and scripts
│
├── server/                        # 🧠 Backend (Node.js/Express)
│   ├── src/
│   │   ├── auth/                  # Security and User authentication services
│   │   ├── models/                # Domain models (User, Transaction, Budget, Report)
│   │   ├── patterns/              # Design patterns (Observer, ReportBuilder)
│   │   ├── repositories/          # Data access layer including Data Mappers
│   │   ├── services/              # Business logic layer (AIService, BudgetMonitor, etc.)
│   │   ├── tests/                 # System verification and logic tests
│   │   └── index.ts               # Entry point and API endpoint definitions
│   ├── prisma/                    # Database schema and migration management
│   └── package.json               # Backend dependencies and configuration
│
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started Locally
Want to run Finaura on your own machine? Follow these simple steps.

### 1. Start the Backend
You need Node.js and a MySQL instance running. Go to the server directory:

```bash
cd server
npm install                    # Install the analytics & server tools
npx prisma db push             # Sync your local database schema
npm run dev                    # Start the backend server
```
Your backend is now running!

### 2. Start the Frontend
Open a new terminal window (keep the backend running in the first one).

```bash
cd client
npm install                    # Install UI & dashboard dependencies
npm run dev                    # Start the interactive Vite server
```
Your frontend is now live! Look at your terminal for the `localhost` link to see the app in your browser.

---

## 👨‍💻 Project Philosophy
Finaura represents the bridge between beautiful, responsive web design and complex financial architecture. It is designed to grow with your data while maintaining the speed and elegance of a premium product.

**Happy tracking, and here's to a more intelligent financial future!**