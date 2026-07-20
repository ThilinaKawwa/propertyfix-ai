import { randomUUID } from "crypto";

/** Generate an unguessable URL-safe token (matches the DB pf_token format). */
export function pf_token(): string {
  return (randomUUID() + randomUUID()).replace(/-/g, "");
}
