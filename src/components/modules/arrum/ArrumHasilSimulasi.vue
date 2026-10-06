<script setup lang="ts">
/**
 * @file ArrumHasilSimulasi.vue
 * @description Komponen panel hasil simulasi rencana emas haji (Langkah 3).
 * Menampilkan kalkulasi rekomendasi gramasi emas, modal setara, estimasi komitmen bulanan,
 * nilai proyeksi buyback, proteksi aset dari inflasi, serta rincian proyeksi tahunan via accordion.
 */
import { GAlert, GButton } from '@/components'
import ArrumProyeksiAccordion from './ArrumProyeksiAccordion.vue'
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
  /** Fungsi pemformat angka standar */
  formatNumber: (num: number) => string
  /** Fungsi pemformat Rupiah */
  formatRupiah: (val: number) => string
}

/** Interface events emit */
export interface ArrumHasilSimulasiEmits {
  (e: 'copySummary'): void
  (e: 'reset'): void
}

defineProps<ArrumHasilSimulasiProps>()
const emit = defineEmits<ArrumHasilSimulasiEmits>()
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

    <!-- Alert Peringatan Jika Waktu Tidak Valid -->
    <div v-if="errorMessage && totalKebutuhan > 0" class="mb-3">
      <GAlert
        :label="errorMessage"
        color="red"
        variant="danger"
      />
    </div>

    <!-- Empty State (Saat Belum Ada Input Kebutuhan Dana) -->
    <div v-if="totalKebutuhan === 0" class="empty-simulation-panel">
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

    <!-- Tampilan Hasil Simulasi Lengkap (Bersih & Lega) -->
    <div v-else-if="isValidTahun" class="simulation-content">
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

      <!-- Rincian Ringkasan Finansial Lega & Berstruktur Vertikal -->
      <div class="summary-list">
        <!-- 1. Estimasi Tabungan Rutin -->
        <div class="summary-row">
          <div>
            <span class="row-title">Estimasi Tabungan Rutin</span>
            <small class="row-desc">
              Setara ± {{ tabunganPerBulanGram }} gr/bulan (selama {{ totalBulan }} bulan)
            </small>
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

        <!-- 3. Proteksi Nilai Aset (Gain Inflasi) -->
        <div class="summary-row">
          <div>
            <span class="row-title">Proteksi Nilai Aset (Gain)</span>
            <small class="row-desc">
              Pertumbuhan nilai menjaga daya beli dari inflasi
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

      <!-- Tombol Aksi Simulasi untuk Sales & Nasabah -->
      <div class="simulation-actions-bar">
        <GButton
          id="btn-copy-simulation"
          :label="notifCopied ? 'Tersalin ke Clipboard' : 'Salin Ringkasan Simulasi'"
          type="primary"
          size="md"
          class="action-btn"
          @click="emit('copySummary')"
        />

        <GButton
          id="btn-reset-simulation"
          label="Ulangi Simulasi"
          type="secondary"
          size="md"
          class="action-btn"
          @click="emit('reset')"
        />
      </div>

      <!-- Catatan Edukasi & Transparansi Finansial -->
      <p class="transparency-note">
        Catatan: Simulasi ini merupakan alat bantu estimasi finansial menggunakan asumsi kenaikan harga emas historis 7% per tahun dan bukan jaminan kepastian harga di masa depan. Pembulatan gramasi emas dilakukan ke atas untuk menjamin kecukupan dana saat pencairan.
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
  box-shadow: 0 10px 28px -6px rgba(6, 61, 44, 0.3), 0 4px 12px rgba(0, 0, 0, 0.12);
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

/* Action Buttons */
.simulation-actions-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1 1 calc(50% - 5px);
  min-width: 140px;
}

.transparency-note {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: #94a3b8;
  margin-top: 16px;
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
