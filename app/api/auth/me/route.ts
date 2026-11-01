import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { findUserById } from '@/data/users';


export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Tidak terotentikasi.' },
        { status: 401 }
      );
    }

    const user = findUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Data pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        roleTitle: user.roleTitle,
        nip: user.nip,
        jabatan: user.jabatan,
        loginHistory: user.loginHistory,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
