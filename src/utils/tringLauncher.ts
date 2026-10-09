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
 * Memicu pembukaan aplikasi Tring secara dinamis:
 * - Android: Memakai Android Intent (otomatis buka Tring jika sudah terpasang, jika belum langsung buka Play Store).
 * - iOS: Mencoba membuka scheme tring://, dengan timer fallback ke App Store jika aplikasi belum terpasang.
 * - Desktop: Callback fallback untuk navigasi / buka modal panduan.
 */
export const launchTringApp = (onFallbackToStore?: () => void): void => {
  if (typeof window === 'undefined') return

  const { isAndroid, isIos } = getDeviceInfo()

  if (isAndroid) {
    // Pada Android, intent URL adalah cara paling andal karena dihandle langsung oleh OS & Chrome
    window.location.href = TRING_CONFIG.androidIntentUrl
    return
  }

  if (isIos) {
    const startTime = Date.now()
    let hasLeftPage = false

    const handleVisibility = () => {
      if (document.hidden) {
        hasLeftPage = true
      }
    }

    document.addEventListener('visibilitychange', handleVisibility, { once: true })

    // Coba luncurkan aplikasi via custom URL scheme
    window.location.href = TRING_CONFIG.iosSchemeUrl

    // Timer fallback jika aplikasi belum terpasang di perangkat iOS
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibility)
      // Jika dokumen masih aktif dan terlihat (tidak terminimize), berarti app belum terpasang
      if (!hasLeftPage && !document.hidden && Date.now() - startTime < 3500) {
        if (onFallbackToStore) {
          onFallbackToStore()
        }
        window.location.href = TRING_CONFIG.iosAppStoreUrl
      }
    }, 2200)
    return
  }

  // Jika diakses dari desktop / laptop
  if (onFallbackToStore) {
    onFallbackToStore()
  }
}
