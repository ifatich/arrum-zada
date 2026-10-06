<script setup lang="ts">
/**
 * @file ArrumAcuanHargaCard.vue
 * @description Komponen informasi parameter harga acuan emas batangan resmi Galeri 24.
 * Menampilkan harga jual dan harga buyback pecahan 1 gram terkini yang terkunci otomatis (disabled),
 * serta dilengkapi tombol refresh untuk sinkronisasi harga langsung via API resmi Galeri 24.
 */
import { InputNominalStart } from '@/components'

/** Interface props untuk parameter harga acuan */
export interface ArrumAcuanHargaCardProps {
  /** Nilai harga jual acuan per gram */
  hargaJual?: number
  /** Nilai harga buyback acuan per gram */
  hargaBuyback?: number
  /** Label tanggal pembaruan harga acuan */
  tanggalAcuan?: string
  /** Waktu / jam pembaruan harga acuan (misal: '09:00 WIB') */
  waktuUpdate?: string
  /** Status sedang memuat data harga dari API */
  isLoading?: boolean
}

withDefaults(defineProps<ArrumAcuanHargaCardProps>(), {
  hargaJual: 2510000,
  hargaBuyback: 2366000,
  tanggalAcuan: '6 Oktober 2026',
  waktuUpdate: '09:00 WIB',
  isLoading: false,
})

defineEmits<{
  (e: 'refresh'): void
}>()
</script>

<template>
  <section class="card-box" aria-labelledby="heading-acuan-harga">
    <div class="card-header-bar">
      <div class="header-left">
        <div class="step-badge step-fixed" aria-hidden="true">Acuan</div>
        <div>
          <h2 id="heading-acuan-harga" class="card-heading">Parameter Harga Acuan Galeri 24</h2>
          <p class="card-desc">
            Harga resmi emas batangan pecahan 1 gram per {{ tanggalAcuan }}, {{ waktuUpdate }} (terkunci otomatis).
          </p>
        </div>
      </div>

      <!-- Tombol Refresh Live API Galeri 24 -->
      <button
        type="button"
        class="card-refresh-btn"
        :disabled="isLoading"
        :aria-busy="isLoading"
        @click="$emit('refresh')"
      >
        <svg
          class="refresh-icon-svg"
          :class="{ 'animate-spin': isLoading }"
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
        <span>{{ isLoading ? 'Memperbarui...' : 'Perbarui Harga' }}</span>
      </button>
    </div>

    <div class="two-column-grid">
      <div class="field-container">
        <label class="field-label" for="acuan-jual">Harga Jual per Gram</label>
        <span class="field-subtext">Dasar hitung saat membeli / mencicil emas.</span>
        <InputNominalStart
          id="acuan-jual"
          unit="Rp"
          :model-value="String(hargaJual)"
          disabled
        />
      </div>

      <div class="field-container">
        <label class="field-label" for="acuan-buyback">Harga Buyback per Gram</label>
        <span class="field-subtext">Dasar estimasi saat emas dicairkan di masa depan.</span>
        <InputNominalStart
          id="acuan-buyback"
          unit="Rp"
          :model-value="String(hargaBuyback)"
          disabled
        />
      </div>
    </div>

    <div class="acuan-footer-strip">
      <div class="footer-left">
        <span class="live-indicator-dot" aria-hidden="true"></span>
        <span>Terhubung langsung ke API resmi Galeri 24 (Pembaruan terakhir: {{ tanggalAcuan }}, {{ waktuUpdate }}).</span>
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
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.step-badge {
  background: var(--g-kit-broccoli-50, #0b4430);
  color: #ffffff;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: var(--g-kit-font-weight-bold);
  flex-shrink: 0;
}

.step-fixed {
  background: #78350f;
  width: auto;
  min-width: 32px;
  padding: 0 8px;
  height: 32px;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  text-transform: uppercase;
  letter-spacing: 0.04em;
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

/* Tombol Refresh Harga */
.card-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #f0fdf4;
  color: #065f46;
  border: 1px solid #bbf7d0;
  padding: 7px 13px;
  border-radius: 8px;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-bold);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.card-refresh-btn:hover:not(:disabled) {
  background: #dcfce7;
  border-color: #86efac;
  color: #047857;
  transform: translateY(-1px);
}

.card-refresh-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.refresh-icon-svg {
  width: 14px;
  height: 14px;
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 640px) {
  .card-header-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .card-refresh-btn {
    align-self: flex-start;
  }

  .two-column-grid {
    grid-template-columns: 1fr;
  }
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

.acuan-footer-strip {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-normal);
  color: #475569;
  margin-top: 14px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
  flex-shrink: 0;
}
</style>
