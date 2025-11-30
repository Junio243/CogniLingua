import { httpGet, type HttpClientOptions } from './httpClient';

export type AuthSession = {
  token: string;
  studentId: string;
  expiresAt?: string;
};

export async function fetchActiveSession(
  options: HttpClientOptions = {},
): Promise<AuthSession | null> {
  try {
    const session = await httpGet<AuthSession>('/auth/session', {
      mode: 'csr',
      withCredentials: true,
      ...options,
    });
    if (!session?.token || !session?.studentId) {
      return null;
    }
    return session;
  } catch (error) {
    console.warn('[authApi] failed to refresh session', error);
    return null;
  }
}

export const authApi = {
  fetchActiveSession,
};
