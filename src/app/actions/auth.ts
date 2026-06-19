'use server';

import { cookies } from 'next/headers';

/**
 * Validates admin credentials against environment variables and sets a secure httpOnly cookie.
 */
export async function loginAdmin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@etherealspaces.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email.trim() === adminEmail.trim() && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('ethereal_admin_session', 'active', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true };
  }

  return { 
    success: false, 
    error: 'Invalid credentials. Please verify your email and password in your configuration.' 
  };
}

/**
 * Destroys the admin session cookie.
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('ethereal_admin_session');
  return { success: true };
}

/**
 * Checks if the current request has a valid active admin session cookie.
 */
export async function checkAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('ethereal_admin_session');
  return session?.value === 'active';
}
