import { toast } from '@/lib/toast';

export async function triggerOfficialProfilExcelDownload(
  rw: string = 'ALL',
  kesosList?: any[],
  ekbangList?: any[]
) {
  const toastId = toast.info(
    'Menyiapkan Dokumen Excel...',
    'Menyusun lembar cover MODEL E dan formulir PROFIL 509 baris standar resmi pemerintah...'
  );

  try {
    const res = await fetch('/api/export-profil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rw,
        kesosList,
        ekbangList,
      }),
    });

    if (!res.ok) {
      let errMsg = `Status ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson?.error) errMsg = errJson.error;
      } catch (_) {
        // use default statusText
      }
      throw new Error(errMsg);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const filename =
      rw === 'ALL'
        ? 'Profil-Kelurahan-Lebakgede-Standar-Resmi-16RW.xlsx'
        : `Profil-Kelurahan-Lebakgede-${rw.replace(/\s+/g, '-')}-Standar-Resmi.xlsx`;

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success(
      'Unduh Berhasil!',
      `File Excel resmi "${filename}" (Sheet PROFIL + MODEL E) berhasil diunduh.`
    );
  } catch (err: any) {
    console.error('Download error:', err);
    // Fallback: try direct GET navigation if POST fails
    try {
      window.location.href = `/api/export-profil?rw=${encodeURIComponent(rw)}`;
    } catch (_) {
      toast.error('Gagal Mengunduh', err.message || 'Terjadi kesalahan saat memproses ekspor Excel.');
    }
  }
}
