import "dotenv/config";
import type { AppConfig, BookingConfig, RegionConfig } from "./types";

export function loadConfig(): AppConfig {
  const botToken = process.env.BOT_TOKEN;
  const bearerToken = process.env.BEARER_TOKEN;

  if (!botToken || !bearerToken) {
    console.error(
      "Missing required env: BOT_TOKEN and BEARER_TOKEN must be set (see .env.example)"
    );
    process.exit(1);
  }

  const regions: RegionConfig[] = [
    {
      name: "Edjmiacin",
      branchId: parseInt(process.env.BRANCH_ID ?? "1856", 10),
      serviceId: parseInt(process.env.SERVICE_ID ?? "300681", 10),
    },
    { name: "Masis", branchId: 1867, serviceId: 300681 },
    { name: "Ashtarak", branchId: 1869, serviceId: 300681 },
  ];

  let booking: BookingConfig | undefined;

  if (process.env.BOOKING_ENABLED === "true") {
    const name = process.env.BOOKING_NAME;
    const surname = process.env.BOOKING_SURNAME;
    const phone = process.env.BOOKING_PHONE;
    const email = process.env.BOOKING_EMAIL;
    const appointmentUrl = process.env.APPOINTMENT_URL;

    if (!name || !surname || !phone || !email || !appointmentUrl) {
      console.error(
        "BOOKING_ENABLED=true but missing required booking env vars: " +
          "BOOKING_NAME, BOOKING_SURNAME, BOOKING_PHONE, BOOKING_EMAIL, APPOINTMENT_URL"
      );
      process.exit(1);
    }

    booking = {
      enabled: true,
      appointmentUrl,
      profile: { name, surname, phone, email },
      formFieldIds: {
        nameFieldId: parseInt(process.env.FORM_FIELD_ID_NAME ?? "13808", 10),
        surnameFieldId: parseInt(process.env.FORM_FIELD_ID_SURNAME ?? "13809", 10),
        phoneFieldId: parseInt(process.env.FORM_FIELD_ID_PHONE ?? "13810", 10),
        emailFieldId: parseInt(process.env.FORM_FIELD_ID_EMAIL ?? "13811", 10),
      },
    };
  }

  return {
    botToken,
    bearerToken,
    pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS ?? "600000", 10),
    regions,
    booking,
  };
}
