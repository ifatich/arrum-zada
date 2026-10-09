<script setup lang="ts">
/**
 * @file FormTahunKeberangkatan.vue
 * @description Dropdown Tahun Keberangkatan Haji menggunakan KitVue GDropdown dan design token standar.
 */
import { computed } from 'vue'
import { GDropdown } from '@/components'

export interface FormTahunKeberangkatanProps {
  tahunKeberangkatan: number
  opsiTahun: number[]
}

export interface FormTahunKeberangkatanEmits {
  (e: 'update:tahunKeberangkatan', value: number): void
}

const props = defineProps<FormTahunKeberangkatanProps>()
const emit = defineEmits<FormTahunKeberangkatanEmits>()

const dropdownItems = computed(() => {
  return props.opsiTahun.map((th) => ({
    text: `Tahun ${th}`,
    value: String(th),
  }))
})

const handleDropdownSelect = (val: string): void => {
  const num = parseInt(val, 10)
  if (!isNaN(num)) {
    emit('update:tahunKeberangkatan', num)
  }
}
</script>

<template>
  <section class="card-box" aria-labelledby="heading-jangka-waktu">
    <div class="card-header-bar">
      <div class="step-badge" aria-hidden="true">2</div>
      <div>
        <h2 id="heading-jangka-waktu" class="card-heading">Tahun Keberangkatan</h2>
        <p class="card-desc">
          Pilih estimasi tahun keberangkatan haji nasabah untuk menentukan jangka waktu menabung emas.
        </p>
      </div>
    </div>

    <div class="form-vertical-stack">
      <div class="field-container">
        <span class="field-subtext">
          Pilihan jangka waktu akumulasi emas batangan fisik hingga jadwal haji tiba.
        </span>

        <GDropdown
          id="sim-tahun-dropdown"
          label="Estimasi Tahun Keberangkatan"
          placeholder="Pilih Tahun Keberangkatan"
          :items="dropdownItems"
          item-value="value"
          item-text="text"
          :model-value="String(tahunKeberangkatan)"
          @update:model-value="handleDropdownSelect"
        />
      </div>

      <div class="assumption-box">
        <div class="assumption-title">Asumsi Simulasi: 7% per Tahun</div>
        <p class="assumption-desc">
          Asumsi kenaikan harga emas 7% per tahun mengacu pada tren rata-rata kenaikan harga emas batangan 
          selama 20 tahun terakhir, bukan merupakan jaminan imbal hasil tetap.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card-box {
  background: var(--g-kit-white, #ffffff);
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
  line-height: var(--g-kit-line-height-sigma);
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
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #1e293b);
}

.field-subtext {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: var(--g-kit-black-60, #64748b);
  margin-bottom: 6px;
}

.assumption-box {
  background: var(--g-kit-yellow-10, #fff9ed);
  border: 1px dashed var(--g-kit-gold-50, #d8b56d);
  border-radius: 12px;
  padding: 14px 16px;
}

.assumption-title {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-gold-80, #816c41);
  margin-bottom: 4px;
}

.assumption-desc {
  margin: 0;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: var(--g-kit-gold-90, #56482b);
}
</style>
