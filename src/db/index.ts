import { endMysql, getMysql } from "./mysql";
// import { Pool } from "mysql";
import getMongo from "./mongo/mongo";
import { createLogger } from "../utils/logger/baseLogger";

interface DBtype {
  MYSQL?: boolean;
}

const CONTEXT = "DATABASE";
export const DB: DBtype = {};

const logger = createLogger(CONTEXT);

export function initDatabases(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const [MYSQL, MONGO] = await Promise.all([getMysql(), getMongo()]);
      if (MYSQL && MONGO) {
        DB.MYSQL = MYSQL;
      } else {
        reject(false);
        return;
      }
      resolve(true);
      return;
    } catch (err) {
      console.log(err);
      logger.error(err);
      reject(false);
      return;
    }
  });
}

/**
 *
 * @returns
 */
export async function closedatabases() {
  logger.info("closing all databases");
  try {
    if (DB.MYSQL) {
      await endMysql();
    }
  } catch (err) {
    console.log(err);
    logger.error(err);
    return;
  }
}
