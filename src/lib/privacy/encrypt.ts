import crypto from "crypto";
import { EncryptedData } from "./types";

export function encryptData(
  data: Buffer,
  key: Buffer
): EncryptedData {
  if (key.length !== 32) {
    throw new Error("AES-256-GCM requires a 32-byte key");
  }

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(data),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return { ciphertext, iv, tag };
}
