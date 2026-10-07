/**
 * @file useArrumSimulasi.ts
 * @description Composable logika bisnis kalkulasi simulasi perencanaan emas haji Arrum Zada.
 * Terintegrasi langsung dengan API live harga emas resmi Galeri 24 (https://galeri24.co.id/api/gold-prices/daily-update).
 */

import { ref, computed, onMounted } from 'vue'
import type { ProyeksiCardItem, AcuanHargaEmas } from '@/types/simulasi'
import {
  fetchLiveGaleri24GoldPrice,
} from '@/services/galeri24Service'

/** Konstanta dasar acuan kenaikan harga emas */
export const ACUAN_HARGA: AcuanHargaEmas = {
  hargaJual: 0,
  hargaBuyback: 0,
  lajuKenaikanTahunan: 0.07, // 7% per tahun rata-rata kenaikan historis konservatif
}

/** Pilihan cepat jangka waktu menabung (dalam tahun) */
export const QUICK_YEAR_CHIPS: readonly number[] = [5, 10, 15, 20, 25] as const

// State Global Reaktif Harga Emas (Single Source of Truth agar sinkron di seluruh komponen)
const hargaJual = ref<number>(0)
const hargaBuyback = ref<number>(0)
const tanggalAcuan = ref<string>('')
const waktuUpdate = ref<string>('')
const rawDate = ref<string>('')
const isPriceToday = ref<boolean>(false)
const isLoadingHarga = ref<boolean>(false)
const lastSyncSuccess = ref<boolean>(false)
const isPriceLoaded = ref<boolean>(false)
const hasPriceError = ref<boolean>(false)
const priceErrorMessage = ref<string>('')

// State Feedback Notifikasi Pembaruan Harga
const syncFeedbackMessage = ref<string>('')
const syncFeedbackType = ref<'success' | 'info' | 'danger'>('info')
let syncFeedbackTimer: ReturnType<typeof setTimeout> | null = null

function triggerSyncFeedback(msg: string, type: 'success' | 'info' | 'danger') {
  syncFeedbackMessage.value = msg
  syncFeedbackType.value = type
  if (syncFeedbackTimer) clearTimeout(syncFeedbackTimer)
  syncFeedbackTimer = setTimeout(() => {
    syncFeedbackMessage.value = ''
  }, 4000)
}

/**
 * Composable utama untuk mengelola state dan kalkulasi simulasi emas haji
 *
 * @returns State reaktif, nilai terhitung (computed), dan fungsi handler simulasi
 */
export function useArrumSimulasi() {
  // State Input Form Kebutuhan Dana (Default kosong)
  const pelunasanHaji = ref<string>('')
  const persiapanHaji = ref<string>('')
  const keperluanLain = ref<string>('')

  // State Jangka Waktu Perencanaan (Tahun)
  const waktuInvestasi = ref<string>('10')

  // State Notifikasi Feedback Salin Ringkasan
  const notifCopied = ref<boolean>(false)

  /**
   * Mengambil pembaruan harga emas resmi secara live dari API Galeri 24
   */
  const refreshHargaEmas = async (): Promise<void> => {
    isLoadingHarga.value = true
    const prevPrice = hargaJual.value
    const prevDate = tanggalAcuan.value
    const wasLoaded = isPriceLoaded.value

    try {
      const data = await fetchLiveGaleri24GoldPrice()
      hargaJual.value = data.hargaJual
      hargaBuyback.value = data.hargaBuyback
      tanggalAcuan.value = data.tanggalAcuan
      waktuUpdate.value = data.waktuUpdate
      rawDate.value = data.rawDate
      isPriceToday.value = data.isToday
      hasPriceError.value = false
      priceErrorMessage.value = ''
      isPriceLoaded.value = true
      lastSyncSuccess.value = true

      if (wasLoaded && prevPrice === data.hargaJual && prevDate === data.tanggalAcuan) {
        triggerSyncFeedback('Data harga sudah yang terbaru (tidak ada pembaruan).', 'info')
      } else {
        triggerSyncFeedback(`Harga emas resmi Galeri 24 berhasil dimuat (per ${data.tanggalAcuan}).`, 'success')
      }
    } catch {
      lastSyncSuccess.value = false
      if (!isPriceLoaded.value) {
        hasPriceError.value = true
        priceErrorMessage.value = 'Data harga emas resmi Galeri 24 tidak dapat dimuat. Periksa koneksi internet.'
      }
      triggerSyncFeedback('Gagal memuat harga terbaru dari Galeri 24. Periksa koneksi internet.', 'danger')
    } finally {
      isLoadingHarga.value = false
    }
  }

  // Sinkronisasi otomatis saat komponen pertama kali terpasang
  onMounted(() => {
    if (!lastSyncSuccess.value) {
      refreshHargaEmas()
    }
  })

  /**
   * Memformat angka ke format ribuan standar Indonesia (titik sebagai pemisah ribuan)
   * @param num - Angka numerik yang akan diformat
   */
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  /**
   * Memformat angka ke format mata uang Rupiah bulat tanpa desimal
   * @param val - Nilai nominal dalam Rupiah
   */
  const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Math.ceil(val))
  }

  /**
   * Menghasilkan teks terbilang singkat dalam juta/miliar untuk mempermudah pemahaman nasabah
   * @param rawVal - String input mentah dari form
   */
  const getTerbilang = (rawVal: string): string => {
    const n = Number(rawVal)
    if (!rawVal || isNaN(n) || n === 0) return ''
    if (n >= 1_000_000_000) {
      const bil = (n / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })
      return `Setara ${bil} Miliar Rupiah`
    }
    if (n >= 1_000_000) {
      const mil = (n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })
      return `Setara ${mil} Juta Rupiah`
    }
    if (n >= 1_000) {
      const rb = (n / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })
      return `Setara ${rb} Ribu Rupiah`
    }
    return `Rp ${formatNumber(n)}`
  }

  // Konversi input string ke numerik aman (sanitized)
  const numPelunasan = computed<number>(() => {
    const val = Number(pelunasanHaji.value)
    return isNaN(val) || val < 0 ? 0 : val
  })

  const numPersiapan = computed<number>(() => {
    const val = Number(persiapanHaji.value)
    return isNaN(val) || val < 0 ? 0 : val
  })

  const numKeperluan = computed<number>(() => {
    const val = Number(keperluanLain.value)
    return isNaN(val) || val < 0 ? 0 : val
  })

  // Akumulasi Total Kebutuhan Dana Haji
  const totalKebutuhan = computed<number>(() => {
    return numPelunasan.value + numPersiapan.value + numKeperluan.value
  })

  // Sanitasi nilai tahun investasi (1 - 30 tahun)
  const tahunInvestasi = computed<number>(() => {
    const t = parseInt(waktuInvestasi.value, 10)
    return isNaN(t) ? 0 : t
  })

  // Total durasi menabung dalam satuan bulan
  const totalBulan = computed<number>(() => {
    return tahunInvestasi.value > 0 ? tahunInvestasi.value * 12 : 0
  })

  // Validasi input jangka waktu
  const isValidTahun = computed<boolean>(() => {
    return tahunInvestasi.value >= 1 && tahunInvestasi.value <= 30
  })

  // Pesan error validasi tahun
  const errorMessage = computed<string>(() => {
    if (!waktuInvestasi.value) return 'Jangka waktu menabung wajib diisi.'
    if (tahunInvestasi.value < 1) return 'Jangka waktu menabung minimal 1 tahun.'
    if (tahunInvestasi.value > 30) return 'Jangka waktu menabung maksimal 30 tahun.'
    return ''
  })

  // Faktor Kenaikan Nilai Majemuk Emas: (1 + r)^t
  const faktorKenaikan = computed<number>(() => {
    return Math.pow(1 + ACUAN_HARGA.lajuKenaikanTahunan, tahunInvestasi.value)
  })

  // Target Gramasi Emas Fisik (Dibulatkan ke atas untuk kepastian perlindungan dana)
  const gramasiEmas = computed<number>(() => {
    if (!totalKebutuhan.value || !hargaJual.value) return 0
    return Math.ceil(totalKebutuhan.value / hargaJual.value)
  })

  // Nilai Modal Emas Hari Ini (Berdasarkan harga jual resmi Galeri 24)
  const nilaiEmasHariIni = computed<number>(() => {
    return gramasiEmas.value * hargaJual.value
  })

  // Estimasi Nilai Emas di Akhir Periode (Berdasarkan estimasi buyback masa depan)
  const nilaiEmasAkhir = computed<number>(() => {
    return Math.round(gramasiEmas.value * hargaBuyback.value * faktorKenaikan.value)
  })

  // Estimasi Tabungan Rutin Bulanan (Rupiah)
  const tabunganPerBulanRp = computed<number>(() => {
    if (totalBulan.value === 0 || nilaiEmasHariIni.value === 0) return 0
    return Math.ceil(nilaiEmasHariIni.value / totalBulan.value)
  })

  // Estimasi Tabungan Rutin Bulanan (Gram)
  const tabunganPerBulanGram = computed<string>(() => {
    if (totalBulan.value === 0 || gramasiEmas.value === 0) return '0'
    const val = gramasiEmas.value / totalBulan.value
    return val < 0.1 ? val.toFixed(3) : val.toFixed(2)
  })

  // Selisih Pertumbuhan Nilai Aset (Gain Proteksi Inflasi)
  const selisihPertumbuhanRp = computed<number>(() => {
    return Math.max(0, nilaiEmasAkhir.value - nilaiEmasHariIni.value)
  })

  // Persentase Pertumbuhan Nilai
  const persentasePertumbuhan = computed<number>(() => {
    if (!nilaiEmasHariIni.value) return 0
    return Math.round(((nilaiEmasAkhir.value - nilaiEmasHariIni.value) / nilaiEmasHariIni.value) * 100)
  })

  // Estimasi Harga Jual & Buyback Galeri 24 per Gram di Masa Depan
  const estimasiHargaJualMasaDepan = computed<number>(() => {
    return Math.round(hargaJual.value * faktorKenaikan.value)
  })

  const estimasiHargaBuybackMasaDepan = computed<number>(() => {
    return Math.round(hargaBuyback.value * faktorKenaikan.value)
  })

  // Daftar Kartu Proyeksi Tahunan
  const proyeksiCards = computed<ProyeksiCardItem[]>(() => {
    if (!isValidTahun.value || gramasiEmas.value === 0) return []
    const list: ProyeksiCardItem[] = []
    for (let y = 1; y <= tahunInvestasi.value; y++) {
      const k = Math.pow(1 + ACUAN_HARGA.lajuKenaikanTahunan, y)
      const estimasiNilai = Math.round(gramasiEmas.value * hargaBuyback.value * k)
      const persen = Math.round(((estimasiNilai - nilaiEmasHariIni.value) / nilaiEmasHariIni.value) * 100)
      list.push({
        id: String(y),
        tahunLabel: `Tahun ke-${y}`,
        hargaJual: formatRupiah(hargaJual.value * k),
        nilaiEmas: formatRupiah(estimasiNilai),
        persenPertumbuhan: `+${persen}%`,
      })
    }
    return list
  })

  /**
   * Memilih jangka waktu cepat melalui chip filter
   * @param val - Angka tahun yang dipilih
   */
  const handleSelectYear = (val: number): void => {
    waktuInvestasi.value = String(val)
  }

  /**
   * Menyusun ringkasan simulasi terformat dan menyalinnya ke clipboard pengguna
   */
  const handleCopySummary = async (): Promise<void> => {
    const f = faktorKenaikan.value
    const textSummary = `*RINGKASAN SIMULASI PERENCANAAN EMAS HAJI*
Program: Arrum Zada - Perencanaan Finansial Haji
Tanggal Pembaruan Harga: ${tanggalAcuan.value} (${waktuUpdate.value})
-----------------------------------------
- Total Target Kebutuhan Haji: ${formatRupiah(totalKebutuhan.value)}
- Jangka Waktu Rencana: ${tahunInvestasi.value} Tahun (${totalBulan.value} Bulan)
- Emas Batangan yang Diperlukan: ${formatNumber(gramasiEmas.value)} Gram
- Modal Awal Emas Hari Ini: ${formatRupiah(nilaiEmasHariIni.value)}
- Estimasi Tabungan Emas Cicil per Bulan: ±${formatRupiah(tabunganPerBulanRp.value)}/bln (±${tabunganPerBulanGram.value} gr/bln, selama ${totalBulan.value} bulan)
  (Harga emas dikunci saat akad, cicilan tetap setiap bulan selama ${totalBulan.value} bulan. Harga akad mengikuti harga resmi Galeri 24 pada saat transaksi. Belum termasuk biaya lain yang berlaku saat akad.)
- Estimasi Nilai Emas saat Berangkat: ${formatRupiah(nilaiEmasAkhir.value)}
- Proteksi Nilai Aset (Gain Inflasi): +${formatRupiah(selisihPertumbuhanRp.value)} (+${persentasePertumbuhan.value}%)

Acuan Parameter:
- Harga Jual Galeri 24: ${formatRupiah(hargaJual.value)}/gr
- Harga Buyback Galeri 24: ${formatRupiah(hargaBuyback.value)}/gr
- Proyeksi Harga Emas Galeri 24: Jual ${formatRupiah(hargaJual.value * f)}/gr | Buyback ${formatRupiah(hargaBuyback.value * f)}/gr

*Simulasi mengacu pada harga emas batangan Galeri 24 (${formatRupiah(hargaJual.value)}/gr) dengan asumsi pertumbuhan historis 7% per tahun.
*Informasi lebih lanjut dapat dikonsultasikan melalui outlet terdekat.`

    let copied = false
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textSummary)
        copied = true
      }
    } catch {
      // Browser permissions fallback
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = textSummary
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
        copied = true
      } catch (e) {
        console.warn('Fallback copy failed:', e)
      }
    }

    notifCopied.value = true
    setTimeout(() => {
      notifCopied.value = false
    }, 3500)
  }

  /**
   * Mereset seluruh input simulasi kembali ke kondisi awal
   */
  const handleReset = (): void => {
    pelunasanHaji.value = ''
    persiapanHaji.value = ''
    keperluanLain.value = ''
    waktuInvestasi.value = '10'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.body?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    // Inputs
    pelunasanHaji,
    persiapanHaji,
    keperluanLain,
    waktuInvestasi,
    notifCopied,
    quickYearChips: QUICK_YEAR_CHIPS,

    // Live Gold Price State & Methods
    hargaJual,
    hargaBuyback,
    tanggalAcuan,
    waktuUpdate,
    rawDate,
    isPriceToday,
    isLoadingHarga,
    lastSyncSuccess,
    isPriceLoaded,
    hasPriceError,
    priceErrorMessage,
    syncFeedbackMessage,
    syncFeedbackType,
    refreshHargaEmas,

    // Computeds
    numPelunasan,
    numPersiapan,
    numKeperluan,
    totalKebutuhan,
    tahunInvestasi,
    totalBulan,
    isValidTahun,
    errorMessage,
    faktorKenaikan,
    gramasiEmas,
    nilaiEmasHariIni,
    nilaiEmasAkhir,
    tabunganPerBulanRp,
    tabunganPerBulanGram,
    selisihPertumbuhanRp,
    persentasePertumbuhan,
    estimasiHargaJualMasaDepan,
    estimasiHargaBuybackMasaDepan,
    proyeksiCards,

    // Methods
    formatNumber,
    formatRupiah,
    getTerbilang,
    handleSelectYear,
    handleCopySummary,
    handleReset,
  }
}

export type UseArrumSimulasiReturn = ReturnType<typeof useArrumSimulasi>
