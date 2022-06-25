import { SMS_API_KEY } from "../config";
import { createLogger } from "./logger/baseLogger";

const fast2sms = require("fast-two-sms");
const CONTEXT = "SMS";
const logger = createLogger(CONTEXT);

export const sendMessage = (
  message: string,
  numbers: Array<string>
): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      logger.info({ type: "sending message", numbers, message });
      const options = { message, numbers, authorization: SMS_API_KEY };
      const sendRes = await fast2sms.sendMessage(options);
      if (sendRes.return) {
        resolve(true);
        return;
      }
      logger.error({ type: "message.ts error", sendRes, message, numbers });
      reject(false);
      return;
    } catch (err) {
      logger.error({ type: "message error", err });
      reject(false);
      return;
    }
  });
};

export default sendMessage;
