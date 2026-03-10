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
  booking?: BookingConfig;
}

export interface GetNearestDayParams {
  branchId: number;
  serviceId: number;
  date: string; // YYYY-MM-DD
}

export interface BookingProfile {
  name: string;
  surname: string;
  phone: string;
  email: string;
}

export interface FormFieldIds {
  nameFieldId: number;
  surnameFieldId: number;
  phoneFieldId: number;
  emailFieldId: number;
}

export interface BookingConfig {
  enabled: boolean;
  appointmentUrl: string;
  profile: BookingProfile;
  formFieldIds: FormFieldIds;
}

export interface AppointmentFormField {
  companyFormFieldId: number;
  value: string;
}

export interface AppointmentRequestBody {
  appointmentStep: {
    accountId: number;
    serviceId: number;
    startTime: string;
  };
  branchId: number;
  date: string;
  email: string;
  formFields: AppointmentFormField[];
  hasReception: boolean;
}

export interface AppointmentResponse {
  date: string;
  accountId: number;
  serviceId: number;
  startTime: string;
  duration: number;
  appointmentId: number;
  appointmentNumber: string;
  hasReception: boolean;
  pin: string;
  isLimitExceeded: boolean;
  id: number;
}

export type NotifyFn = (chatId: number, message: string) => Promise<void>;

export interface PollerConfig {
  bearerToken: string;
  regions: RegionConfig[];
  pollIntervalMs: number;
  notify: NotifyFn;
  booking?: BookingConfig;
}
