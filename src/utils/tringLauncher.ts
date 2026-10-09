/**
 * @file tringLauncher.ts
 * @description Utility peluncur aplikasi Tring Pegadaian dengan deteksi platform dinamis (Android, iOS, Desktop)
 * dan mekanisme pembukaan aplikasi yang sudah terpasang vs belum terpasang (fallback ke Store).
 */

export interface DeviceInfo {
  isAndroid: boolean
  isIos: boolean
  isMobile: boolean
  platformLabel: 'Android' | 'iOS' | 'Desktop'
}

/**
 * Konfigurasi URL resmi deep link dan store Tring Pegadaian
 */
export const TRING_CONFIG = {
  // Android Intent: Format native Android Chrome.
  // Jika app terinstall -> buka tringapp://emas/cicilEmasTabungan
  // Jika belum terinstall -> otomatis fallback ke Google Play Store
  androidIntentUrl:
    'intent://emas/cicilEmasTabungan#Intent;scheme=tringapp;package=com.pegadaian.tring;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.pegadaian.tring;end',
  androidSchemeUrl: 'tringapp://emas/cicilEmasTabungan',
  androidPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.pegadaian.tring',

  // iOS: Custom scheme + App Store resmi
  iosSchemeUrl: 'tring://emas/cicilEmasTabungan',
  iosAppStoreUrl: 'https://apps.apple.com/id/app/tring/id1527339744',

  // Universal OneLink / Web Fallback
  oneLinkUrl: 'https://tring.onelink.me/emas/cicilEmasTabungan',
}

/**
 * Deteksi platform perangkat pengguna secara akurat
 */
export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isAndroid: false, isIos: false, isMobile: false, platformLabel: 'Desktop' }
  }

  const ua = navigator.userAgent || ''
  const isAndroid = /Android/i.test(ua)
  const isIos =
    /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isMobile = isAndroid || isIos

  const platformLabel: 'Android' | 'iOS' | 'Desktop' = isAndroid ? 'Android' : isIos ? 'iOS' : 'Desktop'

  return { isAndroid, isIos, isMobile, platformLabel }
}

/**
 * Flag mutex untuk mencegah eksekusi ganda / duplicate race condition
 */
let isLaunching = false
let launchLockTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Memicu peluncuran aplikasi Tring secara dinamis:
 * - Menggunakan mutex lock (3 detik) agar tidak terjadi pemanggilan ganda.
 * - Android: Menggunakan scheme resmi 'tringapp://emas/cicilEmasTabungan'.
 *   Jika aplikasi terpasang -> Android membuka Tring dan tab browser kehilangan fokus (membatalkan fallback).
 *   Jika belum terpasang -> Browser tetap aktif dan dialihkan ke Google Play Store resmi.
 * - iOS: Menggunakan scheme resmi 'tring://emas/cicilEmasTabungan'.
 *   Jika aplikasi terpasang -> iOS membuka Tring, memicu pagehide/visibilitychange/blur (membatalkan fallback).
 *   Jika belum terpasang -> Browser tetap aktif dan dialihkan ke Apple App Store.
 * - Desktop: Memanggil callback fallback (misal: membuka modal panduan).
 */
export const launchTringApp = (onFallbackToStore?: () => void): void => {
  if (typeof window === 'undefined') return

  // 1. Cegah pemicu berulang (Debounce / Mutex Guard)
  if (isLaunching) {
    return
  }
  isLaunching = true
  if (launchLockTimer) clearTimeout(launchLockTimer)
  launchLockTimer = setTimeout(() => {
    isLaunching = false
  }, 3000)

  const { isAndroid, isMobile } = getDeviceInfo()

  if (!isMobile) {
    if (onFallbackToStore) {
      onFallbackToStore()
    }
    return
  }

  const schemeUrl = isAndroid ? TRING_CONFIG.androidSchemeUrl : TRING_CONFIG.iosSchemeUrl
  const storeUrl = isAndroid ? TRING_CONFIG.androidPlayStoreUrl : TRING_CONFIG.iosAppStoreUrl

  let appOpened = false
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null
  const startTime = Date.now()

  const cleanListeners = () => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    window.removeEventListener('pagehide', onPageHide)
    window.removeEventListener('blur', onBlur)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }

  const onPageHide = () => {
    appOpened = true
    cleanListeners()
  }

  const onBlur = () => {
    appOpened = true
    cleanListeners()
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      appOpened = true
      cleanListeners()
    }
  }

  // Daftarkan listener pembatalan SEBELUM memicu scheme URL
  window.addEventListener('pagehide', onPageHide, { once: true })
  window.addEventListener('blur', onBlur, { once: true })
  document.addEventListener('visibilitychange', onVisibilityChange)

  // Picu scheme aplikasi
  window.location.href = schemeUrl

  // Siapkan timer fallback HANYA jika aplikasi tidak merespon / belum terpasang
  fallbackTimer = setTimeout(() => {
    cleanListeners()

    // Jika aplikasi sudah dibuka atau halaman sempat kehilangan fokus, JANGAN alihkan ke store!
    if (appOpened || document.hidden) {
      return
    }

    // Jika selisih waktu terlalu besar, berarti browser sempat disuspend/pause oleh OS saat membuka app
    const elapsed = Date.now() - startTime
    if (elapsed > 2500) {
      return
    }

    // Aplikasi benar-benar belum terpasang (halaman tetap diam & aktif selama 1.8s)
    if (onFallbackToStore) {
      onFallbackToStore()
    }
    window.location.href = storeUrl
  }, 1800)
}
