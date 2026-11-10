import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { generateOfficialProfilExcel } from '@/lib/excel-profil-generator';
import { MOCK_PROFIL_KESOS_RW } from '@/data/mock-kesos-profil';
import { MOCK_PROFIL_EKBANG_RW } from '@/data/mock-ekbang-profil';
import { aggregateProfilKesos } from '@/lib/kesos-calc';
import { aggregateProfilEkbang } from '@/lib/ekbang-calc';

async function ensureLurah(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: 'Sesi berakhir, silakan login kembali' }, { status: 401 });
  }
  if (session.role !== 'lurah') {
    return NextResponse.json({ error: 'Export hanya dapat dilakukan oleh Lurah' }, { status: 403 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await ensureLurah();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const rw = searchParams.get('rw') || 'ALL';

    const kesosData = MOCK_PROFIL_KESOS_RW;
    const ekbangData = MOCK_PROFIL_EKBANG_RW;

    const aggKesos = aggregateProfilKesos(kesosData);
    const aggEkbang = aggregateProfilEkbang(ekbangData);

    const buffer = await generateOfficialProfilExcel({
      rw,
      kesosData,
      ekbangData,
      aggKesos,
      aggEkbang,
      bulan: 'November',
      tahun: 2026,
    });

    const filename =
      rw === 'ALL'
        ? `Profil-Kelurahan-Lebakgede-Standar-Resmi-16RW.xlsx`
        : `Profil-Kelurahan-Lebakgede-${rw.replace(/\s+/g, '-')}-Standar-Resmi.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export Excel Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal membuat file export Excel profil' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = await ensureLurah();
  if (denied) return denied;
  try {
    const body = await request.json();
    const { rw = 'ALL', kesosList, ekbangList } = body;

    const kesosData = Array.isArray(kesosList) && kesosList.length > 0 ? kesosList : MOCK_PROFIL_KESOS_RW;
    const ekbangData = Array.isArray(ekbangList) && ekbangList.length > 0 ? ekbangList : MOCK_PROFIL_EKBANG_RW;

    const aggKesos = aggregateProfilKesos(kesosData);
    const aggEkbang = aggregateProfilEkbang(ekbangData);

    const buffer = await generateOfficialProfilExcel({
      rw,
      kesosData,
      ekbangData,
      aggKesos,
      aggEkbang,
      bulan: 'November',
      tahun: 2026,
    });

    const filename =
      rw === 'ALL'
        ? `Profil-Kelurahan-Lebakgede-Standar-Resmi-16RW.xlsx`
        : `Profil-Kelurahan-Lebakgede-${rw.replace(/\s+/g, '-')}-Standar-Resmi.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export Excel Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal membuat file export Excel profil' },
      { status: 500 }
    );
  }
}
