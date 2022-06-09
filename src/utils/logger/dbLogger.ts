import { Logger } from "typeorm";
import { createLogger } from "./baseLogger";

export default class DbLogger implements Logger {
  _context: string = "MYSQL_DB_LOGGER";
  logger = createLogger(this._context);
  logQuery(query: string, parameters?: any[]) {
    this.logger.info({ query, parameters });
  }
  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error({ query, parameters, error });
  }
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn({ time, query, parameters });
  }
  logSchemaBuild(message: string) {
    this.logger.trace({ message });
  }
  logMigration(message: string) {
    this.logger.trace({ message });
  }
  log(level: "log" | "info" | "warn", message: any) {
    if (level === "log") {
      this.logger.trace({ message });
    } else if (level === "info") {
      this.logger.info({ message });
    } else {
      this.logger.warn({ message });
    }
  }
}
