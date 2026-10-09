<script setup lang="ts">
/**
 * @file ArrumHasilSimulasi.vue
 * @description Komponen panel hasil simulasi rencana emas haji (Langkah 3).
 * Menampilkan kalkulasi rekomendasi gramasi emas, modal setara, estimasi komitmen bulanan,
 * nilai proyeksi buyback, proteksi aset dari inflasi, serta rincian proyeksi tahunan via accordion.
 */
import { GAlert } from '@/components'
import ArrumProyeksiAccordion from '../arrum/ArrumProyeksiAccordion.vue'
import type { ProyeksiCardItem } from '@/types/simulasi'

/** Interface props untuk panel hasil simulasi */
export interface ArrumHasilSimulasiProps {
  /** Total target kebutuhan dana nasabah */
  totalKebutuhan: number
  /** Status validitas jangka waktu investasi */
  isValidTahun: boolean
  /** Pesan error validasi (jika ada) */
  errorMessage: string
  /** Target rekomendasi gramasi emas fisik (gram) */
  gramasiEmas: number
  /** Nilai modal emas pada harga saat ini */
  nilaiEmasHariIni: number
  /** Estimasi nilai emas di akhir periode perencanaan */
  nilaiEmasAkhir: number
  /** Estimasi komitmen tabungan rutin per bulan (Rp) */
  tabunganPerBulanRp: number
  /** Estimasi komitmen tabungan per bulan dalam gram */
  tabunganPerBulanGram: string
  /** Durasi jangka waktu dalam tahun */
  tahunInvestasi: number
  /** Total durasi dalam bulan */
  totalBulan: number
  /** Selisih kenaikan nilai emas (gain lindung nilai) */
  selisihPertumbuhanRp: number
  /** Persentase kenaikan nilai emas */
  persentasePertumbuhan: number
  /** Data daftar kartu proyeksi tahunan */
  proyeksiCards: ProyeksiCardItem[]
  /** Status feedback apakah ringkasan baru saja disalin */
  notifCopied: boolean
  /** Apakah terjadi error pada harga emas acuan */
  hasPriceError?: boolean
  /** Apakah harga emas acuan sudah berhasil dimuat */
  isPriceLoaded?: boolean
  /** Harga jual emas saat ini (untuk memvalidasi kalkulasi) */
  hargaJual?: number | null
  /** Fungsi pemformat angka standar */
  formatNumber: (num: number) => string
  /** Fungsi pemformat Rupiah */
  formatRupiah: (val: number) => string
}

/** Interface events emit */
export interface ArrumHasilSimulasiEmits {
  (e: 'copySummary'): void
  (e: 'downloadSummary'): void
  (e: 'reset'): void
  (e: 'openApp'): void
  (e: 'openFeedback'): void
}

withDefaults(defineProps<ArrumHasilSimulasiProps>(), {
  hasPriceError: false,
  isPriceLoaded: true,
  hargaJual: null,
})
const emit = defineEmits<ArrumHasilSimulasiEmits>()

import { launchTringApp } from '@/utils/tringLauncher'

const handleTriggerTring = (): void => {
  launchTringApp()
  emit('openApp')
}
</script>

<template>
  <section class="card-box result-card" aria-labelledby="heading-hasil-simulasi" aria-live="polite">
    <!-- Header Card Langkah 3 -->
    <div class="card-header-bar">
      <div class="step-badge step-result" aria-hidden="true">3</div>
      <div>
        <h2 id="heading-hasil-simulasi" class="card-heading">Hasil Simulasi Rencana Emas</h2>
        <p class="card-desc">
          Kalkulasi otomatis yang mudah dibaca dan dipahami nasabah.
        </p>
      </div>
    </div>

    <!-- Alert Error Jika Data Harga Tidak Tersedia Sama Sekali -->
    <div v-if="hasPriceError || (!isPriceLoaded && !hargaJual)" class="price-fatal-panel mb-3">
      <GAlert
        label="Data harga emas resmi Galeri 24 tidak dapat dimuat. Kalkulasi simulasi dinonaktifkan hingga harga resmi berhasil diperoleh."
        color="red"
        variant="danger"
      />
    </div>

    <!-- Alert Peringatan Jika Waktu Tidak Valid -->
    <div v-if="!hasPriceError && errorMessage && totalKebutuhan > 0" class="mb-3">
      <GAlert
        :label="errorMessage"
        color="red"
        variant="danger"
      />
    </div>

    <!-- Empty State (Saat Belum Ada Input Kebutuhan Dana) -->
    <div v-if="!hasPriceError && totalKebutuhan === 0" class="empty-simulation-panel">
      <div class="empty-icon-wrap" aria-hidden="true">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2"></rect>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="16" y1="14" x2="16" y2="18"></line>
          <path d="M16 10h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M8 10h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M8 14h.01"></path>
          <path d="M12 18h.01"></path>
          <path d="M8 18h.01"></path>
        </svg>
      </div>
      <h3 class="empty-title">Simulasi Belum Terisi</h3>
      <p class="empty-text">
        Masukkan target kebutuhan dana dan jangka waktu menabung pada formulir di sebelah kiri
        untuk melihat rekomendasi gramasi emas, estimasi komitmen bulanan, dan proyeksi nilai di masa depan.
      </p>
    </div>

    <!-- State Pemandu (Saat Kebutuhan Dana Sudah Diisi, Tetapi Tahun Belum Diisi / Di Luar 1–30) -->
    <div v-else-if="!hasPriceError && totalKebutuhan > 0 && !isValidTahun" class="empty-simulation-panel pending-year-panel">
      <div class="empty-icon-wrap pending-icon" aria-hidden="true">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <h3 class="empty-title">Lengkapi Lama Menabung</h3>
      <p class="empty-text">
        Isi lama menabung antara 1 sampai 30 tahun untuk melihat hasil.
      </p>
    </div>

    <!-- Tampilan Hasil Simulasi Lengkap (Bersih & Lega) -->
    <div v-else-if="!hasPriceError && isValidTahun && hargaJual && hargaJual > 0" class="simulation-content">
      <!-- Grand Hero Result: Gramasi Emas Fisik Utama -->
      <div class="grand-hero-panel">
        <!-- Eyebrow Badge -->
        <div class="hero-eyebrow-container">
          <span class="hero-eyebrow-badge">
            <span class="hero-live-indicator" aria-hidden="true"></span>
            Target Emas Fisik Saat Ini
          </span>
        </div>

        <!-- Main Gram Display -->
        <div class="hero-gram-wrapper">
          <span class="hero-gram-number shiny-gold-hero">{{ formatNumber(gramasiEmas) }}</span>
          <span class="hero-gram-unit">Gram</span>
        </div>

        <!-- High-Contrast Conversion Box -->
        <div class="hero-conversion-box">
          <div class="conversion-headline">
            <span class="conversion-label">Setara Modal Hari Ini:</span>
            <strong class="conversion-value shiny-gold-hero">{{ formatRupiah(nilaiEmasHariIni) }}</strong>
          </div>
          <p class="conversion-source">
            Berdasarkan acuan harga jual Galeri 24 hari ini
          </p>
        </div>
      </div>

      <!-- TODO: menunggu persetujuan kepatuhan/DPS: disclaimer ringkas tepat di bawah grand hero panel -->
      <div class="hero-disclaimer-box" role="note">
        <svg
          class="disclaimer-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>Estimasi berdasarkan asumsi, bukan jaminan.</span>
      </div>

      <!-- Rincian Ringkasan Finansial Lega & Berstruktur Vertikal -->
      <div class="summary-list">
        <!-- 1. Estimasi Tabungan Emas Cicil per Bulan -->
        <div class="summary-row">
          <div>
            <span class="row-title">Estimasi Tabungan Emas Cicil per Bulan</span>
            <small class="row-desc">
              Setara ± {{ tabunganPerBulanGram }} gr/bulan (selama {{ totalBulan }} bulan)
            </small>
            <p class="row-cicil-subtext">
              Harga emas dikunci saat akad, cicilan tetap setiap bulan selama {{ totalBulan }} bulan. Harga akad mengikuti harga resmi Galeri 24 pada saat transaksi. Belum termasuk biaya lain yang berlaku saat akad.
            </p>
          </div>
          <strong class="row-value">± {{ formatRupiah(tabunganPerBulanRp) }} / bln</strong>
        </div>

        <!-- 2. Estimasi Nilai Keberangkatan (Highlight Nilai Masa Depan) -->
        <div class="summary-row">
          <div>
            <span class="row-title">Estimasi Nilai saat Keberangkatan</span>
            <small class="row-desc">
              Proyeksi nilai buyback di tahun ke-{{ tahunInvestasi }}
            </small>
          </div>
          <strong class="row-value shiny-gold-nominal">{{ formatRupiah(nilaiEmasAkhir) }}</strong>
        </div>

        <!-- TODO: menunggu persetujuan kepatuhan/DPS: redaksi netral menggantikan Proteksi Nilai Aset (Gain) -->
        <!-- 3. Estimasi Selisih Nilai Emas -->
        <div class="summary-row">
          <div>
            <span class="row-title">Estimasi Selisih Nilai Emas</span>
            <small class="row-desc">
              Estimasi selisih nilai buyback masa depan terhadap modal awal hari ini
            </small>
          </div>
          <strong class="row-value text-gain">
            +{{ formatRupiah(selisihPertumbuhanRp) }} (+{{ persentasePertumbuhan }}%)
          </strong>
        </div>

        <!-- 4. Total Target Kebutuhan Dana -->
        <div class="summary-row">
          <div>
            <span class="row-title">Total Target Kebutuhan Dana</span>
            <small class="row-desc">Akumulasi seluruh pos persiapan haji nasabah</small>
          </div>
          <span class="row-value">{{ formatRupiah(totalKebutuhan) }}</span>
        </div>
      </div>

      <!-- Kartu Proyeksi Tahunan di Dalam Accordion -->
      <ArrumProyeksiAccordion :cards="proyeksiCards" />

      <!-- Tombol Aksi Simulasi (Sederhana & Terarah: HANYA 2 BUTTON) -->
      <div class="simulation-actions-bar">
        <!-- Button 1 (Primer): Buka Tring Dinamis (Android / iOS / Desktop) -->
        <button 
          id="btn-tring-simulation" 
          type="button"
          class="tring-cta-btn"
          @click="handleTriggerTring"
        >
          <span>Mulai Tabungan Emas di Tring</span>
          <svg
            class="cta-arrow-svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Button 2 (Sekunder): Salin Ringkasan untuk Berbagi -->
        <button
          id="btn-copy-simulation"
          type="button"
          class="action-btn-copy"
          :class="{ 'is-copied': notifCopied }"
          @click="emit('copySummary')"
        >
          <svg
            v-if="!notifCopied"
            class="btn-icon-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg
            v-else
            class="btn-icon-svg copy-check"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ notifCopied ? 'Ringkasan Berhasil Disalin ke Clipboard' : 'Salin Ringkasan Simulasi' }}</span>
        </button>

        <!-- Link Subtle untuk Reset/Hitung Ulang (Tidak Bersaing dengan Tombol Utama) -->
        <div class="reset-link-row">
          <button
            id="btn-reset-simulation"
            type="button"
            class="reset-text-link"
            title="Kembali ke awal formulir"
            @click="emit('reset')"
          >
            ↺ Hitung Ulang / Ubah Data
          </button>
        </div>

        <!-- Micro-prompt masukan survei -->
        <div class="feedback-micro-prompt">
          <span class="micro-prompt-text">Punya masukan atau saran simulasi?</span>
          <button type="button" class="micro-prompt-btn" @click="emit('openFeedback')">
            Beri Masukan Singkat (±1 Menit) ↗
          </button>
        </div>
      </div>

      <!-- TODO: menunggu persetujuan kepatuhan/DPS: redaksi netral disclaimer dan penghapusan kata menjamin -->
      <!-- Catatan Edukasi & Transparansi Finansial -->
      <p class="transparency-note">
        Catatan: Simulasi ini merupakan alat bantu estimasi finansial menggunakan asumsi simulasi 7% per tahun, mengacu pada rata-rata kenaikan harga emas sejak 2000, bukan jaminan kepastian harga di masa depan. Pembulatan gramasi emas dilakukan ke atas agar dana lebih mencukupi (estimasi) saat pencairan.
      </p>
    </div>
  </section>
</template>

<style scoped>
.card-box {
  background: #ffffff;
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.result-card {
  border-color: #cbd5e1;
}

.card-header-bar {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.step-badge {
  width: 32px;
  height: 32px;
  color: #ffffff;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  flex-shrink: 0;
}

.step-result {
  background: var(--g-kit-broccoli-50, #0b4430);
}

.card-heading {
  margin: 0;
  font-size: var(--g-kit-font-size-lambda);
  line-height: var(--g-kit-line-height-lambda);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #0f172a);
}

.card-desc {
  margin: 4px 0 0;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-60, #64748b);
}

/* Empty State */
.empty-simulation-panel {
  text-align: center;
  padding: 44px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1.5px dashed #cbd5e1;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon-wrap {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.pending-icon {
  background: #fef3c7;
  color: #b45309;
}

.empty-title {
  margin: 0 0 8px;
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-bold);
  color: #334155;
}

.empty-text {
  margin: 0 auto;
  max-width: 400px;
  font-size: var(--g-kit-font-size-sigma);
  color: #64748b;
  line-height: 1.6;
}

/* Grand Hero Panel */
.grand-hero-panel {
  background: linear-gradient(145deg, #063d2c 0%, #0d5c41 55%, #08432f 100%);
  border: 1px solid rgba(52, 211, 153, 0.25);
  border-radius: 16px;
  padding: 24px 20px;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: none;
  position: relative;
  overflow: hidden;
}

.hero-eyebrow-container {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.hero-eyebrow-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  color: #d1fae5;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.hero-live-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #34d399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
}

.hero-gram-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin: 10px 0 16px;
}

.hero-gram-number {
  font-size: clamp(var(--g-kit-font-size-delta), 6vw, var(--g-kit-font-size-gamma));
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 1.1;
  color: #ffffff;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.hero-gram-unit {
  font-size: var(--g-kit-font-size-lambda);
  line-height: var(--g-kit-line-height-lambda);
  font-weight: var(--g-kit-font-weight-normal);
  color: #e2e8f0;
}

.hero-conversion-box {
  background: rgba(0, 0, 0, 0.26);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.conversion-headline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px 8px;
}

.conversion-label {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  color: #e2e8f0;
}

.conversion-value {
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: -0.01em;
}

.conversion-source {
  margin: 0;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: #cbd5e1;
  text-align: center;
}

.hero-disclaimer-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--g-kit-black-10, #f8fafc);
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  border-radius: 8px;
  padding: 6px 12px;
  margin-top: 10px;
  margin-bottom: 16px;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-normal);
  color: var(--g-kit-black-70, #475569);
  text-align: center;
}

.disclaimer-icon {
  flex-shrink: 0;
  color: var(--g-kit-black-60, #64748b);
}

/* Rincian Ringkasan Data */
.summary-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid var(--g-kit-black-20, #e2e8f0);
  gap: 16px;
}

.row-title {
  display: block;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #1e293b);
}

.row-desc {
  display: block;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: var(--g-kit-black-60, #64748b);
  margin-top: 2px;
}

.row-cicil-subtext {
  display: block;
  font-size: var(--g-kit-font-size-atom);
  line-height: 1.45;
  color: var(--g-kit-black-60, #64748b);
  margin-top: 6px;
  margin-bottom: 0;
}

.row-value {
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-bold);
  color: #0f172a;
  text-align: right;
  white-space: nowrap;
}

.text-success {
  color: var(--g-kit-lime-50, #00ab4e) !important;
}

.text-gain {
  color: var(--g-kit-broccoli-60, #0b4430) !important;
}

/* Action Buttons: HANYA 2 TOMBOL BERSIH & FOKUS */
.simulation-actions-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
}

.tring-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: linear-gradient(135deg, #007a5e 0%, #004d43 100%);
  color: #ffffff;
  border: none;
  font-size: var(--g-kit-font-size-sigma, 15px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  font-weight: 700;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 77, 67, 0.22);
  text-align: center;
  text-decoration: none;
}

.tring-cta-btn:hover {
  background: linear-gradient(135deg, #00634c 0%, #07281c 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 77, 67, 0.3);
  color: #ffffff;
}

.tring-cta-btn:active {
  transform: translateY(0);
}

.cta-arrow-svg {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.tring-cta-btn:hover .cta-arrow-svg {
  transform: translateX(3px);
}

/* Tombol 2 (Sekunder): Salin Ringkasan */
.action-btn-copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #ffffff;
  color: var(--g-kit-broccoli-50, #004d43);
  border: 1.5px solid #a7f3d0;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  font-weight: 700;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
}

.action-btn-copy:hover {
  background: #f0fdf4;
  border-color: var(--g-kit-broccoli-50, #004d43);
}

.action-btn-copy.is-copied {
  background: #dcfce7;
  border-color: #86efac;
  color: #15803d;
}

.btn-icon-svg {
  flex-shrink: 0;
}

.copy-check {
  color: #16a34a;
}

/* Link Subtle Reset */
.reset-link-row {
  display: flex;
  justify-content: center;
  margin-top: 2px;
}

.reset-text-link {
  background: none;
  border: none;
  padding: 4px 10px;
  font-size: 12px;
  line-height: 16px;
  color: #64748b;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s ease;
}

.reset-text-link:hover {
  color: var(--g-kit-broccoli-50, #004d43);
}

.feedback-micro-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--g-kit-black-20, #eeeeef);
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: var(--g-kit-black-60, #58585b);
  flex-wrap: wrap;
}

.micro-prompt-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--g-kit-broccoli-50, #004d43);
  font-weight: var(--g-kit-font-weight-bold);
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.15s ease;
}

.action-btn :deep(button:focus-visible) {
  outline: 2px solid var(--g-kit-broccoli-50, #0b4430);
  outline-offset: 2px;
}

.transparency-note {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: #94a3b8;
  margin-top: 16px;
}

/* Sembunyikan prompt feedback mikro dan catatan transparansi pada tablet dan mobile */
@media (max-width: 1024px) {
  .feedback-micro-prompt,
  .transparency-note {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .card-box {
    padding: 16px;
    border-radius: 14px;
  }

  .grand-hero-panel {
    padding: 20px 14px;
    margin-bottom: 16px;
    border-radius: 14px;
  }

  .hero-gram-wrapper {
    margin: 8px 0 14px;
    gap: 6px;
  }

  .hero-conversion-box {
    padding: 10px 12px;
  }

  .conversion-headline {
    flex-direction: column;
    gap: 2px;
  }

  .conversion-label {
    font-size: var(--g-kit-font-size-omega);
    line-height: var(--g-kit-line-height-omega);
  }

  .conversion-value {
    font-size: var(--g-kit-font-size-omicron);
    line-height: var(--g-kit-line-height-omicron);
  }

  /* Summary Row Proporsional Vertikal Stack pada Mobile */
  .summary-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 0;
    gap: 4px;
  }

  .row-title {
    font-size: var(--g-kit-font-size-sigma);
    line-height: var(--g-kit-line-height-sigma);
  }

  .row-desc {
    font-size: var(--g-kit-font-size-omega);
    line-height: var(--g-kit-line-height-omega);
    margin-top: 2px;
  }

  .row-value {
    font-size: var(--g-kit-font-size-omicron);
    line-height: var(--g-kit-line-height-omicron);
    font-weight: var(--g-kit-font-weight-bold);
    text-align: left;
    margin-top: 2px;
    align-self: flex-start;
  }

  /* Button 100% pada Mobile: 1 Baris 1 Button */
  .simulation-actions-bar {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .action-btn,
  .simulation-actions-bar :deep(.btn),
  .simulation-actions-bar :deep(button) {
    width: 100% !important;
    min-width: unset !important;
    flex: unset !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }
}
</style>
