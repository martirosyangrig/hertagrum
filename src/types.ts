export interface TimeSlot {
  value: string;
  label: string;
}

/** API response: date string -> array of time slots */
export type GetNearestDayResponse = Record<string, TimeSlot[]>;

export interface RegionConfig {
  name: string;
  branchId: number;
  serviceId: number;
}

export interface AppConfig {
  botToken: string;
  bearerToken: string;
  pollIntervalMs: number;
  regions: RegionConfig[];
}

export interface GetNearestDayParams {
  branchId: number;
  serviceId: number;
  date: string; // YYYY-MM-DD
}

export type NotifyFn = (chatId: number, message: string) => Promise<void>;

export interface PollerConfig {
  bearerToken: string;
  regions: RegionConfig[];
  pollIntervalMs: number;
  notify: NotifyFn;
}
