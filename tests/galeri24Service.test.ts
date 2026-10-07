import { describe, it, expect } from 'vitest'
import {
  isDateTodayJakarta,
  getJakartaTodayIsoDate,
  formatIndonesianDate,
  formatWibTimeFromIso,
} from '@/services/galeri24Service'

describe('isDateTodayJakarta - Batas Tengah Malam WIB (UTC+7)', () => {
  // 16:59:00Z = 23:59:00 WIB (1 menit sebelum tengah malam di Jakarta) -> tanggal masih 2026-10-07
  const preMidnightUtc = new Date('2026-10-07T16:59:00Z')

  // 17:01:00Z = 00:01:00 WIB (1 menit setelah tengah malam di Jakarta) -> tanggal sudah 2026-10-08
  const postMidnightUtc = new Date('2026-10-07T17:01:00Z')

  it('mengonfirmasi getJakartaTodayIsoDate pada 2026-10-07T16:59:00Z adalah 2026-10-07', () => {
    expect(getJakartaTodayIsoDate(preMidnightUtc)).toBe('2026-10-07')
  })

  it('mengonfirmasi getJakartaTodayIsoDate pada 2026-10-07T17:01:00Z adalah 2026-10-08', () => {
    expect(getJakartaTodayIsoDate(postMidnightUtc)).toBe('2026-10-08')
  })

  it('menilai benar (true) jika tanggal data 2026-10-07 pada waktu 2026-10-07T16:59:00Z', () => {
    expect(isDateTodayJakarta('2026-10-07', preMidnightUtc)).toBe(true)
  })

  it('menilai salah (false) jika tanggal data 2026-10-08 pada waktu 2026-10-07T16:59:00Z', () => {
    expect(isDateTodayJakarta('2026-10-08', preMidnightUtc)).toBe(false)
  })

  it('menilai benar (true) jika tanggal data 2026-10-08 pada waktu 2026-10-07T17:01:00Z', () => {
    expect(isDateTodayJakarta('2026-10-08', postMidnightUtc)).toBe(true)
  })

  it('menilai salah (false) jika tanggal data 2026-10-07 pada waktu 2026-10-07T17:01:00Z', () => {
    expect(isDateTodayJakarta('2026-10-07', postMidnightUtc)).toBe(false)
  })

  it('formatIndonesianDate memformat string tanggal dengan benar', () => {
    expect(formatIndonesianDate('2026-10-07')).toBe('7 Oktober 2026')
    expect(formatIndonesianDate('2026-10-08')).toBe('8 Oktober 2026')
  })

  it('formatWibTimeFromIso memformat jam ke WIB Asia/Jakarta', () => {
    expect(formatWibTimeFromIso('2026-10-07T16:59:00Z')).toBe('23:59 WIB')
    expect(formatWibTimeFromIso('2026-10-07T17:01:00Z')).toBe('00:01 WIB')
    expect(formatWibTimeFromIso(undefined)).toBe('')
  })
})
