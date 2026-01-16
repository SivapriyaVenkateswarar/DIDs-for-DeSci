import crypto from "crypto";

export function decryptData(
  ciphertext: Buffer,
  key: Buffer,
  iv: Buffer,
  tag: Buffer
): Buffer {
  if (key.length !== 32) {
    throw new Error("AES-256-GCM requires a 32-byte key");
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
}
