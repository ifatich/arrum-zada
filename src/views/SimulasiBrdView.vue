<script setup lang="ts">
/**
 * @file SimulasiBrdView.vue
 * @description View orchestrator utama untuk Simulasi Rencana Emas Haji sesuai BRD & Panduan UX Human-Centric.
 * Menghadirkan alur yang lapang, manusiawi, mudah dibaca, dan tidak crowded:
 * 1. Hero Landing Banner resmi selaras "Perencanaan Finansial Haji" dengan harga Galeri 24 live
 * 2. Kalkulator Simulasi Interaktif (Step 1 Pos Kebutuhan + Step 2 Dropdown Tahun vs Step 3 Hasil Simulasi & Download Summary)
 * 3. Section Tersendiri: Keunggulan Investasi Emas (PRD Poin 4 - 3 kartu lapang)
 * 4. Modul Wawasan Finansial & Data Historis (Tabbed progressive disclosure)
 * 5. Formulir Feedback Evaluasi BRD (PRD Poin 6 - Collapsible Drawer)
 */
import { ref } from 'vue'
import { GAlert } from '@/components'
import { useSimulasiBrd } from '@/composables/useSimulasiBrd'

import HeroRencanaHaji from '@/components/modules/simulasi-brd/HeroRencanaHaji.vue'
import KeunggulanInvestasi from '@/components/modules/simulasi-brd/KeunggulanInvestasi.vue'
import WawasanFinansialHaji from '@/components/modules/simulasi-brd/WawasanFinansialHaji.vue'
import FormFeedbackBrd from '@/components/modules/simulasi-brd/FormFeedbackBrd.vue'

import { ArrumKebutuhanForm } from '@/components/modules/arrum'
import FormTahunKeberangkatan from '@/components/modules/simulasi-brd/FormTahunKeberangkatan.vue'
import HasilKonversiBrd from '@/components/modules/simulasi-brd/HasilKonversiBrd.vue'

const {
  pelunasanHaji,
  persiapanHaji,
  keperluanLain,
  tahunKeberangkatan,
  opsiTahunKeberangkatan,
  notifCopied,
  totalKebutuhan,
  tahunInvestasi,
  totalBulan,
  isValidTahun,
  errorMessage,
  gramasiEmas,
  nilaiEmasHariIni,
  nilaiEmasAkhir,
  tabunganPerBulanRp,
  tabunganPerBulanGram,
  selisihPertumbuhanRp,
  persentasePertumbuhan,
  proyeksiCards,
  formatNumber,
  formatRupiah,
  getTerbilang,
  hargaJual,
  hargaBuyback,
  tanggalAcuan,
  waktuUpdate,
  isPriceToday,
  isPriceLoaded,
  hasPriceError,
  syncFeedbackMessage,
  syncFeedbackType,
  isLoadingHarga,
  refreshHargaEmas,
  handleCopySummary,
  handleDownloadSummary,
  handleReset,
} = useSimulasiBrd()

const resultColumnRef = ref<HTMLElement | null>(null)
const feedbackRef = ref<InstanceType<typeof FormFeedbackBrd> | null>(null)

const handleOpenApp = (): void => {
  feedbackRef.value?.triggerAppHandoff()
}

const handleOpenFeedback = (): void => {
  feedbackRef.value?.openDirectSurvey()
}
</script>

<template>
  <div class="simulasi-page-wrapper">
    <!-- Floating Alerts -->
    <transition name="fade">
      <div v-if="notifCopied" class="simulasi-toast" role="status" aria-live="polite">
        <GAlert
          label="Ringkasan simulasi rencana emas haji berhasil disalin ke clipboard."
          color="green"
          variant="success"
        />
      </div>
    </transition>

    <transition name="fade">
      <div v-if="syncFeedbackMessage" class="simulasi-toast simulasi-toast-sync" role="status" aria-live="polite">
        <GAlert
          :label="syncFeedbackMessage"
          :color="syncFeedbackType === 'success' ? 'green' : (syncFeedbackType === 'danger' ? 'red' : 'yellow')"
          :variant="syncFeedbackType === 'success' ? 'success' : (syncFeedbackType === 'danger' ? 'danger' : 'warning')"
        />
      </div>
    </transition>

    <div class="content-container">
      <!-- 1. Hero Landing Banner Resmi (Sesuai Referensi Gambar "Perencanaan Finansial Haji") -->
      <HeroRencanaHaji
        :harga-jual="hargaJual"
        :harga-buyback="hargaBuyback"
        :tanggal-acuan="tanggalAcuan"
        :waktu-update="waktuUpdate"
        :is-loading-harga="isLoadingHarga"
        :is-today="isPriceToday"
        @refresh-harga="refreshHargaEmas"
      />

      <!-- 2. Section Kalkulator Simulasi Interaktif (Tepat di Depan & Mudah Diakses) -->
      <section id="kalkulator-section" class="calculator-anchor-section">
        <div class="calc-section-header">
          <div class="calc-header-flex">
            <div>
              <span class="eyebrow-text">Hitung kebutuhan Haji saya</span>
              <h2 class="calc-section-title">Kalkulator Simulasi Konversi Emas</h2>
              <p class="calc-section-desc">
                Ubah kebutuhan biaya haji menjadi target gramasi emas nyata dan rencana tabungan cicil bulanan 
                berdasarkan harga acuan resmi Galeri 24 hari ini.
              </p>
            </div>

            <!-- Live Gold Price Indicator (Mandatory BRD) -->
            <!-- <div v-if="hargaJual" class="calc-live-price-pill">
              <span class="live-dot" aria-hidden="true"></span>
              <div class="pill-text-group">
                <span class="pill-label">Harga Emas Galeri 24</span>
                <strong class="pill-val">Rp {{ formatNumber(hargaJual) }} / gr</strong>
              </div>
              <button
                type="button"
                class="refresh-mini-btn"
                :class="{ 'is-spinning': isLoadingHarga }"
                :disabled="isLoadingHarga"
                title="Perbarui harga resmi Galeri 24"
                @click="refreshHargaEmas"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </button>
            </div> -->
          </div>
        </div>

        <!-- Grid Input & Hasil Kalkulator -->
        <main class="simulasi-grid">
          <div class="input-column">
            <!-- Langkah 1: Pos Kebutuhan Biaya Haji -->
            <ArrumKebutuhanForm
              v-model:pelunasan="pelunasanHaji"
              v-model:persiapan="persiapanHaji"
              v-model:keperluan="keperluanLain"
              :total-kebutuhan="totalKebutuhan"
              :format-rupiah="formatRupiah"
              :get-terbilang="getTerbilang"
            />

            <!-- Langkah 2: Dropdown Pilihan Tahun Keberangkatan -->
            <FormTahunKeberangkatan
              v-model:tahunKeberangkatan="tahunKeberangkatan"
              :opsi-tahun="opsiTahunKeberangkatan"
            />
          </div>

          <!-- Langkah 3: Panel Hasil Simulasi & Aksi -->
          <aside ref="resultColumnRef" class="result-column">
            <HasilKonversiBrd
              :total-kebutuhan="totalKebutuhan"
              :is-valid-tahun="isValidTahun"
              :error-message="errorMessage"
              :gramasi-emas="gramasiEmas"
              :nilai-emas-hari-ini="nilaiEmasHariIni"
              :nilai-emas-akhir="nilaiEmasAkhir"
              :tabungan-per-bulan-rp="tabunganPerBulanRp"
              :tabungan-per-bulan-gram="tabunganPerBulanGram"
              :tahun-investasi="tahunInvestasi"
              :total-bulan="totalBulan"
              :selisih-pertumbuhan-rp="selisihPertumbuhanRp"
              :persentase-pertumbuhan="persentasePertumbuhan"
              :proyeksi-cards="proyeksiCards"
              :notif-copied="notifCopied"
              :has-price-error="hasPriceError"
              :is-price-loaded="isPriceLoaded"
              :harga-jual="hargaJual"
              :format-number="formatNumber"
              :format-rupiah="formatRupiah"
              @copy-summary="handleCopySummary"
              @download-summary="handleDownloadSummary"
              @reset="handleReset"
              @open-app="handleOpenApp"
              @open-feedback="handleOpenFeedback"
            />
          </aside>
        </main>
      </section>

      <!-- 3. Section Tersendiri: Keunggulan Investasi Emas (PRD Poin 4 - Lapang & Manusiawi) -->
      <KeunggulanInvestasi />

      <!-- 4. Section Wawasan & Data Historis (Tabbed Progressive Disclosure) -->
      <WawasanFinansialHaji />

      <!-- 5. Formulir Feedback Pengguna (Dual-Objective Modal + Persistent Footer Banner) -->
      <FormFeedbackBrd ref="feedbackRef" />
    </div>
  </div>
</template>

<style scoped>
.simulasi-page-wrapper {
  background: #f7f9f6;
  min-height: 100vh;
  padding: 32px 16px 80px;
}

.content-container {
  max-width: 1180px;
  margin: 0 auto;
}

#kalkulator-section,
#keunggulan-section,
#wawasan-section {
  scroll-margin-top: 84px;
}

.simulasi-toast {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  max-width: 440px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  border-radius: 12px;
}

.simulasi-toast-sync {
  top: 144px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Calculator Section Styling */
.calculator-anchor-section {
  margin-top: 36px;
  margin-bottom: 48px;
  scroll-margin-top: 80px;
}

.calc-section-header {
  margin-bottom: 24px;
}

.calc-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.calc-live-price-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
  flex-shrink: 0;
}

.pill-text-group {
  display: flex;
  flex-direction: column;
}

.pill-label {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: var(--g-kit-black-60, #64748b);
  font-weight: var(--g-kit-font-weight-normal);
}

.pill-val {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-broccoli-50, #004d43);
}

.refresh-mini-btn {
  background: var(--g-kit-black-10, #f8fafc);
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  color: var(--g-kit-black-70, #475569);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  margin-left: 4px;
}

.refresh-mini-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: var(--g-kit-black-80, #0f172a);
}

.refresh-mini-btn.is-spinning svg {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.eyebrow-text {
  color: var(--g-kit-broccoli-50, #004d43);
  font-weight: var(--g-kit-font-weight-bold);
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  display: block;
  margin-bottom: 6px;
}

.calc-section-title {
  margin: 0 0 8px;
  font-size: var(--g-kit-font-size-epsilon);
  line-height: var(--g-kit-line-height-epsilon);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #0f172a);
  letter-spacing: -0.02em;
}

.calc-section-desc {
  margin: 0;
  color: var(--g-kit-black-60, #64748b);
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  max-width: 760px;
}

.simulasi-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.result-column {
  position: sticky;
  top: 84px;
}

@media (max-width: 960px) {
  .simulasi-grid {
    grid-template-columns: 1fr;
  }
  
  .result-column {
    position: static;
  }
}

@media (max-width: 640px) {
  .simulasi-toast {
    left: 12px;
    right: 12px;
    top: 72px;
    max-width: calc(100% - 24px);
  }
  .simulasi-toast-sync {
    top: 130px;
  }
  .simulasi-page-wrapper {
    padding: 16px 8px 60px;
  }
  .simulasi-grid {
    gap: 16px;
  }
}
</style>
