import crypto from "crypto";
import { HASH_KEY, HASH_VI, HASH_ALGO } from "../config";

// const KEY = crypto.scryptSync(HASH_KEY, "BRS", HASH_KEY.length);
const VI = Buffer.alloc(HASH_VI, 0);

/**
 *
 * @param text
 * @returns
 */
export const createHash = (text: string) => {
  let cipher = crypto.createCipheriv(HASH_ALGO, HASH_KEY, VI);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const hashData: string = encrypted.toString("hex");

  return hashData;
};

/**
 *
 * @param hash
 * @param text
 * @returns
 */
export const validateHash = (hash: string, text: string): boolean => {
  const encryptedBuffer = Buffer.from(hash, "hex");
  let decipher = crypto.createDecipheriv(HASH_ALGO, HASH_KEY, VI);

  let decrypt = decipher.update(encryptedBuffer);
  decrypt = Buffer.concat([decrypt, decipher.final()]);

  const decryptText = decrypt.toString();

  return decryptText === text;
};
