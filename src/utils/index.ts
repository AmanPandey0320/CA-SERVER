import { createHash, validateHash } from "./hash";
import {sendMail} from "./mail";
import {sendMessage} from "./message";
import { json } from "./readFile";
import { toCamelCase, toSnakeCase } from "./nameConvention";
const utils = {
  createHash,
  validateHash,
  sendMail,
  sendMessage,
  fileReader: { json },
  nameConvention: {
    toCamelCase,
    toSnakeCase,
  },
};

export default utils;
