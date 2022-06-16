import { closedatabases, initDatabases } from "../db";
import server from "../main/app";
import { GRACEFULL_STARTUP_TIMEOUT } from "../config";
import { createLogger } from "../utils/logger/baseLogger";
import "reflect-metadata";

let startCall = false;
let stopCall = false;
const CONTEXT = "SERVER";
const logger = createLogger(CONTEXT);

process.on("uncaughtException", (e) => {
  logger.error({ e, type: "uncaughtException" });
  stopProcedure(true);
});

process.on("unhandledRejection", (err) => {
  logger.error({ err, type: "unhandledRejection" });
  stopProcedure(true);
});

process.on("SIGINT", () => {
  logger.error("SIGINT");
  stopProcedure(false);
});

process.on("SIGTERM", () => {
  logger.error("SIGTERM");
  stopProcedure(false);
});

// start server
startProcedure();

/**
 * @description starts procedure
 * @returns
 */
async function startProcedure(): Promise<void> {

  if (startCall) {
    return;
  }
  const gracefullTimeout = setTimeout(async () => {
    logger.warn("gracefull start up timeout, exiting process");
    process.exit(1);
  }, GRACEFULL_STARTUP_TIMEOUT);
  //connecting to services
  const [DB] = await Promise.all([initDatabases()]);

  // validating services
  if (!DB) {
    /**
     * some service did't start
     * exit
     */
    logger.error("Unable to connect to database");
    process.exit(1);
  } else {
    // all started
    // start server
    startCall = true;

    const startRes = await server.start();
    clearTimeout(gracefullTimeout);

    if (startRes) {
      logger.info("server started");
    } else {
      await closedatabases();
      logger.error("server start failed");
      process.exit(1);
    }
  }
}

/**
 *
 * @returns
 */
async function stopProcedure(err: boolean): Promise<void> {
  if (stopCall) {
    return;
  }
  if (err) {
    stopCall = true;
    console.log("closing server");
    await server.close();
    console.log("serve closed");
  }
  process.exit(1);
}
