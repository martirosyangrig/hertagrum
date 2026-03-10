import type { GetNearestDayResponse, TimeSlot } from "./types";

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getFirstDateKey(
  response: GetNearestDayResponse
): string | null {
  const keys = Object.keys(response);
  if (keys.length === 0) return null;
  return keys[0];
}

/** Returns true if the date (YYYY-MM-DD) falls in spring: March 1 – June 30 inclusive. */
export function isSpringDate(dateKey: string): boolean {
  const dateOnly = dateKey.slice(0, 10);
  const [year, monthStr] = dateOnly.split("-");
  if (!year || !monthStr) return false;
  const month = parseInt(monthStr, 10);
  return month >= 3 && month <= 6;
}

export function formatRegionNotificationMessage(
  regionName: string,
  dateKey: string,
  slots: TimeSlot[]
): string {
  const dateOnly = dateKey.slice(0, 10);
  const slotList =
    slots.length > 0
      ? slots.map((s) => s.label).join(", ")
      : "No slots listed";
  return `Region: ${regionName}\nNearest date: ${dateOnly}\nAvailable times: ${slotList}`;
}

export function formatNotificationMessage(
  dateKey: string,
  slots: TimeSlot[]
): string {
  const dateOnly = dateKey.slice(0, 10);
  const slotList =
    slots.length > 0
      ? slots.map((s) => s.label).join(", ")
      : "No slots listed";
  return `Nearest date: ${dateOnly}\nAvailable times: ${slotList}`;
}
