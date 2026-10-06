<script setup lang="ts">
/**
 * @file ArrumKebutuhanForm.vue
 * @description Komponen formulir langkah 1 untuk memasukkan target estimasi kebutuhan dana haji nasabah.
 * Terdiri dari 3 pos kebutuhan (BPIH, persiapan/living cost, cadangan/keperluan)
 * menggunakan komponen InputNominalStart Kitvue.
 */
import { InputNominalStart } from '@/components'

/** Interface props untuk formulir kebutuhan dana haji */
export interface ArrumKebutuhanFormProps {
  /** Nilai nominal BPIH (v-model:pelunasan) */
  pelunasan: string
  /** Nilai nominal persiapan/living cost (v-model:persiapan) */
  persiapan: string
  /** Nilai nominal cadangan/keperluan lain (v-model:keperluan) */
  keperluan: string
  /** Total kebutuhan dana yang terakumulasi */
  totalKebutuhan: number
  /** Fungsi pemformat Rupiah */
  formatRupiah: (val: number) => string
  /** Fungsi pemformat teks terbilang */
  getTerbilang: (val: string) => string
}

/** Interface events emit */
export interface ArrumKebutuhanFormEmits {
  (e: 'update:pelunasan', value: string): void
  (e: 'update:persiapan', value: string): void
  (e: 'update:keperluan', value: string): void
}

defineProps<ArrumKebutuhanFormProps>()
const emit = defineEmits<ArrumKebutuhanFormEmits>()
</script>

<template>
  <section class="card-box" aria-labelledby="heading-kebutuhan">
    <!-- Header Card Langkah 1 -->
    <div class="card-header-bar">
      <div class="step-badge" aria-hidden="true">1</div>
      <div>
        <h2 id="heading-kebutuhan" class="card-heading">Kebutuhan Dana Ibadah Haji</h2>
        <p class="card-desc">
          Masukkan target estimasi dana yang ingin dipersiapkan nasabah (dalam Rupiah).
        </p>
      </div>
    </div>

    <!-- Form Input Kebutuhan Dana -->
    <div class="form-vertical-stack">
      <!-- Pos 1: Pelunasan Porsi Haji -->
      <div class="field-container">
        <label class="field-label" for="sim-pelunasan">
          Biaya Pelunasan Porsi Haji (BPIH)
        </label>
        <span class="field-subtext">
          Target dana pelunasan saat nomor porsi keberangkatan tiba.
        </span>
        <InputNominalStart
          id="sim-pelunasan"
          unit="Rp"
          placeholder="0"
          :model-value="pelunasan"
          @update:model-value="(val: string) => emit('update:pelunasan', val)"
        />
        <div class="terbilang-indicator">{{ getTerbilang(pelunasan) }}</div>
      </div>

      <!-- Pos 2: Persiapan Haji & Living Cost -->
      <div class="field-container">
        <label class="field-label" for="sim-persiapan">
          Persiapan Keberangkatan &amp; Living Cost
        </label>
        <span class="field-subtext">
          Perlengkapan haji, biaya manasik, pakaian ihram, dan uang saku di tanah suci.
        </span>
        <InputNominalStart
          id="sim-persiapan"
          unit="Rp"
          placeholder="0"
          :model-value="persiapan"
          @update:model-value="(val: string) => emit('update:persiapan', val)"
        />
        <div class="terbilang-indicator">{{ getTerbilang(persiapan) }}</div>
      </div>

      <!-- Pos 3: Keperluan Lain & Cadangan -->
      <div class="field-container">
        <label class="field-label" for="sim-lainnya">
          Dana Cadangan &amp; Keperluan Lainnya
        </label>
        <span class="field-subtext">
          Kebutuhan tambahan keluarga yang ditinggalkan atau oleh-oleh. Jika tidak ada, isi 0.
        </span>
        <InputNominalStart
          id="sim-lainnya"
          unit="Rp"
          placeholder="0"
          :model-value="keperluan"
          @update:model-value="(val: string) => emit('update:keperluan', val)"
        />
        <div class="terbilang-indicator">{{ getTerbilang(keperluan) }}</div>
      </div>

      <!-- Panel Rekap Total Target Dana -->
      <div class="rekap-total-card">
        <div class="rekap-text-group">
          <span class="rekap-title">Total Target Kebutuhan Dana</span>
          <span class="rekap-sub">Akumulasi seluruh pos persiapan haji nasabah</span>
        </div>
        <strong class="rekap-value">{{ formatRupiah(totalKebutuhan) }}</strong>
      </div>
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

.card-header-bar {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.step-badge {
  width: 32px;
  height: 32px;
  background: var(--g-kit-broccoli-50, #0b4430);
  color: #ffffff;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  flex-shrink: 0;
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

.form-vertical-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #1e293b);
}

.field-subtext {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: var(--g-kit-black-60, #64748b);
  margin-bottom: 6px;
}

.terbilang-indicator {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-normal);
  color: var(--g-kit-lime-50, #00ab4e);
  min-height: 18px;
  padding-left: 2px;
}

.rekap-total-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #f8faf9;
  border: 1.5px solid #d1fae5;
  border-radius: 12px;
  padding: 16px 18px;
  margin-top: 4px;
}

.rekap-text-group {
  display: flex;
  flex-direction: column;
}

.rekap-title {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-broccoli-70, #07281c);
}

.rekap-sub {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: var(--g-kit-black-60, #64748b);
}

.rekap-value {
  font-size: var(--g-kit-font-size-lambda);
  line-height: var(--g-kit-line-height-lambda);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-broccoli-50, #0b4430);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .card-box {
    padding: 16px;
    border-radius: 14px;
  }

  .rekap-total-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 14px 16px;
    gap: 8px;
  }

  .rekap-text-group {
    width: 100%;
  }

  .rekap-title {
    font-size: var(--g-kit-font-size-sigma);
    line-height: var(--g-kit-line-height-sigma);
  }

  .rekap-sub {
    font-size: var(--g-kit-font-size-omega);
    line-height: var(--g-kit-line-height-omega);
    margin-top: 2px;
  }

  .rekap-value {
    font-size: var(--g-kit-font-size-lambda);
    line-height: var(--g-kit-line-height-lambda);
    font-weight: var(--g-kit-font-weight-bold);
    align-self: flex-start;
  }
}
</style>
