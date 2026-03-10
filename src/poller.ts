import { getNearestDay } from "./api";
import { getSubscriberIds, getSubscriberIdsForRegion, hasSubscribers } from "./subscribers";
import {
  getTodayDateString,
  getFirstDateKey,
  isSpringDate,
  formatRegionNotificationMessage,
} from "./formatter";
import type { PollerConfig } from "./types";

let intervalId: ReturnType<typeof setInterval> | null = null;

async function runCheck(config: PollerConfig): Promise<void> {
  if (!hasSubscribers()) {
    console.log("Poller tick: no subscribers, skipping check.");
    return;
  }

  const allSubscribers = getSubscriberIds();
  const regionsToCheck = config.regions.filter(
    (r) => getSubscriberIdsForRegion(r).length > 0
  );
  const today = getTodayDateString();
  console.log(
    `Poller tick: checking ${regionsToCheck.length} region(s) for ${allSubscribers.length} subscriber(s) on ${today}.`
  );

  for (const region of regionsToCheck) {
    try {
      console.log(
        `Fetching nearest day for region ${region.name} (branch ${region.branchId}, service ${region.serviceId})...`
      );

      const data = await getNearestDay(config.bearerToken, {
        branchId: region.branchId,
        serviceId: region.serviceId,
        date: today,
      });

      const firstKey = getFirstDateKey(data);
      if (firstKey == null) {
        console.log(`${region.name} - no available dates returned.`);
        continue;
      }

      const dateOnly = firstKey.slice(0, 10);
      console.log(`${region.name} - nearest date: ${dateOnly}`);

      const slots = data[firstKey] ?? [];
      if (!isSpringDate(firstKey)) {
        console.log(
          `${region.name} - nearest date ${dateOnly} is outside spring window (Mar 1 – Jun 30), not notifying.`
        );
        continue;
      }

      const message = formatRegionNotificationMessage(
        region.name,
        firstKey,
        slots
      );

      const regionSubscribers = getSubscriberIdsForRegion(region);

      console.log(
        `${region.name} - sending notification to ${regionSubscribers.length} subscriber(s).`
      );

      for (const chatId of regionSubscribers) {
        try {
          await config.notify(chatId, message);
        } catch (err) {
          console.error(`Failed to notify chat ${chatId}:`, err);
        }
      }
    } catch (err) {
      console.error(
        `Poller API error for region ${region.name} (will retry next interval):`,
        err
      );
    }
  }
}

export function startPoller(config: PollerConfig): void {
  if (intervalId != null) return;

  runCheck(config);
  intervalId = setInterval(() => runCheck(config), config.pollIntervalMs);
  console.log(
    `Poller started (interval: ${config.pollIntervalMs / 1000}s)`
  );
}

export function stopPoller(): void {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Poller stopped");
  }
}
