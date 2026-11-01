import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  MOCK_RENCANA_PROGRAM,
  MOCK_RENCANA_GIAT,
  MOCK_SURAT_MASUK,
  MOCK_SURAT_KELUAR,
  MOCK_KERUMAHTANGGAAN,
  MOCK_KEPEGAWAIAN,
  MOCK_BMD,
  MOCK_KEPENDUDUKAN,
  MOCK_CATATAN_SIPIL,
  MOCK_PERTANAHAN,
  MOCK_TRANTIBUM,
  MOCK_PENGURUS_RW,
  MOCK_PENGURUS_RT,
  MOCK_MUSRENBANG,
  MOCK_FASILITAS_SARPRAS,
  MOCK_INFRASTRUKTUR,
  MOCK_UMKM,
  MOCK_PEMBERDAYAAN,
  MOCK_PETUGAS_KEBERSIHAN,
  MOCK_PETUGAS_MAGOT,
  MOCK_POTENSI_KESOS,
  MOCK_PEMBINAAN_LEMBAGA,
  MOCK_PENGURUS_POSYANDU,
  MOCK_PENGURUS_KARTA,
  MOCK_PENGURUS_PKK,
  MOCK_PENGURUS_LPM,
  MOCK_BALITA,
  MOCK_BADUTA,
  MOCK_IBU_HAMIL,
  MOCK_LANSIA,
} from '@/data/mock-data';
import { ProfilEkbangRwData } from '@/types/ekbang';
import { MOCK_PROFIL_EKBANG_RW } from '@/data/mock-ekbang-profil';

export const INITIAL_DATA_MAP: Record<string, any[]> = {
  // Programs and Activities (scoped or shared)
  'sekel_rencana-program-kerja': MOCK_RENCANA_PROGRAM.filter((p) => p.role === 'sekel'),
  'pemerintahan_rencana-program-kerja': MOCK_RENCANA_PROGRAM.filter((p) => p.role === 'pemerintahan'),
  'ekbang_rencana-program-kerja': MOCK_RENCANA_PROGRAM.filter((p) => p.role === 'ekbang'),
  'kesos_rencana-program-kerja': MOCK_RENCANA_PROGRAM.filter((p) => p.role === 'kesos'),

  'sekel_rencana-giat': MOCK_RENCANA_GIAT.filter((g) => g.role === 'sekel'),
  'pemerintahan_rencana-giat': MOCK_RENCANA_GIAT.filter((g) => g.role === 'pemerintahan'),
  'ekbang_rencana-giat': MOCK_RENCANA_GIAT.filter((g) => g.role === 'ekbang'),
  'kesos_rencana-giat': MOCK_RENCANA_GIAT.filter((g) => g.role === 'kesos'),

  // Sekel
  'sekel_surat-masuk': MOCK_SURAT_MASUK,
  'sekel_surat-keluar': MOCK_SURAT_KELUAR,
  'sekel_kerumahtanggaan': MOCK_KERUMAHTANGGAAN,
  'sekel_kepegawaian': MOCK_KEPEGAWAIAN,
  'sekel_bmd': MOCK_BMD,

  // Pemerintahan
  'pemerintahan_kependudukan': MOCK_KEPENDUDUKAN,
  'pemerintahan_catatan-sipil': MOCK_CATATAN_SIPIL,
  'pemerintahan_pertanahan': MOCK_PERTANAHAN,
  'pemerintahan_trantibum': MOCK_TRANTIBUM,
  'pemerintahan_pengurus-rw': MOCK_PENGURUS_RW,
  'pemerintahan_pengurus-rt': MOCK_PENGURUS_RT,

  // Ekbang
  'ekbang_musrenbang': MOCK_MUSRENBANG,
  'ekbang_fasilitas-sarpras': MOCK_FASILITAS_SARPRAS,
  'ekbang_infrastruktur': MOCK_INFRASTRUKTUR,
  'ekbang_umkm': MOCK_UMKM,
  'ekbang_pemberdayaan': MOCK_PEMBERDAYAAN,
  'ekbang_petugas-kebersihan': MOCK_PETUGAS_KEBERSIHAN,
  'ekbang_petugas-magot': MOCK_PETUGAS_MAGOT,

  // Kesos
  'kesos_potensi-kesos': MOCK_POTENSI_KESOS,
  'kesos_pembinaan-lembaga': MOCK_PEMBINAAN_LEMBAGA,
  'kesos_pengurus-posyandu': MOCK_PENGURUS_POSYANDU,
  'kesos_pengurus-karta': MOCK_PENGURUS_KARTA,
  'kesos_pengurus-pkk': MOCK_PENGURUS_PKK,
  'kesos_pengurus-lpm': MOCK_PENGURUS_LPM,
  'kesos_balita': MOCK_BALITA,
  'kesos_baduta': MOCK_BADUTA,
  'kesos_ibu-hamil': MOCK_IBU_HAMIL,
  'kesos_lansia': MOCK_LANSIA,
};

interface KelurahanStore {
  data: Record<string, any[]>;
  profilEkbang: ProfilEkbangRwData[];

  // Generic Module Items
  getItems: (key: string) => any[];
  getItemById: (key: string, id: string) => any | undefined;
  addItem: (key: string, item: any) => void;
  updateItem: (key: string, id: string, updatedFields: any) => void;
  deleteItem: (key: string, id: string) => void;
  submitForApproval: (key: string, id: string) => void;
  approveItem: (key: string, id: string, catatan?: string) => void;
  rejectItem: (key: string, id: string, catatan: string) => void;
  disposisiSurat: (id: string, targetRole: string, targetTitle: string, instruksi: string) => void;
  resetAllData: () => void;

  // Profil Ekbang (CRUD & Read)
  getProfilEkbangList: () => ProfilEkbangRwData[];
  getProfilEkbangByRw: (rw: string) => ProfilEkbangRwData | undefined;
  updateProfilEkbangByRw: (rw: string, updatedFields: Partial<ProfilEkbangRwData>) => void;
  resetProfilEkbang: () => void;
}

export const useKelurahanStore = create<KelurahanStore>()(
  persist(
    (set, get) => ({
      data: INITIAL_DATA_MAP,
      profilEkbang: MOCK_PROFIL_EKBANG_RW,

      getItems: (key: string) => {
        const state = get();
        if (!state.data[key]) {
          return INITIAL_DATA_MAP[key] || [];
        }
        return state.data[key];
      },

      getItemById: (key: string, id: string) => {
        const items = get().getItems(key);
        return items.find((item) => String(item.id) === String(id));
      },

      addItem: (key: string, item: any) => {
        set((state) => {
          const currentItems = state.data[key] || INITIAL_DATA_MAP[key] || [];
          const newItem = {
            ...item,
            id: item.id || `item-${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          return {
            data: {
              ...state.data,
              [key]: [newItem, ...currentItems],
            },
          };
        });
      },

      updateItem: (key: string, id: string, updatedFields: any) => {
        set((state) => {
          const currentItems = state.data[key] || INITIAL_DATA_MAP[key] || [];
          const updated = currentItems.map((item) =>
            String(item.id) === String(id) ? { ...item, ...updatedFields } : item
          );
          return {
            data: {
              ...state.data,
              [key]: updated,
            },
          };
        });
      },

      deleteItem: (key: string, id: string) => {
        set((state) => {
          const currentItems = state.data[key] || INITIAL_DATA_MAP[key] || [];
          return {
            data: {
              ...state.data,
              [key]: currentItems.filter((item) => String(item.id) !== String(id)),
            },
          };
        });
      },

      submitForApproval: (key: string, id: string) => {
        get().updateItem(key, id, {
          status: 'Diajukan',
          submittedAt: new Date().toISOString(),
        });
      },

      approveItem: (key: string, id: string, catatan: string = 'Disetujui oleh Lurah.') => {
        get().updateItem(key, id, {
          status: 'Disetujui',
          catatanLurah: catatan,
          approvedAt: new Date().toISOString(),
        });
      },

      rejectItem: (key: string, id: string, catatan: string) => {
        get().updateItem(key, id, {
          status: 'Ditolak',
          catatanLurah: catatan,
          rejectedAt: new Date().toISOString(),
        });
      },

      disposisiSurat: (id: string, targetRole: string, targetTitle: string, instruksi: string) => {
        const key = 'sekel_surat-masuk';
        get().updateItem(key, id, {
          statusDisposisi: `Didisposisikan ke ${targetTitle}`,
          disposisiKe: targetRole,
          instruksiLurah: instruksi,
          disposisiAt: new Date().toISOString(),
        });
      },

      resetAllData: () => {
        set({
          data: INITIAL_DATA_MAP,
          profilEkbang: MOCK_PROFIL_EKBANG_RW,
        });
      },

      // Profil Ekbang implementation
      getProfilEkbangList: () => {
        const list = get().profilEkbang;
        return list && list.length > 0 ? list : MOCK_PROFIL_EKBANG_RW;
      },

      getProfilEkbangByRw: (rw: string) => {
        const list = get().getProfilEkbangList();
        return list.find((item) => item.rw.toLowerCase() === rw.toLowerCase());
      },

      updateProfilEkbangByRw: (rw: string, updatedFields: Partial<ProfilEkbangRwData>) => {
        set((state) => {
          const currentList = state.profilEkbang && state.profilEkbang.length > 0
            ? state.profilEkbang
            : MOCK_PROFIL_EKBANG_RW;

          const updated = currentList.map((item) => {
            if (item.rw.toLowerCase() === rw.toLowerCase()) {
              return {
                ...item,
                ...updatedFields,
                sda: {
                  ...item.sda,
                  ...(updatedFields.sda || {}),
                },
                ekonomi: {
                  ...item.ekonomi,
                  ...(updatedFields.ekonomi || {}),
                },
                sarpras: {
                  ...item.sarpras,
                  ...(updatedFields.sarpras || {}),
                },
                terakhirDiperbarui: new Date().toISOString().slice(0, 10),
              };
            }
            return item;
          });

          return { profilEkbang: updated };
        });
      },

      resetProfilEkbang: () => {
        set({ profilEkbang: MOCK_PROFIL_EKBANG_RW });
      },
    }),
    {
      name: 'lebakgede_satu_data_storage_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
