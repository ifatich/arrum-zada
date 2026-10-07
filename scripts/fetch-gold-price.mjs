import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultOutDir = process.env.GOLD_PRICES_OUT_DIR || path.resolve(__dirname, '../public/data')
const defaultOutFile = process.env.GOLD_PRICES_OUT_FILE || path.join(defaultOutDir, 'gold-prices.json')
const defaultApiUrl = process.env.GOLD_PRICES_API_URL || 'https://galeri24.co.id/api/gold-prices/daily-update'

export function getJakartaIsoString(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+07:00`
}

export async function fetchLatestGoldPrices({
  targetOutDir = defaultOutDir,
  targetOutFile = defaultOutFile,
  apiUrl = defaultApiUrl,
  fetchFn = globalThis.fetch,
  exitOnError = true,
} = {}) {
  try {
    console.log('Fetching live gold prices directly from Galeri 24 server...')
    const res = await fetchFn(apiUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; ArrumZadaSync/1.0)',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data array kosong dari API Galeri 24')
    }

    if (!fs.existsSync(targetOutDir)) {
      fs.mkdirSync(targetOutDir, { recursive: true })
    }

    const fetchedAt = getJakartaIsoString()
    const enrichedData = data.map((item) => ({
      ...item,
      fetchedAt,
    }))

    fs.writeFileSync(targetOutFile, JSON.stringify(enrichedData, null, 2), 'utf-8')
    console.log('✓ Berhasil menyimpan data harga emas Galeri 24 ke:', targetOutFile)
    return { success: true, enrichedData }
  } catch (err) {
    if (fs.existsSync(targetOutFile)) {
      console.warn('⚠️ Gagal fetch live API dari Galeri 24. Mempertahankan file lama apa adanya:', err.message)
      return { success: false, preserved: true, error: err.message }
    }

    console.error('❌ Gagal fetch data dari Galeri 24 dan file cache belum ada:', err.message)
    if (exitOnError) {
      process.exit(1)
    }
    throw err
  }
}

// Eksekusi otomatis jika dijalankan langsung lewat CLI (node scripts/fetch-gold-price.mjs)
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) {
  fetchLatestGoldPrices().catch(() => {
    process.exit(1)
  })
}
