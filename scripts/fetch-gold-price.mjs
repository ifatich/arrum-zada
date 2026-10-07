import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/data')
const outFile = path.join(outDir, 'gold-prices.json')

function getJakartaIsoString() {
  const now = new Date()
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

async function fetchLatestGoldPrices() {
  try {
    console.log('Fetching live gold prices directly from Galeri 24 server...')
    const res = await fetch('https://galeri24.co.id/api/gold-prices/daily-update', {
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

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true })
    }

    const fetchedAt = getJakartaIsoString()
    const enrichedData = data.map((item) => ({
      ...item,
      fetchedAt,
    }))

    fs.writeFileSync(outFile, JSON.stringify(enrichedData, null, 2), 'utf-8')
    console.log('✓ Berhasil menyimpan data harga emas Galeri 24 ke:', outFile)
  } catch (err) {
    if (fs.existsSync(outFile)) {
      console.warn('⚠️ Gagal fetch live API dari Galeri 24. Mempertahankan file lama apa adanya:', err.message)
      // Pertahankan file lama apa adanya (jangan ubah date atau fetchedAt)
      return
    }

    // Saat gagal dan file belum ada: jangan menulis harga karangan. Keluar dengan error agar langkah CI gagal terlihat.
    console.error('❌ Gagal fetch data dari Galeri 24 dan file cache belum ada:', err.message)
    process.exit(1)
  }
}

fetchLatestGoldPrices()
