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

/** Returns true if the date (YYYY-MM-DD) falls between March 1 and June 15 inclusive. */
export function isSpringDate(dateKey: string): boolean {
  const dateOnly = dateKey.slice(0, 10);
  const [year, monthStr, dayStr] = dateOnly.split("-");
  if (!year || !monthStr || !dayStr) return false;
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  if (month < 3) return false;
  if (month > 6) return false;
  if (month === 6 && day > 15) return false;
  return true;
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

export function formatBookingSuccess(
  appointmentNumber: string,
  pin: string,
  startTime: string
): string {
  return `✅ Auto-booked: Appointment ${appointmentNumber}, PIN ${pin}, Time ${startTime}`;
}

export function formatBookingFailure(error: string): string {
  return `⚠️ Slots available but auto-booking failed: ${error}\nPlease book manually.`;
}
