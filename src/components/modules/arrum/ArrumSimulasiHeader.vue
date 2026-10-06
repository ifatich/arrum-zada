<script setup lang="ts">
/**
 * @file ArrumSimulasiHeader.vue
 * @description Komponen hero header bergaya Landing Page untuk Simulasi Rencana Emas Haji.
 * Mengadopsi arsitektur 2 kolom: value proposition & action CTA di sisi kiri,
 * serta floating live parameter card resmi Galeri 24 di sisi kanan.
 *
 * Standar: Kitvue (GBadge, GButton), token desain hijau emerald, bebas ikon/emoji.
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { GBadge, GButton } from '@/components'

/** Daftar gambar background banner realistis yang berganti otomatis setiap 30 detik */
const baseUrl = import.meta.env.BASE_URL
const bannerImages = [
  `${baseUrl}images/banner-kaaba-dawn.jpg`,
  `${baseUrl}images/banner-gold-bullion.jpg`,
  `${baseUrl}images/banner-spiritual-pilgrim.jpg`,
]

/** Index background aktif */
const activeSlideIndex = ref<number>(0)
let autoSlideTimer: ReturnType<typeof setInterval> | null = null

/** State animasi feedback kesuksesan sinkronisasi harga */
const showSyncSuccess = ref<boolean>(false)
let successTimer: ReturnType<typeof setTimeout> | null = null

/** Interface props untuk header landing page */
export interface ArrumSimulasiHeaderProps {
  /** Harga jual resmi emas acuan per gram */
  hargaJual?: number
  /** Harga buyback resmi emas acuan per gram */
  hargaBuyback?: number
  /** Tanggal pembaruan harga resmi */
  tanggalAcuan?: string
  /** Waktu / jam pembaruan harga resmi (misal: '09:00 WIB') */
  waktuUpdate?: string
  /** Status sedang memuat sinkronisasi harga dari API */
  isLoadingHarga?: boolean
}

const props = withDefaults(defineProps<ArrumSimulasiHeaderProps>(), {
  hargaJual: 2510000,
  hargaBuyback: 2366000,
  tanggalAcuan: '6 Oktober 2026',
  waktuUpdate: '09:00 WIB',
  isLoadingHarga: false,
})

const emit = defineEmits<{
  (e: 'refreshHarga'): void
}>()

// Efek psikologis: Pantau saat proses refresh harga selesai untuk memunculkan status sukses & glow
watch(
  () => props.isLoadingHarga,
  (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      showSyncSuccess.value = true
      if (successTimer) clearTimeout(successTimer)
      successTimer = setTimeout(() => {
        showSyncSuccess.value = false
      }, 3200)
    }
  },
)

onMounted(() => {
  // Rotasi otomatis latar belakang setiap 30 detik
  autoSlideTimer = setInterval(() => {
    activeSlideIndex.value = (activeSlideIndex.value + 1) % bannerImages.length
  }, 30000)
})

onUnmounted(() => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
  if (successTimer) {
    clearTimeout(successTimer)
    successTimer = null
  }
})

/**
 * Pemformat angka Rupiah standar
 * @param val - Nilai numerik
 */
const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.ceil(val))
}

/**
 * Handler scroll halus ke bagian tertentu
 * @param id - Target element ID
 */
const scrollToSection = (id: string): void => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="header-section">
    <!-- Hero Banner Bergaya Landing Page -->
    <header class="hero-landing-banner">
      <!-- Background Slideshow Layer (Rotasi otomatis tiap 30 detik dengan crossfade sinematik) -->
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
        <!-- Kolom Kiri: Value Proposition & Call to Action -->
        <div class="hero-content">
          <!-- Eyebrow Badge -->
          <div class="badge-row">
            <GBadge type="secondary" label="Arrum Zada" />
            <span class="badge-dot" aria-hidden="true">·</span>
            <span class="badge-sub">Perencanaan Finansial Haji</span>
          </div>

          <!-- Hero Headline Utama -->
          <h1 class="hero-heading">
            Arrum Zada: Rencana Emas Haji
          </h1>

          <!-- Lead Paragraph Ringkas -->
          <p class="hero-lead">
            Simulasi terukur untuk menghitung target gramasi emas fisik Galeri 24, estimasi komitmen tabungan bulanan, serta perlindungan nilai dana nasabah dari kenaikan ongkos haji.
          </p>

          <!-- Group Tombol Aksi (CTA Landing Page) -->
          <div class="hero-cta-group">
            <GButton
              id="btn-hero-start"
              label="Mulai Hitung Simulasi"
              type="primary"
              size="md"
              class="hero-cta-btn"
              @click="scrollToSection('heading-kebutuhan')"
            />
            <GButton
              id="btn-hero-acuan"
              label="Lihat Acuan Harga"
              type="secondary"
              size="md"
              class="hero-cta-btn btn-ghost-white"
              @click="scrollToSection('heading-acuan-harga')"
            />
          </div>

          <!-- Nilai Unggulan (Trust Pillars) -->
          <div class="hero-trust-strip">
            <div class="trust-item">
              <span class="trust-title">Emas Fisik Galeri 24</span>
              <span class="trust-desc">Batangan 24 Karat Resmi</span>
            </div>
            <div class="trust-divider" aria-hidden="true"></div>
            <div class="trust-item">
              <span class="trust-title">Lindung Nilai Inflasi</span>
              <span class="trust-desc">Asumsi Historis 7%/Thn</span>
            </div>
            <div class="trust-divider" aria-hidden="true"></div>
            <div class="trust-item">
              <span class="trust-title">Akad Syariah</span>
              <span class="trust-desc">Amanah &amp; Transparan</span>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Live Parameter / Value Highlight Card (Glassmorphism) -->
        <div class="hero-preview-wrapper">
          <div
            id="heading-acuan-harga"
            class="hero-highlight-card glass-morph-card"
            :class="{ 'is-refreshing': isLoadingHarga, 'is-just-synced': showSyncSuccess }"
          >
            <div class="highlight-card-header">
              <div class="highlight-header-top">
                <div class="highlight-title-group">
                  <span class="highlight-tag">
                    <span class="tag-live-dot" aria-hidden="true"></span>
                    Acuan Resmi Galeri 24
                  </span>
                  <transition name="sync-fade">
                    <span v-if="showSyncSuccess" class="sync-status-pill" role="status">
                      <span class="sync-check" aria-hidden="true">✓</span>
                      Terkini
                    </span>
                  </transition>
                </div>
                <button
                  type="button"
                  class="refresh-mini-btn"
                  :class="{ 'is-spinning': isLoadingHarga }"
                  :title="isLoadingHarga ? 'Sedang memperbarui harga...' : 'Perbarui harga live dari Galeri 24'"
                  :disabled="isLoadingHarga"
                  :aria-busy="isLoadingHarga"
                  @click="$emit('refreshHarga')"
                >
                  <svg
                    class="refresh-mini-svg"
                    :class="{ 'animate-spin': isLoadingHarga }"
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
                  <span class="sr-only">Perbarui Harga</span>
                </button>
              </div>
              <span class="highlight-date">Per {{ tanggalAcuan }}, {{ waktuUpdate }}</span>
            </div>

            <div class="highlight-price-group">
              <div class="price-box" :class="{ 'price-pulse-sync': showSyncSuccess }">
                <span class="price-caption">Harga Jual Batangan</span>
                <strong class="price-value">{{ formatRupiah(hargaJual) }}</strong>
                <span class="price-unit">per gram pecahan 1 gr</span>
              </div>

              <div class="price-box" :class="{ 'price-pulse-sync': showSyncSuccess }">
                <span class="price-caption">Estimasi Harga Buyback</span>
                <strong class="price-value shiny-gold-nominal">{{ formatRupiah(hargaBuyback) }}</strong>
                <span class="price-unit">per gram saat dicairkan</span>
              </div>
            </div>

            <div class="highlight-card-footer">
              <div class="footer-badge">Kalkulasi Otomatis Konservatif</div>
              <p class="footer-note">
                Pembulatan gramasi ke atas menjamin kecukupan dana saat nomor porsi keberangkatan tiba.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
.header-section {
  margin-bottom: 24px;
}

/* Hero Landing Banner */
.hero-landing-banner {
  position: relative;
  overflow: hidden;
  background-color: var(--g-kit-broccoli-70, #07281c);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  color: #ffffff;
  padding: 36px 36px 32px;
  box-shadow: 0 16px 40px rgba(7, 40, 28, 0.24);
}

/* Background Slideshow Layer (Rotasi Otomatis 30 Detik) */
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
    rgba(7, 45, 31, 0.92) 40%,
    rgba(7, 45, 31, 0.65) 75%,
    rgba(7, 45, 31, 0.35) 100%
  );
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.25fr 0.85fr;
  gap: 36px;
  align-items: center;
}

@media (max-width: 980px) {
  .banner-slide {
    background-position: center top;
  }

  .banner-gradient-mask {
    background: linear-gradient(
      180deg,
      rgba(6, 40, 28, 0.97) 0%,
      rgba(7, 45, 31, 0.92) 50%,
      rgba(7, 45, 31, 0.70) 100%
    );
  }

  .hero-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

/* Kolom Kiri: Content */
.hero-content {
  display: flex;
  flex-direction: column;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.badge-dot {
  color: rgba(255, 255, 255, 0.45);
  font-weight: var(--g-kit-font-weight-bold);
  font-size: var(--g-kit-font-size-sigma);
}

.badge-sub {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #e2e8f0;
  opacity: 0.92;
}

.hero-heading {
  font-size: clamp(var(--g-kit-font-size-zeta), 3.2vw, var(--g-kit-font-size-delta));
  font-weight: var(--g-kit-font-weight-bold);
  color: #ffffff;
  letter-spacing: -0.025em;
  line-height: 1.22;
  margin: 0 0 12px;
}

.hero-lead {
  font-size: var(--g-kit-font-size-sigma);
  line-height: 1.65;
  color: #e2e8f0;
  margin: 0 0 24px;
  max-width: 620px;
  opacity: 0.92;
}

/* CTA Group */
.hero-cta-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}

.hero-cta-btn {
  min-width: 170px;
}

.btn-ghost-white {
  background: rgba(255, 255, 255, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
}

.btn-ghost-white:hover {
  background: rgba(255, 255, 255, 0.22) !important;
  border-color: rgba(255, 255, 255, 0.45) !important;
}

/* Trust Strip */
.hero-trust-strip {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.trust-item {
  display: flex;
  flex-direction: column;
}

.trust-title {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-bold);
  color: #ffffff;
}

.trust-desc {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: #cbd5e1;
  opacity: 0.85;
}

.trust-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
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

  /* Badge Pill & Sub-kategori Proporsional pada Mobile */
  .badge-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
    flex-wrap: nowrap;
  }

  .badge-sub {
    font-size: var(--g-kit-font-size-atom);
    line-height: var(--g-kit-line-height-atom);
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  /* Button 100% pada Mobile: 1 Baris 1 Button */
  .hero-cta-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    margin-bottom: 20px;
  }

  .hero-cta-btn,
  .hero-cta-group :deep(.btn),
  .hero-cta-group :deep(button) {
    width: 100% !important;
    min-width: unset !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }

  .trust-divider {
    display: none;
  }

  /* Trust Strip Proporsional Full-Width Panel pada Mobile */
  .hero-trust-strip {
    display: flex;
    flex-direction: column;
    gap: 0;
    background: rgba(0, 0, 0, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 6px 14px;
    margin-top: 4px;
  }

  .trust-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 0;
  }

  .trust-item:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .trust-title {
    font-size: var(--g-kit-font-size-omega);
    line-height: var(--g-kit-line-height-omega);
    font-weight: var(--g-kit-font-weight-bold);
    color: #ffffff;
  }

  .trust-desc {
    font-size: var(--g-kit-font-size-atom);
    line-height: var(--g-kit-line-height-atom);
    color: #a7f3d0;
    font-weight: var(--g-kit-font-weight-normal);
    text-align: right;
  }
}

/* Kolom Kanan: Highlight Card */
.hero-preview-wrapper {
  display: flex;
  justify-content: center;
}

.hero-highlight-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow:
    0 20px 45px -10px rgba(0, 0, 0, 0.35),
    0 10px 20px -5px rgba(0, 0, 0, 0.15);
  transition: all 0.35s ease;
}

.hero-highlight-card.is-just-synced {
  border-color: #10b981;
  box-shadow:
    0 20px 45px -10px rgba(0, 0, 0, 0.35),
    0 0 28px rgba(16, 185, 129, 0.35);
}

.highlight-card-header {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.highlight-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.highlight-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.highlight-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-bold);
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Feedback Psikologis: Status Terkini Pill */
.sync-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 9999px;
  padding: 2px 8px;
  color: #15803d;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 0.02em;
}

.sync-check {
  font-weight: var(--g-kit-font-weight-bold);
  color: #16a34a;
}

.sync-fade-enter-active,
.sync-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sync-fade-enter-from,
.sync-fade-leave-to {
  opacity: 0;
  transform: scale(0.7) translateY(-2px);
}

.highlight-date {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: #64748b;
  font-weight: 500;
}

/* Clean Refresh Button */
.refresh-mini-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s ease;
}

.refresh-mini-btn:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #94a3b8;
  color: #0f172a;
  transform: rotate(90deg) scale(1.08);
}

.refresh-mini-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.refresh-mini-svg {
  width: 15px;
  height: 15px;
}

.animate-spin {
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

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.highlight-price-group {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}

/* Solid Clean Price Pods */
.price-box {
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.price-box-pulse,
.price-pulse-sync {
  animation: priceSyncPulse 1.4s ease-out;
}

@keyframes priceSyncPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
    border-color: #10b981;
  }
  30% {
    transform: scale(1.02);
    box-shadow: 0 0 16px 2px rgba(16, 185, 129, 0.35);
    border-color: #059669;
  }
  100% {
    transform: scale(1);
    box-shadow: none;
    border-color: #e2e8f0;
  }
}

.price-caption {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  color: #059669;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.price-value {
  font-size: clamp(var(--g-kit-font-size-lambda), 2.2vw, var(--g-kit-font-size-theta));
  line-height: 1.2;
  font-weight: var(--g-kit-font-weight-bold);
  color: #0f172a;
  letter-spacing: -0.02em;
}

.price-unit {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: 500;
  color: #64748b;
  margin-top: 4px;
}

/* Solid Clean Footer Box */
.highlight-card-footer {
  position: relative;
  z-index: 1;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 12px 16px;
}

.footer-badge {
  display: inline-block;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  color: #047857;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.footer-note {
  margin: 0;
  font-size: var(--g-kit-font-size-atom);
  line-height: 1.5;
  color: #166534;
  font-weight: 400;
}
</style>
