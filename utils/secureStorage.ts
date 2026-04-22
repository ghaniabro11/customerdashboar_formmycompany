// utils/secureStorage.ts
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
export const SECRET = process.env.NEXT_STORE_SECRET_KEY!;

const getKey = async () => {
  const rawKey = textEncoder.encode(SECRET);

  // Ensure the key is 256 bits by hashing it with SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", rawKey);

  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
};
export const encrypt = async (data: string) => {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit nonce

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    textEncoder.encode(data)
  );

  // Combine IV + Encrypted
  const buffer = new Uint8Array(iv.byteLength + encrypted.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encrypted), iv.byteLength);

  return btoa(String.fromCharCode(...buffer)); // base64
};

export const decrypt = async (encryptedBase64: string) => {
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) =>
    c.charCodeAt(0)
  );
  const iv = encryptedBytes.slice(0, 12);
  const data = encryptedBytes.slice(12);

  const key = await getKey();

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return textDecoder.decode(decrypted);
};
