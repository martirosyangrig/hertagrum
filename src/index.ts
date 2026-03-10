import { loadConfig } from "./config";
import { createBot } from "./bot";

const config = loadConfig();
const bot = createBot(config);

const commands = [
  { command: "start", description: "Start and choose what to process" },
  { command: "stop", description: "Stop notifications" },
  { command: "clear", description: "Clear chat history and conversation state" },
];

async function main() {
  // Set commands BEFORE launch — launch() never resolves (it runs the polling loop forever)
  await bot.telegram.setMyCommands(commands);
  const registered = await bot.telegram.getMyCommands();
  console.log("Bot is running. Commands in Telegram:", registered.map((c) => "/" + c.command).join(", "));

  await bot.launch();
}

main().catch((err) => {
  console.error("Failed to start bot:", err);
  process.exit(1);
});

process.once("SIGINT", () => {
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});
