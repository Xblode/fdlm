import { getSession } from "@/lib/auth/session";

type AuthError = { error: string; status: number };

export async function ensureAdmin(): Promise<AuthError | null> {
  const session = await getSession();

  if (!session) {
    return { error: "Non authentifié", status: 401 };
  }

  return null;
}
