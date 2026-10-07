import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fetchLatestGoldPrices, getJakartaIsoString } from '../scripts/fetch-gold-price.mjs'

describe('fetchLatestGoldPrices - Automated Fetch Scenarios', () => {
  let tempDir: string
  let tempOutFile: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arrum-test-fetch-'))
    tempOutFile = path.join(tempDir, 'gold-prices.json')
  })

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('Skenario 1 (Sukses): Menyimpan data harga baru dengan timestamp fetchedAt Jakarta (+07:00)', async () => {
    const mockApiResponse = [
      {
        date: '2026-10-07',
        sellingPrice: '2516000',
        buybackPrice: '2368000',
        vendorName: 'GALERI 24',
        changeSell: '0.24',
        changeBuy: '0.08',
      },
    ]

    const mockFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
    })

    const result = await fetchLatestGoldPrices({
      targetOutDir: tempDir,
      targetOutFile: tempOutFile,
      fetchFn: mockFetch as unknown as typeof fetch,
      exitOnError: false,
    })

    expect(result.success).toBe(true)
    expect(fs.existsSync(tempOutFile)).toBe(true)

    const writtenData = JSON.parse(fs.readFileSync(tempOutFile, 'utf-8'))
    expect(Array.isArray(writtenData)).toBe(true)
    expect(writtenData[0].vendorName).toBe('GALERI 24')
    expect(writtenData[0].sellingPrice).toBe('2516000')
    expect(writtenData[0].fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+07:00$/)
  })

  it('Skenario 2 (Gagal API, File Lama Ada): Mempertahankan file cache lama tanpa mengubah konten atau timestamp', async () => {
    const legacyData = [
      {
        date: '2026-10-01',
        sellingPrice: '2450000',
        buybackPrice: '2300000',
        vendorName: 'GALERI 24',
        fetchedAt: '2026-10-01T10:00:00+07:00',
      },
    ]
    fs.writeFileSync(tempOutFile, JSON.stringify(legacyData, null, 2), 'utf-8')

    // Mock API gagal (HTTP 500)
    const mockFailingFetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const result = await fetchLatestGoldPrices({
      targetOutDir: tempDir,
      targetOutFile: tempOutFile,
      fetchFn: mockFailingFetch as unknown as typeof fetch,
      exitOnError: false,
    })

    expect(result.success).toBe(false)
    expect(result.preserved).toBe(true)

    // Pastikan konten file lama tetap utuh dan tidak tertimpa data palsu
    const preservedContent = JSON.parse(fs.readFileSync(tempOutFile, 'utf-8'))
    expect(preservedContent[0].date).toBe('2026-10-01')
    expect(preservedContent[0].sellingPrice).toBe('2450000')
    expect(preservedContent[0].fetchedAt).toBe('2026-10-01T10:00:00+07:00')
  })

  it('Skenario 3 (Gagal API, File Belum Ada): Melempar error dan tidak membuat file karangan/rekayasa', async () => {
    expect(fs.existsSync(tempOutFile)).toBe(false)

    // Mock jaringan putus (network exception)
    const mockNetworkDownFetch = async () => {
      throw new Error('Connection refused / DNS lookup failed')
    }

    await expect(
      fetchLatestGoldPrices({
        targetOutDir: tempDir,
        targetOutFile: tempOutFile,
        fetchFn: mockNetworkDownFetch as unknown as typeof fetch,
        exitOnError: false,
      }),
    ).rejects.toThrow('Connection refused / DNS lookup failed')

    // Pastikan tidak ada file palsu yang dibuat
    expect(fs.existsSync(tempOutFile)).toBe(false)
  })

  it('getJakartaIsoString menghasilkan string ISO ber-offset +07:00', () => {
    const fixedDate = new Date('2026-10-07T06:55:00.000Z') // 13:55 WIB
    const isoWib = getJakartaIsoString(fixedDate)
    expect(isoWib).toBe('2026-10-07T13:55:00+07:00')
  })
})
