<script setup lang="ts">
/**
 * @file HeroRencanaHaji.vue
 * @description Hero Landing Banner Rencana Emas Haji selaras 100% dengan referensi desain "Perencanaan Finansial Haji".
 * Dilengkapi pill badge terstandar, headline elegan, tombol CTA emas, kartu edukasi putih lapang,
 * dan strip harga emas Galeri 24 live yang terintegrasi rapi.
 */
import { ref, onMounted, onUnmounted } from 'vue'

export interface HeroRencanaHajiProps {
  hargaJual?: number | null
  hargaBuyback?: number | null
  tanggalAcuan?: string
  waktuUpdate?: string
  isLoadingHarga?: boolean
  isToday?: boolean
}

withDefaults(defineProps<HeroRencanaHajiProps>(), {
  hargaJual: null,
  hargaBuyback: null,
  tanggalAcuan: '',
  waktuUpdate: '',
  isLoadingHarga: false,
  isToday: false,
})

const emit = defineEmits<{
  (e: 'refreshHarga'): void
}>()

const baseUrl = import.meta.env.BASE_URL

const bannerImages = [
  `${baseUrl}images/banner-kaaba-dawn.jpg`,
  `${baseUrl}images/banner-gold-bullion.jpg`,
  `${baseUrl}images/banner-spiritual-pilgrim.jpg`,
]

const activeSlideIndex = ref<number>(0)
let autoSlideTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  autoSlideTimer = setInterval(() => {
    activeSlideIndex.value = (activeSlideIndex.value + 1) % bannerImages.length
  }, 30000)
})

onUnmounted(() => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
})

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}

const scrollToCalculator = (): void => {
  const el = document.getElementById('kalkulator-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToKeunggulan = (): void => {
  const el = document.getElementById('keunggulan-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <header class="hero-landing-banner" aria-label="Hero Banner Rencana Emas Haji">
    <!-- Background Slideshow Layer (Rotasi sinematik 30 detik) -->
    <div class="banner-slides-layer" aria-hidden="true">
      <div
        v-for="(img, idx) in bannerImages"
        :key="img"
        class="banner-slide"
        :class="{ 'is-active': activeSlideIndex === idx }"
        :style="{ backgroundImage: `url('${img}')` }"
      ></div>
      <div class="banner-gradient-mask"></div>
    </div>

    <div class="hero-grid">
      <!-- Kolom Kiri: Value Proposition, CTA, dan Live Gold Status -->
      <div class="hero-content">
        <!-- Eyebrow Pill Sesuai Referensi -->
        <div class="hero-eyebrow-pill">
          PERENCANAAN FINANSIAL HAJI
        </div>

        <!-- Headline Utama -->
        <h1 class="hero-heading">
          Rencana Emas Haji
        </h1>

        <!-- Lead Paragraph Ringkas & Bernapas -->
        <p class="hero-lead">
          Hitung kebutuhan Haji dan tentukan target emas Anda untuk pelunasan, 
          kebutuhan sebelum keberangkatan, dan selama di Tanah Suci secara terukur dan terlindungi dari inflasi.
        </p>

        <!-- Group Tombol Aksi (CTA) Sesuai Referensi -->
        <div class="hero-cta-group">
          <button
            id="btn-hero-calc"
            type="button"
            class="hero-btn btn-gold"
            @click="scrollToCalculator"
          >
            Mulai Hitung Simulasi ↓
          </button>
          <button
            id="btn-hero-learn"
            type="button"
            class="hero-btn btn-outline"
            @click="scrollToKeunggulan"
          >
            Pelajari Keunggulan Emas
          </button>
        </div>

      </div>

      <!-- Kolom Kanan: Card Acuan Harga Emas Terbaru (Persis Referensi Gambar 2) -->
      <div class="hero-card-col">
        <div class="hero-white-card" id="acuan-harga-card">
          <!-- Header Card: Acuan Resmi Galeri 24 + Refresh Button -->
          <div class="acuan-card-header">
            <div class="acuan-header-top">
              <div class="acuan-title-group">
                <span class="live-pulse-dot" aria-hidden="true"></span>
                <span class="acuan-title-text">Acuan Resmi Galeri 24</span>
                <span v-if="isToday" class="acuan-today-pill" role="status">
                  <span class="pill-check-icon" aria-hidden="true">✓</span>
                  Hari ini
                </span>
              </div>

              <button
                id="btn-refresh-gold-price"
                type="button"
                class="refresh-mini-btn"
                :class="{ 'is-spinning': isLoadingHarga }"
                :disabled="isLoadingHarga"
                :title="isLoadingHarga ? 'Sedang memperbarui harga...' : 'Perbarui harga resmi Galeri 24'"
                :aria-label="isLoadingHarga ? 'Sedang memperbarui harga...' : 'Perbarui harga resmi Galeri 24'"
                @click="emit('refreshHarga')"
              >
                <svg
                  class="refresh-mini-svg"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13.65 2.35A8 8 0 1 0 16 8h-2a6 6 0 1 1-1.76-4.24L9.5 6.5H16V0l-2.35 2.35z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            <div class="acuan-date-row">
              <span class="acuan-date-text">
                {{ tanggalAcuan ? `Harga per ${tanggalAcuan}` : (isLoadingHarga ? 'Memuat harga resmi...' : 'Acuan harga hari ini') }}
              </span>
              <span v-if="waktuUpdate" class="acuan-time-text">
                &bull; Diperbarui {{ waktuUpdate }}
              </span>
            </div>
          </div>

          <!-- Group 2 Box Harga Emas Sesuai Referensi Gambar -->
          <div class="acuan-price-group">
            <!-- Box 1: Harga Jual Batangan -->
            <div class="price-box">
              <span class="price-caption">HARGA JUAL BATANGAN</span>
              <strong v-if="hargaJual" class="price-value">Rp {{ formatNumber(hargaJual) }}</strong>
              <strong v-else-if="isLoadingHarga" class="price-value price-loading">Memuat...</strong>
              <strong v-else class="price-value price-unavailable">Tidak Tersedia</strong>
              <span class="price-unit">per gram pecahan 1 gr</span>
            </div>

            <!-- Box 2: Estimasi Harga Buyback -->
            <div class="price-box">
              <span class="price-caption">ESTIMASI HARGA BUYBACK</span>
              <strong v-if="hargaBuyback" class="price-value price-buyback">Rp {{ formatNumber(hargaBuyback) }}</strong>
              <strong v-else-if="isLoadingHarga" class="price-value price-loading">Memuat...</strong>
              <strong v-else class="price-value price-unavailable">Tidak Tersedia</strong>
              <span class="price-unit">per gram saat dicairkan</span>
            </div>
          </div>

          <!-- Footer Card: Reassurance Note -->
          <div class="acuan-card-footer">
            <svg class="footer-info-icon" viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <span class="footer-note-text">
              Acuan resmi untuk perhitungan konversi emas & estimasi tabungan.
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-landing-banner {
  position: relative;
  overflow: hidden;
  background-color: var(--g-kit-broccoli-70, #07281c);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  color: #ffffff;
  padding: 38px 40px;
  margin-bottom: 32px;
  box-shadow: 0 16px 40px rgba(7, 40, 28, 0.24);
}

/* Background Slideshow Layer */
.banner-slides-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.banner-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 1.8s ease-in-out, transform 30s linear;
}

.banner-slide.is-active {
  opacity: 1;
  transform: scale(1);
}

.banner-gradient-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(6, 40, 28, 0.98) 0%,
    rgba(7, 45, 31, 0.92) 42%,
    rgba(7, 45, 31, 0.72) 75%,
    rgba(7, 45, 31, 0.42) 100%
  );
}

/* Grid Layout 2 Kolom */
.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.18fr 0.92fr;
  gap: 40px;
  align-items: center;
}

/* Kolom Kiri: Content */
.hero-content {
  display: flex;
  flex-direction: column;
}

.hero-eyebrow-pill {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 16px;
}

.hero-heading {
  font-size: clamp(var(--g-kit-font-size-zeta), 3.2vw, var(--g-kit-font-size-delta));
  font-weight: var(--g-kit-font-weight-bold);
  color: #ffffff;
  letter-spacing: -0.025em;
  line-height: 1.22;
  margin: 0 0 14px;
}

.hero-lead {
  font-size: var(--g-kit-font-size-sigma);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
  margin: 0 0 24px;
  max-width: 540px;
}

/* CTA Group */
.hero-cta-group {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 22px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  padding: 12px 22px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.btn-gold {
  background: #d6a72c;
  color: #07281c;
  box-shadow: none;
}

.btn-gold:hover {
  background: #e3bc49;
  box-shadow: none;
}

.btn-outline {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: #ffffff;
  backdrop-filter: blur(8px);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.5);
  color: #ffffff;
}

/* Kolom Kanan: Card Acuan Harga Emas Terbaru (Corporate Flat Style) */
.hero-card-col {
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.hero-white-card {
  width: 100%;
  max-width: 440px;
  background: var(--g-kit-white, #ffffff);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  padding: 24px;
  /* Single Outer Shadow Hierarchy */
  box-shadow:
    0 18px 40px -10px rgba(0, 0, 0, 0.25),
    0 8px 18px -6px rgba(0, 0, 0, 0.12);
  color: var(--g-kit-black-80, #0f172a);
}

.acuan-card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.acuan-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.acuan-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.live-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
  flex-shrink: 0;
}

.acuan-title-text {
  font-size: var(--g-kit-font-size-omega, 13px);
  line-height: var(--g-kit-line-height-omega, 18px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.acuan-today-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 9999px;
  padding: 2px 8px;
  color: #15803d;
  font-size: 11px;
  line-height: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.pill-check-icon {
  font-weight: 700;
  color: #16a34a;
}

.refresh-mini-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.refresh-mini-btn:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #94a3b8;
  color: #0f172a;
  transform: rotate(90deg) scale(1.05);
}

.refresh-mini-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.refresh-mini-svg {
  width: 16px;
  height: 16px;
}

.refresh-mini-btn.is-spinning .refresh-mini-svg {
  animation: spinSmooth 0.8s linear infinite;
}

@keyframes spinSmooth {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.acuan-date-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--g-kit-font-size-atom, 12px);
  line-height: var(--g-kit-line-height-atom, 16px);
  color: #64748b;
  flex-wrap: wrap;
}

.acuan-date-text {
  font-weight: 600;
  color: #475569;
}

.acuan-time-text {
  color: #94a3b8;
  font-weight: 400;
}

/* 2 Box Harga Emas Persis Referensi Gambar */
.acuan-price-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
}

.price-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  /* Aturan Ketat: Card di dalam card TIDAK boleh ada shadow (corporate flat) */
  box-shadow: none !important;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.price-box:hover {
  border-color: #cbd5e1;
  background-color: #f1f5f9;
}

.price-caption {
  font-size: 11px;
  line-height: 14px;
  font-weight: 700;
  color: var(--g-kit-broccoli-50, #007a5e);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.price-value {
  font-size: 24px;
  line-height: 1.25;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.price-value.price-buyback {
  /* Warna amber/bronze warm sesuai referensi Gambar 2 */
  color: #b45309;
}

.price-value.price-loading {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

.price-value.price-unavailable {
  font-size: 16px;
  color: #94a3b8;
  font-weight: 500;
}

.price-unit {
  font-size: 12px;
  line-height: 16px;
  color: #64748b;
  font-weight: 400;
}

/* Footer Card */
.acuan-card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 11.5px;
  line-height: 1.45;
}

.footer-info-icon {
  flex-shrink: 0;
  color: var(--g-kit-broccoli-50, #007a5e);
}

.footer-note-text {
  color: #475569;
  font-weight: 400;
}

/* Responsiveness */
@media (max-width: 960px) {
  .hero-landing-banner {
    padding: 28px 24px;
  }
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 640px) {
  .hero-landing-banner {
    padding: 24px 16px;
    border-radius: 16px;
  }

  .hero-heading {
    font-size: var(--g-kit-font-size-zeta);
    line-height: var(--g-kit-line-height-zeta);
    margin-bottom: 12px;
  }

  .hero-lead {
    font-size: var(--g-kit-font-size-sigma);
    line-height: var(--g-kit-line-height-sigma);
    margin-bottom: 20px;
  }
}
</style>
