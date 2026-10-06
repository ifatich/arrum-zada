<script setup lang="ts">
/**
 * @file DashboardView.vue
 * @description View orchestrator utama Simulasi Rencana Emas Haji Arrum Zada.
 * Mengintegrasikan komponen-komponen modular (Header, Form Kebutuhan, Jangka Waktu,
 * Acuan Harga, Hasil Simulasi) dengan composable state/logika kalkulasi useArrumSimulasi.
 *
 * Standar: Kitvue (kitvue-public), Vue 3 <script setup lang="ts">, DRY & Atomic Design.
 */
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
  isLoadingHarga,
  refreshHargaEmas,
  handleCopySummary,
  handleReset,
} = useArrumSimulasi()
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
      <aside class="result-column">
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
          :format-number="formatNumber"
          :format-rupiah="formatRupiah"
          @copy-summary="handleCopySummary"
          @reset="handleReset"
        />
      </aside>
    </main>
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

  .simulasi-toast {
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
</style>
