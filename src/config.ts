import "dotenv/config";
import type { AppConfig, RegionConfig } from "./types";

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

  return {
    botToken,
    bearerToken,
    pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS ?? "600000", 10),
    regions,
  };
}
