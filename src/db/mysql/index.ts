import { Pool } from "mysql";
import { createConnection } from "typeorm";
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../../config";
import { createLogger } from "../../utils/logger/baseLogger";
import DbLogger from "../../utils/logger/dbLogger";
import entities from "./entities";

export const CONTEXT = "mysql";
let POOL: Pool | undefined = undefined;

const logger = createLogger(CONTEXT);

export function getMysql(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const ormLogger = new DbLogger();
      await createConnection({
        type: "mysql",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        entities: entities,
        synchronize: true,
        logger: ormLogger,
      });
      resolve(true);
      logger.info("mysql connected");
    } catch (error) {
      console.log(error);
      logger.error(error);
      reject(error);
      return;
    }
  });
}

export function endMysql(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (POOL) {
      POOL.end((err) => {
        if (err) {
          console.log(err);
          logger.error(err);
          reject(false);
          return;
        }
        logger.info("my sql closed");
        resolve(true);
        return;
      });
    } else {
      logger.error("Not connected to db");
      return resolve(true);
    }
  });
}
