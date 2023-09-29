import { format, transports, createLogger } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    process.env.NODE_ENV === "production" ? format.json() : format.prettyPrint()
  ),
  defaultMeta: { service: "user-service" },
  transports: [new transports.Console()],
});
