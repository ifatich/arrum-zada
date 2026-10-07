/**
 * @file galeri24Service.ts
 * @description Layanan client API resmi untuk sinkronisasi harga emas batangan Galeri 24.
 * Menggunakan arsitektur Same-Origin static sync (`data/gold-prices.json`) yang disinkronisasi
 * langsung dari server Galeri 24 melalui cron runner harian.
 *
 * Seluruh data harga, tanggal acuan, dan waktu pembaruan HARUS berasal dari data resmi (date, fetchedAt),
 * bukan dari jam atau tanggal bawaan browser.
 */

export interface Galeri24DailyItem {
  date: string
  sellingPrice: string
  buybackPrice: string
  vendorName: string
  changeSell?: string
  changeBuy?: string
  fetchedAt?: string
}

export interface Galeri24GoldPriceResult {
  hargaJual: number
  hargaBuyback: number
  tanggalAcuan: string
  waktuUpdate: string
  vendorName: string
  changeSell?: number
  changeBuy?: number
  rawDate: string
  fetchedAt?: string
  isToday: boolean
}

/**
 * Format string tanggal YYYY-MM-DD ke Bahasa Indonesia (misal: "7 Oktober 2026")
 * @param dateStr - String tanggal format ISO/YYYY-MM-DD
 */
export function formatIndonesianDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const monthIdx = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ]
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day} ${monthNames[monthIdx]} ${year}`
      }
    }
  } catch {
    // fallback
  }
  return dateStr
}

/**
 * Memformat string ISO fetchedAt ke format jam WIB (misal: "12:54 WIB")
 * @param isoStr - String ISO tanggal dan jam
 */
export function formatWibTimeFromIso(isoStr?: string): string {
  if (!isoStr) return ''
  try {
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return ''
    const parts = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d)
    return `${parts.replace('.', ':')} WIB`
  } catch {
    return ''
  }
}

/**
 * Mendapatkan string tanggal hari ini (YYYY-MM-DD) dalam zona waktu Asia/Jakarta
 * @param referenceDate - Opsional: Objek Date acuan (default: new Date())
 */
export function getJakartaTodayIsoDate(referenceDate?: Date): string {
  const d = referenceDate || new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(d)
}

/**
 * Mengecek apakah tanggal data sesuai dengan tanggal hari ini di zona Asia/Jakarta
 * @param rawDateStr - String tanggal dari data (YYYY-MM-DD)
 * @param referenceDate - Opsional: Objek Date acuan untuk pengujian deterministik
 */
export function isDateTodayJakarta(rawDateStr?: string, referenceDate?: Date): boolean {
  if (!rawDateStr) return false
  const today = getJakartaTodayIsoDate(referenceDate)
  return rawDateStr.trim().startsWith(today)
}

/**
 * Mengambil data harga emas resmi Galeri 24 yang selalu mutakhir
 * @throws Error jika data tidak dapat dimuat sama sekali (offline/404/rusak)
 * @returns Data harga jual, buyback, tanggal acuan, dan waktu pembaruan asli
 */
export async function fetchLiveGaleri24GoldPrice(): Promise<Galeri24GoldPriceResult> {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const jsonUrl = `${normalizedBase}data/gold-prices.json?t=${Date.now()}`

  // 1. Ambil data real Galeri 24 dari file static sinkronisasi harian (Same-Origin)
  try {
    const response = await fetch(jsonUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (response.ok) {
      const items = (await response.json()) as Galeri24DailyItem[]
      if (Array.isArray(items) && items.length > 0) {
        const galeriItem = items.find(
          (it) => it.vendorName && it.vendorName.toUpperCase().trim() === 'GALERI 24',
        )

        if (galeriItem) {
          const jual = Number(galeriItem.sellingPrice)
          const buyback = Number(galeriItem.buybackPrice)

          if (!isNaN(jual) && jual > 0) {
            const rawDate = galeriItem.date || ''
            return {
              hargaJual: jual,
              hargaBuyback: !isNaN(buyback) && buyback > 0 ? buyback : Math.round(jual * 0.94),
              tanggalAcuan: formatIndonesianDate(rawDate),
              waktuUpdate: formatWibTimeFromIso(galeriItem.fetchedAt),
              vendorName: galeriItem.vendorName,
              changeSell: galeriItem.changeSell ? Number(galeriItem.changeSell) : undefined,
              changeBuy: galeriItem.changeBuy ? Number(galeriItem.changeBuy) : undefined,
              rawDate,
              fetchedAt: galeriItem.fetchedAt,
              isToday: isDateTodayJakarta(rawDate),
            }
          }
        }
      }
    }
  } catch {
    // Tangani network error atau parse failure
  }

  // Jika data tidak bisa dimuat sama sekali: lempar error, BUKAN harga bawaan karangan
  throw new Error('Data harga emas resmi Galeri 24 tidak dapat dimuat. Silakan periksa koneksi internet.')
}
