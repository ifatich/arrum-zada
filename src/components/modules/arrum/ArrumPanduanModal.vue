<script setup lang="ts">
/**
 * ArrumPanduanModal.vue
 *
 * Modal panduan akad syariah Arrum Zada.
 * Mengadopsi arsitektur BaseModal.vue dan Kitvue GButton.
 */
import { GButton } from '@/components'
import BaseModal from '@/components/shared/modals/BaseModal.vue'

defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="isVisible"
    width="680px"
    title-id="arrum-panduan-title"
    @update:model-value="handleClose"
  >
    <template #header>
      <header class="modal-header">
        <div class="header-left">
          <h3 id="arrum-panduan-title" class="modal-title">Panduan Akad Pembiayaan Arrum Zada Syariah</h3>
          <span class="syariah-badge">Fatwa DSN-MUI</span>
        </div>
        <button
          id="arrum-panduan-close"
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
      <div class="panduan-section">
        <h6 class="section-title">1. Prinsip Akad Rahn (Gadai Emas)</h6>
        <p class="section-desc">
          Nasabah menyerahkan emas batangan atau perhiasan (marhun) sebagai agunan pembiayaan. Emas tetap menjadi milik nasabah secara penuh dan tersimpan aman di Safe Deposit Box Pegadaian dengan jaminan asuransi fisik 100%.
        </p>
      </div>

      <div class="panduan-section">
        <h6 class="section-title">2. Akad Ijarah (Biaya Pemeliharaan & Penitipan)</h6>
        <p class="section-desc">
          Biaya pemeliharaan barang titipan (mu'nah) dikenakan murni atas jasa penyimpanan, pengamanan, dan asuransi fisik emas sebesar 0.7% per bulan, terbebas dari unsur bunga/riba pinjaman uang.
        </p>
      </div>

      <div class="panduan-section">
        <h6 class="section-title">3. Plafon Pembiayaan & Tenor</h6>
        <p class="section-desc">
          Plafon pembiayaan diberikan hingga 85% dari nilai taksiran pasar emas resmi Pegadaian dengan fleksibilitas jangka waktu angsuran 6, 12, 24, hingga 36 bulan.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer-actions">
        <GButton
          id="modal-panduan-close-btn"
          label="Tutup Panduan"
          type="primary"
          size="md"
          class="w-100"
          @click="handleClose"
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
  gap: 20px;
  padding: 20px 24px 28px;
}

.panduan-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  margin: 0;
  color: var(--g-kit-lime-50, #00ab4e);
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
}

.section-desc {
  margin: 0;
  color: var(--g-kit-black-60, #64748b);
  font-size: var(--g-kit-font-size-sigma);
  line-height: 1.6;
}

.modal-footer-actions {
  display: flex;
  width: 100%;
}

.w-100 {
  width: 100%;
}
</style>
