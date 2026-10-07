<script setup lang="ts">
/**
 * @file DashboardView.vue
 * @description View orchestrator utama Simulasi Rencana Emas Haji Arrum Zada.
 * Mengintegrasikan komponen-komponen modular (Header, Form Kebutuhan, Jangka Waktu,
 * Acuan Harga, Hasil Simulasi) dengan composable state/logika kalkulasi useArrumSimulasi.
 *
 * Standar: Kitvue (kitvue-public), Vue 3 <script setup lang="ts">, DRY & Atomic Design.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { GAlert } from '@/components'
import { useArrumSimulasi } from '@/composables/useArrumSimulasi'
import {
  ArrumSimulasiHeader,
  ArrumKebutuhanForm,
  ArrumJangkaWaktuCard,
  ArrumHasilSimulasi,
} from '@/components/modules/arrum'

// Inisialisasi composable state & kalkulasi finansial
const {
  pelunasanHaji,
  persiapanHaji,
  keperluanLain,
  waktuInvestasi,
  notifCopied,
  quickYearChips,
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
  handleSelectYear,
  // Live Gold Price State & Method
  hargaJual,
  hargaBuyback,
  tanggalAcuan,
  waktuUpdate,
  isPriceToday,
  isPriceLoaded,
  hasPriceError,
  priceErrorMessage,
  syncFeedbackMessage,
  syncFeedbackType,
  isLoadingHarga,
  refreshHargaEmas,
  handleCopySummary,
  handleReset,
} = useArrumSimulasi()

/** Ref elemen kolom hasil simulasi untuk IntersectionObserver */
const resultColumnRef = ref<HTMLElement | null>(null)
/** Status apakah kartu hasil sedang berada di dalam viewport */
const isResultVisible = ref<boolean>(false)
let resultObserver: IntersectionObserver | null = null

/**
 * Menentukan apakah sticky summary bar di mobile perlu ditampilkan:
 * Hanya aktif jika input valid, total kebutuhan > 0, tidak ada error harga,
 * dan kartu hasil belum terlihat di viewport.
 */
const showMobileStickySummary = computed<boolean>(() => {
  return (
    !hasPriceError.value &&
    isValidTahun.value &&
    totalKebutuhan.value > 0 &&
    !isResultVisible.value
  )
})

/**
 * Menggulirkan layar secara halus ke kartu hasil simulasi saat tombol diklik
 */
const scrollToResult = (): void => {
  if (resultColumnRef.value) {
    resultColumnRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  if (resultColumnRef.value && typeof IntersectionObserver !== 'undefined') {
    resultObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isResultVisible.value = entry ? entry.isIntersecting : false
      },
      { threshold: 0.1 }
    )
    resultObserver.observe(resultColumnRef.value)
  }
})

onBeforeUnmount(() => {
  if (resultObserver) {
    resultObserver.disconnect()
    resultObserver = null
  }
})
</script>

<template>
  <div class="simulasi-wrapper">
    <!-- Komponen Header Banner & Live Parameter Galeri 24 -->
    <ArrumSimulasiHeader
      :harga-jual="hargaJual"
      :harga-buyback="hargaBuyback"
      :tanggal-acuan="tanggalAcuan"
      :waktu-update="waktuUpdate"
      :is-loading-harga="isLoadingHarga"
      :is-today="isPriceToday"
      :has-error="hasPriceError"
      :error-message="priceErrorMessage"
      @refresh-harga="refreshHargaEmas"
    />

    <!-- Floating Toast Notifikasi Kitvue Saat Salin Ringkasan -->
    <transition name="fade">
      <div v-if="notifCopied" class="simulasi-toast" role="status" aria-live="polite">
        <GAlert
          label="Ringkasan simulasi rencana emas haji berhasil disalin ke clipboard."
          color="green"
          variant="success"
        />
      </div>
    </transition>

    <!-- Floating Toast Notifikasi Umpan Balik Pembaruan Harga Emas -->
    <transition name="fade">
      <div v-if="syncFeedbackMessage" class="simulasi-toast simulasi-toast-sync" role="status" aria-live="polite">
        <GAlert
          :label="syncFeedbackMessage"
          :color="syncFeedbackType === 'success' ? 'green' : (syncFeedbackType === 'danger' ? 'red' : 'yellow')"
          :variant="syncFeedbackType === 'success' ? 'success' : (syncFeedbackType === 'danger' ? 'danger' : 'warning')"
        />
      </div>
    </transition>

    <!-- Grid Layout 2 Kolom: Formulir Input (Kiri) & Hasil Presentasi Nasabah (Kanan) -->
    <main class="simulasi-grid">
      <!-- Kolom Kiri: Formulir Input Simulasi -->
      <div class="input-column">
        <!-- Langkah 1: Kebutuhan Dana Haji -->
        <ArrumKebutuhanForm
          v-model:pelunasan="pelunasanHaji"
          v-model:persiapan="persiapanHaji"
          v-model:keperluan="keperluanLain"
          :total-kebutuhan="totalKebutuhan"
          :format-rupiah="formatRupiah"
          :get-terbilang="getTerbilang"
        />

        <!-- Langkah 2: Jangka Waktu Perencanaan -->
        <ArrumJangkaWaktuCard
          v-model:waktu-investasi="waktuInvestasi"
          :tahun-investasi="tahunInvestasi"
          :quick-year-chips="quickYearChips"
          @select-year="handleSelectYear"
        />
      </div>

      <!-- Kolom Kanan: Hasil Simulasi & Presentasi Nasabah -->
      <aside ref="resultColumnRef" class="result-column">
        <!-- Langkah 3: Hasil Simulasi Rencana Emas -->
        <ArrumHasilSimulasi
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
          @reset="handleReset"
        />
      </aside>
    </main>

    <!-- Sticky Bottom Summary Bar Khusus Mobile (< 768px) -->
    <transition name="slide-up">
      <aside
        v-if="showMobileStickySummary"
        id="mobile-sticky-summary-bar"
        class="mobile-sticky-summary"
        aria-label="Ringkasan Cepat Hasil Simulasi"
      >
        <div class="sticky-summary-content">
          <div class="sticky-summary-data">
            <div class="sticky-data-item">
              <span class="sticky-label">Target Emas:</span>
              <strong class="sticky-val">{{ formatNumber(gramasiEmas) }} gr</strong>
            </div>
            <div class="sticky-data-item">
              <span class="sticky-label">Cicilan:</span>
              <strong class="sticky-val">± {{ formatRupiah(tabunganPerBulanRp) }}/bln</strong>
            </div>
          </div>
          <button
            type="button"
            class="sticky-scroll-btn"
            @click="scrollToResult"
          >
            Lihat Hasil Lengkap &darr;
          </button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
.simulasi-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 64px;
}

/* Floating Toast Notifikasi */
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

/* Grid Layout 2 Kolom */
.simulasi-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 960px) {
  .simulasi-grid {
    grid-template-columns: 1fr;
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

  .simulasi-wrapper {
    padding: 16px 12px 48px;
  }

  .simulasi-grid {
    gap: 16px;
  }
}

/* Sticky Column Kanan */
.result-column {
  position: sticky;
  top: 84px;
}

/* Optimasi Print Mode */
@media print {
  body {
    background: #ffffff !important;
  }

  .simulasi-toast,
  .mobile-sticky-summary {
    display: none !important;
  }

  .simulasi-grid {
    display: block !important;
  }

  .result-column {
    position: static !important;
    margin-top: 20px;
  }
}

/* Sticky Bottom Summary Bar (Hanya Tampil di Mobile < 768px) */
.mobile-sticky-summary {
  display: none;
}

@media (max-width: 767px) {
  .mobile-sticky-summary {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 990;
    background: linear-gradient(135deg, #063d2c 0%, #0d5c41 100%);
    border-top: 1px solid rgba(52, 211, 153, 0.4);
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.25);
    padding: 10px 16px;
    padding-bottom: max(10px, env(safe-area-inset-bottom));
  }

  .sticky-summary-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: 600px;
    margin: 0 auto;
  }

  .sticky-summary-data {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sticky-data-item {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .sticky-label {
    font-size: 11px;
    color: #e2e8f0;
  }

  .sticky-val {
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.01em;
  }

  .sticky-scroll-btn {
    background: #00ab4e;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease, background-color 0.15s ease;
  }

  .sticky-scroll-btn:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  .sticky-scroll-btn:active {
    transform: scale(0.96);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
