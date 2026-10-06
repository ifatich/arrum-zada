/**
 * @file simulasi.ts
 * @description Definisi tipe data dan kontrak interface untuk modul Simulasi Rencana Emas Haji.
 */

/** Interface data kartu proyeksi tahunan */
export interface ProyeksiCardItem {
  id: string
  tahunLabel: string
  hargaJual: string
  nilaiEmas: string
  persenPertumbuhan: string
}

/** Interface konstanta acuan harga emas resmi Galeri 24 */
export interface AcuanHargaEmas {
  hargaJual: number
  hargaBuyback: number
  lajuKenaikanTahunan: number
}

/** Interface ringkasan kalkulasi simulasi */
export interface RingkasanSimulasi {
  totalKebutuhan: number
  tahunInvestasi: number
  totalBulan: number
  gramasiEmas: number
  nilaiEmasHariIni: number
  nilaiEmasAkhir: number
  tabunganPerBulanRp: number
  tabunganPerBulanGram: string
  selisihPertumbuhanRp: number
  persentasePertumbuhan: number
  estimasiHargaJualMasaDepan: number
  estimasiHargaBuybackMasaDepan: number
  isValidTahun: boolean
  errorMessage: string
}
