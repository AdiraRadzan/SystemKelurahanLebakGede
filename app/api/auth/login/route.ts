import { NextRequest, NextResponse } from 'next/server';
import { findUserByUsername } from '@/data/users';
import { signSession, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, rememberMe } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const user = findUserByUsername(username);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Username atau kata sandi salah. Silakan coba lagi.' },
        { status: 401 }
      );
    }

    // Expiry: 8 hours (28800s) or 7 days (604800s)
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 8 * 60 * 60;

    const token = await signSession(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        roleTitle: user.roleTitle,
      },
      maxAge
    );

    const response = NextResponse.json({
      success: true,
      message: 'Berhasil masuk ke sistem.',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        roleTitle: user.roleTitle,
        nip: user.nip,
        jabatan: user.jabatan,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAge,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat masuk.' },
      { status: 500 }
    );
  }
}
