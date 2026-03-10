import { Markup, Telegraf, type Context } from "telegraf";
import { subscribe, unsubscribe, hasSubscribers } from "./subscribers";
import { startPoller, stopPoller } from "./poller";
import type { AppConfig, NotifyFn, RegionConfig } from "./types";

interface ConversationState {
  step: "select_regions";
  selectedIndices: Set<number>;
}

const conversations = new Map<number, ConversationState>();

function buildRegionKeyboard(regions: RegionConfig[], selected: Set<number>) {
  const regionRow = regions.map((r, i) => {
    const icon = selected.has(i) ? "✅" : "☐";
    return Markup.button.callback(`${icon} ${r.name}`, `region:${i}`);
  });
  return Markup.inlineKeyboard([
    regionRow,
    [Markup.button.callback("✔ Confirm", "regions_confirm")],
  ]);
}

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

    conversations.delete(chatId);

    await ctx.reply(
      "Select what you want to process:",
      Markup.inlineKeyboard([
        [Markup.button.callback("🪪 ID card", "process:id_card")],
      ])
    );
  });

  bot.action("process:id_card", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId == null) return;

    conversations.set(chatId, {
      step: "select_regions",
      selectedIndices: new Set(),
    });

    const keyboard = buildRegionKeyboard(config.regions, new Set());

    await ctx.editMessageText("Choose regions:", keyboard);
    await ctx.answerCbQuery();
  });

  bot.action(/^region:(\d+)$/, async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId == null) return;

    const state = conversations.get(chatId);
    if (!state || state.step !== "select_regions") {
      await ctx.answerCbQuery();
      return;
    }

    const index = parseInt(ctx.match[1], 10);
    if (index < 0 || index >= config.regions.length) {
      await ctx.answerCbQuery();
      return;
    }

    if (state.selectedIndices.has(index)) {
      state.selectedIndices.delete(index);
    } else {
      state.selectedIndices.add(index);
    }

    const keyboard = buildRegionKeyboard(config.regions, state.selectedIndices);
    await ctx.editMessageText("Choose regions:", keyboard);
    await ctx.answerCbQuery();
  });

  bot.action("regions_confirm", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId == null) return;

    const state = conversations.get(chatId);
    if (!state || state.step !== "select_regions") {
      await ctx.answerCbQuery();
      return;
    }

    if (state.selectedIndices.size === 0) {
      await ctx.answerCbQuery("Select at least one region", {
        show_alert: true,
      });
      return;
    }

    const selectedRegions = config.regions.filter((_, i) =>
      state.selectedIndices.has(i)
    );

    subscribe(chatId, selectedRegions);
    conversations.delete(chatId);

    startPoller({
      bearerToken: config.bearerToken,
      regions: config.regions,
      pollIntervalMs: config.pollIntervalMs,
      notify,
      booking: config.booking,
    });

    const names = selectedRegions.map((r) => r.name).join(", ");
    await ctx.editMessageText(
      `We will check ${names} and when we find available dates we will send you a notification.`
    );
    await ctx.answerCbQuery();
  });

  bot.command("stop", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId == null) return;

    unsubscribe(chatId);
    conversations.delete(chatId);

    if (!hasSubscribers()) {
      stopPoller();
    }

    await ctx.reply("Stopped. You will no longer receive notifications.");
  });

  bot.command("clear", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId == null) return;

    conversations.delete(chatId);
    await ctx.reply("Chat history cleared. Send /start to begin again.");
  });

  return bot;
}
