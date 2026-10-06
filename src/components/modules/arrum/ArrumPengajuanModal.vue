<script setup lang="ts">
/**
 * ArrumPengajuanModal.vue
 *
 * Modal formulir pengajuan baru Arrum Zada.
 * Mengadopsi arsitektur modal resmi Bullion Bank CMS (AdminApprovalPreviewModal.vue & BaseModal.vue)
 * dengan komponen Kitvue (GButton, GDropdown, GInputText, InputNominalStart, InputNominalEnd).
 */
import { ref, watch } from 'vue'
import {
  GButton,
  GDropdown,
  GInputText,
  InputNominalEnd,
  InputNominalStart,
} from '@/components'
import BaseModal from '@/components/shared/modals/BaseModal.vue'

export interface PengajuanPayload {
  namaNasabah: string
  tujuan: string
  beratGram: string
  nilaiTaksiran: string
  tenor: string
}

const props = withDefaults(
  defineProps<{
    isVisible: boolean
    initialBerat?: string
    initialTaksiran?: string
  }>(),
  {
    initialBerat: '20',
    initialTaksiran: '30000000',
  }
)

const emit = defineEmits<{
  close: []
  submit: [payload: PengajuanPayload]
}>()

const namaNasabah = ref('')
const tujuan = ref('Perencanaan Porsi Haji (Arrum Haji)')
const beratGram = ref(props.initialBerat)
const nilaiTaksiran = ref(props.initialTaksiran)
const tenor = ref('12')

watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      if (props.initialBerat) beratGram.value = props.initialBerat
      if (props.initialTaksiran) nilaiTaksiran.value = props.initialTaksiran
    }
  }
)

const tenorOptions = [
  { value: '6', text: '6 Bulan' },
  { value: '12', text: '12 Bulan (1 Tahun)' },
  { value: '24', text: '24 Bulan (2 Tahun)' },
  { value: '36', text: '36 Bulan (3 Tahun)' },
]

function handleClose() {
  emit('close')
}

function handleSubmit() {
  emit('submit', {
    namaNasabah: namaNasabah.value || 'Nasabah Baru',
    tujuan: tujuan.value || 'Pembiayaan Emas Syariah',
    beratGram: beratGram.value,
    nilaiTaksiran: nilaiTaksiran.value,
    tenor: tenor.value,
  })

  // Reset form
  namaNasabah.value = ''
  tujuan.value = ''
  beratGram.value = '20'
  nilaiTaksiran.value = '30000000'
  tenor.value = '12'
}
</script>

<template>
  <BaseModal
    :model-value="isVisible"
    width="760px"
    title-id="arrum-pengajuan-title"
    @update:model-value="handleClose"
  >
    <template #header>
      <header class="modal-header">
        <div class="header-left">
          <h3 id="arrum-pengajuan-title" class="modal-title">Formulir Pengajuan Arrum Zada Baru</h3>
          <span class="syariah-badge">Akad Syariah</span>
        </div>
        <button
          id="arrum-pengajuan-close"
          class="modal-close"
          aria-label="Close modal"
          @click="handleClose"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6 6 18M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </header>
    </template>

    <div class="modal-body">
      <div class="field-column">
        <GInputText
          id="modal-nasabah-nama"
          label="Nama Lengkap Nasabah"
          placeholder="Contoh: Hj. Siti Fatimah"
          v-model="namaNasabah"
          required
        />

        <GInputText
          id="modal-nasabah-tujuan"
          label="Keperluan / Tujuan Pembiayaan"
          placeholder="Contoh: Porsi Haji Plus (Arrum Safar)"
          v-model="tujuan"
          required
        />

        <div class="form-row-grid">
          <div class="grid-col">
            <InputNominalEnd
              id="modal-nasabah-berat"
              title="Perkiraan Berat Emas"
              unit="Gram"
              placeholder="Contoh: 20"
              v-model="beratGram"
            />
          </div>
          <div class="grid-col">
            <label class="form-label" for="modal-nasabah-taksiran">Nilai Taksiran Emas (Rp)</label>
            <InputNominalStart
              id="modal-nasabah-taksiran"
              unit="Rp"
              placeholder="Contoh: 30000000"
              v-model="nilaiTaksiran"
            />
          </div>
        </div>

        <GDropdown
          id="modal-nasabah-tenor"
          label="Pilihan Tenor Pembiayaan"
          placeholder="Pilih Tenor"
          v-model="tenor"
          :items="tenorOptions"
          item-value="value"
          item-text="text"
        />
      </div>
    </div>

    <template #footer>
      <div class="modal-footer-actions">
        <GButton
          id="modal-pengajuan-batal"
          label="Batal"
          size="md"
          class="btn-batal"
          @click="handleClose"
        />
        <GButton
          id="modal-pengajuan-submit"
          label="Kirim Pengajuan"
          type="primary"
          size="md"
          class="btn-submit"
          @click="handleSubmit"
        />
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.syariah-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  background: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: var(--g-kit-font-size-omega, 12px);
  font-weight: var(--g-kit-font-weight-bold, 700);
}

.modal-title {
  margin: 0;
  color: var(--g-kit-black-80, #1e293b);
  font-size: var(--g-kit-font-size-lambda, 18px);
  font-weight: var(--g-kit-font-weight-bold, 700);
}

.modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--g-kit-black-60, #64748b);
  cursor: pointer;
  transition: background 0.15s ease;
}

.modal-close:hover {
  background: var(--g-kit-black-10, #f1f5f9);
}

.modal-body {
  display: flex;
  flex-direction: column;
  padding: 20px 24px 28px;
}

.field-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-row-grid {
    grid-template-columns: 1fr;
  }
}

.modal-footer-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

:deep(button.btn-batal),
.btn-batal {
  flex: 1;
  background-color: var(--g-kit-white, #ffffff) !important;
  border: 1px solid var(--g-kit-black-20, #cbd5e1) !important;
  color: var(--g-kit-black-60, #475569) !important;
  border-radius: 6px;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

:deep(button.btn-batal:hover),
.btn-batal:hover {
  background-color: var(--g-kit-black-10, #f8fafc) !important;
}

:deep(button.btn-submit),
.btn-submit {
  flex: 1;
}

@media (max-width: 640px) {
  .modal-body {
    padding: 16px 16px 20px;
  }

  .modal-footer-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .btn-batal,
  .btn-submit,
  .modal-footer-actions :deep(.btn),
  .modal-footer-actions :deep(button) {
    width: 100% !important;
    min-width: unset !important;
    flex: unset !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
}
</style>
