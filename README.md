# EarlyOne Nearest Appointment Telegram Bot

A Node.js + TypeScript Telegram bot that polls the EarlyOne API for the nearest appointment day and sends you the result (date and time slots) every time it checks.

## Setup

1. **Clone / open the project** and install dependencies:

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and fill in:

   - `BOT_TOKEN` — from [@BotFather](https://t.me/BotFather) on Telegram
   - `BEARER_TOKEN` — your EarlyOne JWT (from their auth flow).  
     **Note:** If this token expires, you will need to refresh it (e.g. via their login API); update `.env` or add a refresh step.
   - `POLL_INTERVAL_MS` — optional, default `600000` (10 minutes). How often to call the API.
   - `BRANCH_ID` — optional, default `1856`
   - `SERVICE_ID` — optional, default `300681`

3. **Run**

   ```bash
   npm run dev
   ```

   Or build and run:

   ```bash
   npm run build && npm start
   ```

## Usage

- Send **`/start`** in a private chat with the bot. The bot will start checking the API and send you the nearest date and available time slots every time it runs a check.
- Send **`/stop`** to stop notifications for that chat.

## Behavior

- The bot calls the EarlyOne `GetNearestDay` endpoint with the configured `BranchId`, `ServiceId`, and today’s date.
- On each check it sends you a message with the **nearest date** and the list of available times.
- Polling runs every `POLL_INTERVAL_MS` (default 10 minutes) to avoid overloading the API.

## License

MIT
