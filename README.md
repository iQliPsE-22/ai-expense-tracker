# AI Expense Tracker

A full-stack expense tracking app that uses AI (Google Gemini) to parse natural language input into structured expense data.

Built by: **Deepa**
GitHub: [https://github.com/deepa/ai-expense-tracker](https://github.com/deepa/ai-expense-tracker)
Time to build: **~4 hours** (with AI assistance)

## 🎥 Demo

_(Link to your screen recording)_

## 🛠️ Tech Stack

- **Mobile:** React Native (0.81), Expo (SDK 54), TypeScript, React 19
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite (via `better-sqlite3`)
- **AI:** Google Gemini API (`gemini-2.5-flash`)

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Google Gemini API Key

### Backend

```bash
cd backend
npm install
# Create .env file with GEMINI_API_KEY=your_key_here
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start -c
# Scan QR code with Expo Go app or press 'a' for Android Emulator
```

## 📁 Project Structure

```
ai-expense-tracker/
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes (expenses.ts)
│   │   ├── services/       # AI logic (aiService.ts), Database (database.ts)
│   │   └── index.ts        # Server entry point
│   ├── data/               # SQLite database file
│   └── package.json
│
└── mobile/
    ├── src/
    │   ├── components/     # Reusable UI (ExpenseItem, ExpenseInput)
    │   ├── screens/        # Main screens (ExpenseTrackerScreen)
    │   ├── services/       # API client (api.ts)
    │   └── utils/          # Helpers (helpers.ts)
    ├── App.tsx             # App entry point
    └── package.json
```

## 🤖 AI Prompt Design

I used this system prompt to instruct the Gemini model to parse natural language into structured JSON:

```text
You are an expense parser. Extract expense information from natural language input.

RULES:
1. Extract the amount as a number (no currency symbols)
2. Default currency is INR unless explicitly mentioned (USD, EUR, etc.)
3. Categorize into EXACTLY one of these categories:
    - Food & Dining (restaurants, cafes, food delivery, groceries)
    - Transport (uber, ola, taxi, fuel, parking, metro)
    - Shopping (clothes, electronics, amazon, flipkart)
    - Entertainment (movies, netflix, spotify, games)
    - Bills & Utilities (electricity, water, internet, phone)
    - Health (medicine, doctor, gym, pharmacy)
    - Travel (flights, hotels, trips)
    - Other (anything that doesn't fit above)
4. Description should be a clean summary (not the raw input)
5. Merchant is the company/store name if mentioned, null otherwise

RESPOND ONLY WITH VALID JSON, no other text.
```

**Why this approach:**

- **Strict Rules:** explicitly defining categories ensures consistent reporting.
- **JSON Only:** Forcing JSON output makes it easy to parse reliably in the backend without regex parsing.
- **Error Handling:** The prompt includes instructions for invalid input to gracefully handle non-expense text.

## ⏱️ Time Breakdown

| Task                    | Time         |
| ----------------------- | ------------ |
| Setup & Config          | 30 min       |
| Backend & AI Service    | 60 min       |
| Mobile UI (Refactoring) | 90 min       |
| Integration & Testing   | 45 min       |
| Polish & Docs           | 15 min       |
| **Total**               | **~4 hours** |

## 🔮 What I'd Add With More Time

- [ ] **Authentication**: User login/signup to support multiple users.
- [ ] **Charts & Analytics**: Visual breakdown of spending by category (Pie charts).
- [ ] **Receipt Scanning**: Upload an image and use Multimodal AI to parse receipts.
- [ ] **Budgeting**: Set monthly interaction limits and get alerts.

## 📝 AI Tools Used

- **Antigravity (Google DeepMind)**: Used for full-stack coding, debugging, and refactoring.
- **Google Gemini 2.5 Flash**: The underlying LLM used for expense parsing.

Most helpful prompt: _"Refactor the list items into a reusable component and ensure the styling matches using StyleSheet."_

## 📜 License

MIT - Feel free to use this for your own projects!
