export const USER_UUID_STORAGE_KEY = "fdlm-user-uuid";

export function getOrCreateUserUuid() {
  if (typeof window === "undefined") return null;

  const existing = localStorage.getItem(USER_UUID_STORAGE_KEY);
  if (existing) return existing;

  const uuid = crypto.randomUUID();
  localStorage.setItem(USER_UUID_STORAGE_KEY, uuid);
  return uuid;
}

export function isValidUserUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
