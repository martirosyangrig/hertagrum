import { loadConfig } from "./config";
import { createBot } from "./bot";

const config = loadConfig();
const bot = createBot(config);

bot.launch().then(() => {
  console.log("Bot is running. Send /start in a private chat to begin.");
});

process.once("SIGINT", () => {
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});
