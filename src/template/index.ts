import path from "path";
import { createLogger } from "../utils/logger/baseLogger";

const CONTEXT = "TEMPLATE";
const ejs = require("ejs");

const logger = createLogger(CONTEXT);

/**
 *
 * @description creates email template from ejs file
 * @param data
 * @param temlateName
 * @returns
 */
export const getTemplate = (
  data: any,
  temlateName: string
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const templatePath = path.resolve(__dirname, `./${temlateName}.ejs`);
      ejs.renderFile(templatePath, data, function (err: any, data: string) {
        if (err) {
          logger.error({ type: "get template error", err });
          reject(err);
          return;
        }
        resolve(data);
        return;
      });
    } catch (err) {
      logger.error({ type: "get template error", err });
      console.log(err);
      reject(err);
      return;
    }
  });
};
