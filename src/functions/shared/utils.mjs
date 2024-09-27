import { createHash } from "node:crypto";

export function ipToId(ipAddress) {
  const hash = createHash('sha256');
  hash.update(ipAddress);

  return hash.digest('hex');
};