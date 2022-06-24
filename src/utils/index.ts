import { createHash,validateHash } from "./hash";
import * as sendMail from "./mail";
import * as sendMessage from "./message";
import * as fileReader from "./readFile";
const utils = () => {
    return {
        createHash,
        validateHash,
        sendMail,
        sendMessage,
        fileReader,
    }
}

export default utils;