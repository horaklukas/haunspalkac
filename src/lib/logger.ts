import { format, transports, createLogger } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: "user-service" },
  transports: [new transports.Console()],
});
