/**
 * @file useSimulasiBrd.ts
 * @description Composable logika bisnis untuk PRD terbaru.
 * Termasuk perubahan dari jangka waktu cicilan menjadi Dropdown Tahun Keberangkatan.
 */

import { ref, computed, onMounted } from 'vue'
import type { ProyeksiCardItem, AcuanHargaEmas } from '@/types/simulasi'
import { fetchLiveGaleri24GoldPrice } from '@/services/galeri24Service'

export const ACUAN_HARGA: AcuanHargaEmas = {
  hargaJual: 0,
  hargaBuyback: 0,
  lajuKenaikanTahunan: 0.07,
}

// State Global Reaktif Harga Emas
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

export function useSimulasiBrd() {
  const pelunasanHaji = ref<string>('')
  const persiapanHaji = ref<string>('')
  const keperluanLain = ref<string>('')

  // NEW: Tahun Keberangkatan menggunakan dropdown
  const currentYear = new Date().getFullYear()
  const tahunKeberangkatan = ref<number>(currentYear + 10)
  
  // Opsi Tahun Keberangkatan Dropdown
  const opsiTahunKeberangkatan = computed(() => {
    const list = []
    for (let i = 1; i <= 30; i++) {
      list.push(currentYear + i)
    }
    return list
  })

  const notifCopied = ref<boolean>(false)

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
        triggerSyncFeedback(`Data harga dimuat (per ${data.tanggalAcuan})`, 'info')
      } else {
        triggerSyncFeedback(`Data harga dimuat (per ${data.tanggalAcuan})`, 'success')
      }
    } catch {
      lastSyncSuccess.value = false
      if (!isPriceLoaded.value) {
        hasPriceError.value = true
        priceErrorMessage.value = 'Data harga emas resmi Galeri 24 tidak dapat dimuat.'
      }
      triggerSyncFeedback('Gagal memuat harga terbaru dari Galeri 24.', 'danger')
    } finally {
      isLoadingHarga.value = false
    }
  }

  onMounted(() => {
    if (!lastSyncSuccess.value) refreshHargaEmas()
  })

  const formatNumber = (num: number): string => new Intl.NumberFormat('id-ID').format(num)
  const formatRupiah = (val: number): string => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.ceil(val))
  const getTerbilang = (rawVal: string): string => {
    const n = Number(rawVal)
    if (!rawVal || isNaN(n) || n === 0) return ''
    if (n >= 1_000_000_000) return `Setara ${(n / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Miliar Rupiah`
    if (n >= 1_000_000) return `Setara ${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Juta Rupiah`
    if (n >= 1_000) return `Setara ${(n / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Ribu Rupiah`
    return `Rp ${formatNumber(n)}`
  }

  const numPelunasan = computed<number>(() => isNaN(Number(pelunasanHaji.value)) ? 0 : Number(pelunasanHaji.value))
  const numPersiapan = computed<number>(() => isNaN(Number(persiapanHaji.value)) ? 0 : Number(persiapanHaji.value))
  const numKeperluan = computed<number>(() => isNaN(Number(keperluanLain.value)) ? 0 : Number(keperluanLain.value))
  const totalKebutuhan = computed<number>(() => numPelunasan.value + numPersiapan.value + numKeperluan.value)

  // Kalkulasi tahun investasi = tahun keberangkatan - tahun saat ini
  const tahunInvestasi = computed<number>(() => Math.max(1, tahunKeberangkatan.value - currentYear))
  const totalBulan = computed<number>(() => tahunInvestasi.value * 12)
  const isValidTahun = computed<boolean>(() => tahunInvestasi.value >= 1 && tahunInvestasi.value <= 30)
  const errorMessage = computed<string>(() => !isValidTahun.value ? 'Tahun keberangkatan tidak valid.' : '')
  
  const faktorKenaikan = computed<number>(() => Math.pow(1 + ACUAN_HARGA.lajuKenaikanTahunan, tahunInvestasi.value))
  const gramasiEmas = computed<number>(() => totalKebutuhan.value && hargaJual.value ? Math.ceil(totalKebutuhan.value / hargaJual.value) : 0)
  const nilaiEmasHariIni = computed<number>(() => gramasiEmas.value * hargaJual.value)
  const nilaiEmasAkhir = computed<number>(() => Math.round(gramasiEmas.value * hargaBuyback.value * faktorKenaikan.value))
  const tabunganPerBulanRp = computed<number>(() => totalBulan.value > 0 ? Math.ceil(nilaiEmasHariIni.value / totalBulan.value) : 0)
  const tabunganPerBulanGram = computed<string>(() => totalBulan.value > 0 ? (gramasiEmas.value / totalBulan.value).toFixed(2) : '0')
  const selisihPertumbuhanRp = computed<number>(() => Math.max(0, nilaiEmasAkhir.value - nilaiEmasHariIni.value))
  const persentasePertumbuhan = computed<number>(() => nilaiEmasHariIni.value ? Math.round(((nilaiEmasAkhir.value - nilaiEmasHariIni.value) / nilaiEmasHariIni.value) * 100) : 0)

  const proyeksiCards = computed<ProyeksiCardItem[]>(() => {
    if (!isValidTahun.value || gramasiEmas.value === 0) return []
    const list: ProyeksiCardItem[] = []
    for (let y = 1; y <= tahunInvestasi.value; y++) {
      const k = Math.pow(1 + ACUAN_HARGA.lajuKenaikanTahunan, y)
      const estimasiNilai = Math.round(gramasiEmas.value * hargaBuyback.value * k)
      const persen = Math.round(((estimasiNilai - nilaiEmasHariIni.value) / nilaiEmasHariIni.value) * 100)
      list.push({ 
        id: String(y), 
        tahunLabel: `Tahun ke-${y} (${currentYear + y})`, 
        hargaJual: formatRupiah(hargaJual.value * k), 
        nilaiEmas: formatRupiah(estimasiNilai), 
        persenPertumbuhan: `+${persen}%` 
      })
    }
    return list
  })

  const getSummaryText = (): string => {
    return `*RINGKASAN SIMULASI PERENCANAAN EMAS HAJI*
Program: Arrum Zada - Perencanaan Finansial Haji
Tanggal Pembaruan Harga: ${tanggalAcuan.value}${waktuUpdate.value ? ` (${waktuUpdate.value})` : ''}
-----------------------------------------
- Total Target Kebutuhan Haji: ${formatRupiah(totalKebutuhan.value)}
- Tahun Keberangkatan: ${tahunKeberangkatan.value} (${tahunInvestasi.value} Tahun / ${totalBulan.value} Bulan)
- Emas Batangan yang Diperlukan: ${formatNumber(gramasiEmas.value)} Gram
- Modal Awal Emas Hari Ini: ${formatRupiah(nilaiEmasHariIni.value)}
- Estimasi Tabungan Emas Cicil per Bulan: ±${formatRupiah(tabunganPerBulanRp.value)}/bln (±${tabunganPerBulanGram.value} gr/bln, selama ${totalBulan.value} bulan)
- Estimasi Nilai Emas saat Berangkat: ${formatRupiah(nilaiEmasAkhir.value)}
- Estimasi Selisih Nilai Emas: +${formatRupiah(selisihPertumbuhanRp.value)} (+${persentasePertumbuhan.value}%)

Acuan Parameter:
- Harga Jual Galeri 24: ${formatRupiah(hargaJual.value)}/gr
- Harga Buyback Galeri 24: ${formatRupiah(hargaBuyback.value)}/gr

*Simulasi mengacu pada harga emas batangan Galeri 24 dengan asumsi kenaikan 7% per tahun.`
  }

  const handleCopySummary = async (): Promise<void> => {
    const textSummary = getSummaryText()
    let copied = false
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textSummary)
        copied = true
      }
    } catch {}
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
      } catch (e) {}
    }
    notifCopied.value = true
    setTimeout(() => { notifCopied.value = false }, 3500)
  }

  const handleDownloadSummary = (): void => {
    const textSummary = getSummaryText()
    const blob = new Blob([textSummary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Ringkasan_Simulasi_ArrumZada_${new Date().getTime()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = (): void => {
    pelunasanHaji.value = ''
    persiapanHaji.value = ''
    keperluanLain.value = ''
    tahunKeberangkatan.value = currentYear + 10
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.body?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    pelunasanHaji, persiapanHaji, keperluanLain, tahunKeberangkatan, opsiTahunKeberangkatan, currentYear,
    notifCopied, hargaJual, hargaBuyback, tanggalAcuan, waktuUpdate, rawDate, isPriceToday, isLoadingHarga,
    lastSyncSuccess, isPriceLoaded, hasPriceError, priceErrorMessage, syncFeedbackMessage, syncFeedbackType,
    refreshHargaEmas, numPelunasan, numPersiapan, numKeperluan, totalKebutuhan, tahunInvestasi, totalBulan,
    isValidTahun, errorMessage, faktorKenaikan, gramasiEmas, nilaiEmasHariIni, nilaiEmasAkhir, tabunganPerBulanRp,
    tabunganPerBulanGram, selisihPertumbuhanRp, persentasePertumbuhan, proyeksiCards, formatNumber, formatRupiah,
    getTerbilang, handleCopySummary, handleDownloadSummary, handleReset
  }
}
