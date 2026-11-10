import { NextRequest, NextResponse } from 'next/server';
import { generateOfficialProfilExcel } from '@/lib/excel-profil-generator';
import { MOCK_PROFIL_KESOS_RW } from '@/data/mock-kesos-profil';
import { MOCK_PROFIL_EKBANG_RW } from '@/data/mock-ekbang-profil';
import { aggregateProfilKesos } from '@/lib/kesos-calc';
import { aggregateProfilEkbang } from '@/lib/ekbang-calc';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rw = searchParams.get('rw') || 'ALL';

    const kesosData = MOCK_PROFIL_KESOS_RW;
    const ekbangData = MOCK_PROFIL_EKBANG_RW;

    const aggKesos = aggregateProfilKesos(kesosData);
    const aggEkbang = aggregateProfilEkbang(ekbangData);

    const buffer = generateOfficialProfilExcel({
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
  try {
    const body = await request.json();
    const { rw = 'ALL', kesosList, ekbangList } = body;

    const kesosData = Array.isArray(kesosList) && kesosList.length > 0 ? kesosList : MOCK_PROFIL_KESOS_RW;
    const ekbangData = Array.isArray(ekbangList) && ekbangList.length > 0 ? ekbangList : MOCK_PROFIL_EKBANG_RW;

    const aggKesos = aggregateProfilKesos(kesosData);
    const aggEkbang = aggregateProfilEkbang(ekbangData);

    const buffer = generateOfficialProfilExcel({
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
