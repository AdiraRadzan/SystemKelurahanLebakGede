import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import {
  PENDUDUK_API_CONFIGURED,
  listPenduduk,
  statsPenduduk,
  addPenduduk,
  updatePenduduk,
  deletePenduduk,
  bulkSetFieldPenduduk,
  bulkAddPenduduk,
  clearPenduduk,
  listPengurus,
  savePengurus,
  deletePengurus,
  bulkAddPengurus,
  listTable,
  infoTable,
  saveTableRow,
  deleteTableRow,
  bulkAddTable,
  clearTable,
  fetchReport,
  type PendudukRow,
  type PengurusRow,
} from '@/lib/sheets';

// ============================================================================
// /api/penduduk — jembatan antara aplikasi Next.js dan Google Sheets
// ============================================================================
// Semua permintaan WAJIB punya sesi login Next.js yang valid (cookie).
// PIN & token Apps Script tidak pernah menyentuh browser — hanya server ini.
//
// Body: { action: string, ...payload }

export const dynamic = 'force-dynamic';

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  // 1. Wajib login
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // 2. Backend harus dikonfigurasi
  if (!PENDUDUK_API_CONFIGURED) {
    return NextResponse.json(
      {
        ok: false,
        error: 'not_configured',
        message:
          'Backend data penduduk belum dikonfigurasi. Isi PENDUDUK_API_URL dan PENDUDUK_PIN di .env.local.',
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail('Body permintaan bukan JSON yang valid.');
  }

  const action = String(body.action || '');

  try {
    switch (action) {
      case 'list': {
        const items = await listPenduduk();
        return NextResponse.json({ ok: true, items });
      }

      case 'stats': {
        const stats = await statsPenduduk();
        return NextResponse.json({ ok: true, ...stats });
      }

      case 'add': {
        const item = (body.item || {}) as PendudukRow;
        await addPenduduk(item);
        return NextResponse.json({ ok: true });
      }

      case 'update': {
        const id = String(body.id || '');
        if (!id) return fail('id wajib diisi.');
        await updatePenduduk(id, (body.item || {}) as PendudukRow);
        return NextResponse.json({ ok: true });
      }

      case 'delete': {
        const id = String(body.id || '');
        if (!id) return fail('id wajib diisi.');
        await deletePenduduk(id);
        return NextResponse.json({ ok: true });
      }

      case 'bulkSetField': {
        const ids = (body.ids || []) as string[];
        const field = String(body.field || '');
        const value = String(body.value ?? '');
        if (!ids.length) return fail('Tidak ada baris yang dipilih.');
        if (!field) return fail('Kolom wajib dipilih.');
        const jumlah = await bulkSetFieldPenduduk(ids, field, value);
        return NextResponse.json({ ok: true, jumlah });
      }

      case 'bulkAdd': {
        const items = (body.items || []) as PendudukRow[];
        if (!items.length) return fail('Tidak ada data untuk diimpor.');
        const jumlah = await bulkAddPenduduk(items, Boolean(body.replaceAll));
        return NextResponse.json({ ok: true, jumlah });
      }

      case 'clear': {
        await clearPenduduk();
        return NextResponse.json({ ok: true });
      }

      case 'pengurusList': {
        const items = await listPengurus();
        return NextResponse.json({ ok: true, items });
      }

      case 'pengurusSave': {
        const id = body.id ? String(body.id) : undefined;
        const newId = await savePengurus(id, (body.item || {}) as PengurusRow);
        return NextResponse.json({ ok: true, id: newId });
      }

      case 'pengurusDelete': {
        const id = String(body.id || '');
        if (!id) return fail('id wajib diisi.');
        await deletePengurus(id);
        return NextResponse.json({ ok: true });
      }

      case 'pengurusBulkAdd': {
        const items = (body.items || []) as PengurusRow[];
        if (!items.length) return fail('Tidak ada pengurus untuk diimpor.');
        const jumlah = await bulkAddPengurus(items);
        return NextResponse.json({ ok: true, jumlah });
      }

      // ----------------------------------------------------------------
      // Tabel turunan generik (Pengurus MODEL B, Proyek, Kejadian, dst.)
      // ----------------------------------------------------------------
      case 'tableList': {
        const items = await listTable(String(body.table || ''));
        return NextResponse.json({ ok: true, items });
      }

      case 'tableInfo': {
        const info = await infoTable(String(body.table || ''));
        return NextResponse.json({ ok: true, ...info });
      }

      case 'tableSave': {
        const id = body.id ? String(body.id) : undefined;
        const newId = await saveTableRow(
          String(body.table || ''),
          id,
          (body.item || {}) as Record<string, unknown>
        );
        return NextResponse.json({ ok: true, id: newId });
      }

      case 'tableDelete': {
        const id = String(body.id || '');
        if (!id) return fail('id wajib diisi.');
        await deleteTableRow(String(body.table || ''), id);
        return NextResponse.json({ ok: true });
      }

      case 'tableBulkAdd': {
        const items = (body.items || []) as Record<string, unknown>[];
        if (!items.length) return fail('Tidak ada data untuk diimpor.');
        const jumlah = await bulkAddTable(
          String(body.table || ''),
          items,
          Boolean(body.replaceAll)
        );
        return NextResponse.json({ ok: true, jumlah });
      }

      case 'tableClear': {
        await clearTable(String(body.table || ''));
        return NextResponse.json({ ok: true });
      }

      case 'report': {
        const jenis = String(body.jenis || '');
        const rw = body.rw ? String(body.rw) : '';
        const laporan = await fetchReport(jenis, rw);
        return NextResponse.json({ ok: true, ...laporan });
      }

      default:
        return fail(`Aksi tidak dikenal: ${action}`);
    }
  } catch (error) {
    // Jangan bocorkan detail backend ke klien, tapi tetap log di server.
    console.error('[api/penduduk]', action, error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem.';
    return NextResponse.json({ ok: false, error: 'server_error', message }, { status: 500 });
  }
}
