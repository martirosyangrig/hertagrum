import axios, { AxiosError } from "axios";
import type {
  AppointmentRequestBody,
  AppointmentResponse,
  GetNearestDayParams,
  GetNearestDayResponse,
} from "./types";

const BASE_URL =
  process.env.BASE_URL ??
  "";

/**
 * Fetches the nearest available day and time slots from EarlyOne API.
 * @throws on non-2xx or network errors
 */
export async function getNearestDay(
  bearerToken: string,
  params: GetNearestDayParams
): Promise<GetNearestDayResponse> {
  const url = new URL(BASE_URL);
  url.searchParams.set("BranchId", String(params.branchId));
  url.searchParams.set("Date", params.date);
  url.searchParams.set("ServiceId", String(params.serviceId));

  try {
    const response = await axios.get<GetNearestDayResponse>(url.toString(), {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      timeout: 15000,
    });
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError;
    const message =
      axiosErr.response?.status != null
        ? `API error ${axiosErr.response.status}: ${JSON.stringify(axiosErr.response.data)}`
        : axiosErr.message ?? "Unknown error";
    throw new Error(message);
  }
}

export async function createAppointment(
  bearerToken: string,
  appointmentUrl: string,
  body: AppointmentRequestBody
): Promise<AppointmentResponse> {
  try {
    const response = await axios.post<AppointmentResponse>(
      appointmentUrl,
      body,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError;
    const message =
      axiosErr.response?.status != null
        ? `Booking API error ${axiosErr.response.status}: ${JSON.stringify(axiosErr.response.data)}`
        : axiosErr.message ?? "Unknown error";
    throw new Error(message);
  }
}
