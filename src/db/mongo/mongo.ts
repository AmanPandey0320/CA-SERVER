const { connect } = require("mongoose");
import { MONGO_CONN_URI } from "../../config";
import { createLogger } from "../../utils/logger/baseLogger";

const DB_OPTION = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const CONTEXT = "MONGO";
const logger = createLogger(CONTEXT);

function getMongo(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      connect(MONGO_CONN_URI, DB_OPTION)
        .then(() => {
          logger.info("mongo connected");
          resolve(true);
          return;
        })
        .catch((err: any) => {
          logger.error({ type: "mongoose connect error", err });
          reject(false);
          return;
        });
    } catch (err) {
      reject(err);
      return;
    }
  });
}

export default getMongo;
