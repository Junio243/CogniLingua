import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { AuthSession } from '../../services/authApi';

const AUTH_TOKEN_COOKIE = 'auth_token';
const STUDENT_ID_COOKIE = 'student_id';

export async function getServerSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? cookieStore.get('token')?.value;
  const studentId = cookieStore.get(STUDENT_ID_COOKIE)?.value ?? cookieStore.get('studentId')?.value;
  const expiresAt = cookieStore.get('auth_expires_at')?.value;

  if (!token || !studentId) {
    return null;
  }

  return { token, studentId, expiresAt };
}

export async function requireServerSession(): Promise<AuthSession> {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export const authCookies = {
  AUTH_TOKEN_COOKIE,
  STUDENT_ID_COOKIE,
};
