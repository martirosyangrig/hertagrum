import type { RegionConfig } from "./types";

const subscriptions = new Map<number, RegionConfig[]>();

export function subscribe(chatId: number, regions: RegionConfig[]): void {
  subscriptions.set(chatId, regions);
}

export function unsubscribe(chatId: number): void {
  subscriptions.delete(chatId);
}

export function hasSubscribers(): boolean {
  return subscriptions.size > 0;
}

export function getSubscriberIds(): number[] {
  return Array.from(subscriptions.keys());
}

export function getSubscriberIdsForRegion(region: RegionConfig): number[] {
  const result: number[] = [];
  for (const [chatId, regions] of subscriptions) {
    if (regions.some((r) => r.branchId === region.branchId)) {
      result.push(chatId);
    }
  }
  return result;
}
