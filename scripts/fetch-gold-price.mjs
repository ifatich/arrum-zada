import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/data')
const outFile = path.join(outDir, 'gold-prices.json')

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

    fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf-8')
    console.log('✓ Berhasil menyimpan data harga emas Galeri 24 ke:', outFile)
  } catch (err) {
    console.warn('⚠️ Gagal fetch live API, mempertahankan data yang ada:', err.message)
    // Jika file belum ada sama sekali, buat file fallback
    if (!fs.existsSync(outFile)) {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true })
      }
      const fallbackData = [
        {
          date: new Date().toISOString().split('T')[0],
          sellingPrice: '2510000',
          buybackPrice: '2366000',
          vendorName: 'GALERI 24',
          changeSell: '-0.12',
          changeBuy: '-0.13',
        },
      ]
      fs.writeFileSync(outFile, JSON.stringify(fallbackData, null, 2), 'utf-8')
    }
  }
}

fetchLatestGoldPrices()
