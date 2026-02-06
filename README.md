# AI Expense Tracker

A full-stack expense tracking app that uses Google Gemini AI to parse natural language input.

## 🛠️ Tech Stack

- **Mobile:** React Native, Expo, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite
- **AI:** Google Gemini API

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- [Gemini API Key](https://makersuite.google.com/app/apikey)

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   Create a `.env` file in the `backend` root and add your Gemini API Key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Mobile

1. Navigate to the mobile folder:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Scan the QR code with the Expo Go app on your phone.

## 📁 Project Structure

- `backend/`: Node.js Express server
  - `src/services/aiService.ts`: Gemini integration logic.
  - `src/database.ts`: SQLite schema and CRUD operations.
  - `src/routes/expenses.ts`: API endpoints.
- `mobile/`: React Native Expo app
  - `src/screens/ExpenseTrackerScreen.tsx`: Main UI component.
  - `src/services/api.ts`: API client for backend communication.

## 🤖 AI Prompt Design

I used a system prompt that enforces strict JSON output from Gemini, handling:

- **Amount extraction**: Handles numbers within text.
- **Categorization**: Automatically maps terms to categories like "Food & Dining", "Transport", etc.
- **Merchant extraction**: Identifies entities like "Starbucks", "Uber".
