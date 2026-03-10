import { Telegraf, type Context } from "telegraf";
import { subscribe, unsubscribe } from "./subscribers";
import { startPoller } from "./poller";
import type { AppConfig, NotifyFn } from "./types";

export function createBot(config: AppConfig): Telegraf<Context> {
  const bot = new Telegraf(config.botToken);

  const notify: NotifyFn = async (chatId, message) => {
    await bot.telegram.sendMessage(chatId, message);
  };

  bot.command("start", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId == null) {
      await ctx.reply("This bot works only in private chats.");
      return;
    }

    subscribe(chatId);
    startPoller({
      bearerToken: config.bearerToken,
      regions: config.regions,
      pollIntervalMs: config.pollIntervalMs,
      notify,
    });

    const regionNames = config.regions.map((r) => r.name).join(", ");
    const minutes = Math.round(config.pollIntervalMs / 60000);

    await ctx.reply(
      `Started.\nChecking these regions every ${minutes} minute(s): ${regionNames}.\nWhen I find the nearest date between March 1 and June 30, I will notify you.`
    );
  });

  bot.command("stop", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId == null) return;

    unsubscribe(chatId);
    await ctx.reply("Stopped. You will no longer receive notifications.");
  });

  return bot;
}
