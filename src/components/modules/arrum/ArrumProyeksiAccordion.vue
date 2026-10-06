<script setup lang="ts">
/**
 * @file ArrumProyeksiAccordion.vue
 * @description Komponen rincian proyeksi pertumbuhan emas tahun demi tahun.
 * Menggunakan GAccordion Kitvue dengan konten kartu individual per tahun (bukan tabel),
 * berpadding 1rem, serta visualisasi estimasi buyback dan potensi kenaikan nilai.
 */
import { GAccordion, GAccordionItem } from '@/components'
import type { ProyeksiCardItem } from '@/types/simulasi'

/** Interface props untuk proyeksi tahunan */
export interface ArrumProyeksiAccordionProps {
  /** Daftar kartu proyeksi per tahun */
  cards: ProyeksiCardItem[]
}

defineProps<ArrumProyeksiAccordionProps>()
</script>

<template>
  <div class="accordion-section">
    <GAccordion>
      <GAccordionItem header="Lihat rincian proyeksi per tahun">
        <div class="cards-scroll-panel">
          <div
            v-for="card in cards"
            :key="card.id"
            class="proyeksi-year-card"
          >
            <!-- Baris Atas Kartu: Tahun & Persentase Gain -->
            <div class="year-card-top">
              <span class="year-title-badge">{{ card.tahunLabel }}</span>
              <span class="year-gain-pill">{{ card.persenPertumbuhan }}</span>
            </div>

            <!-- Konten Kartu: Estimasi Nilai Buyback & Harga Jual Galeri 24 -->
            <div class="year-card-content">
              <div class="content-col">
                <span class="content-caption">Estimasi Nilai Buyback</span>
                <div class="value-row">
                  <strong class="content-value shiny-gold-nominal">{{ card.nilaiEmas }}</strong>
                </div>
              </div>
              <div class="content-col text-end">
                <span class="content-caption">Harga Jual Galeri 24</span>
                <div class="value-row">
                  <strong class="content-value text-reference">{{ card.hargaJual }}</strong>
                  <span class="unit-suffix">/ gr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GAccordionItem>
    </GAccordion>
  </div>
</template>

<style scoped>
.accordion-section {
  margin-bottom: 20px;
}

:deep(.accordion-item) {
  border: 1px solid var(--g-kit-black-20, #e2e8f0) !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  background-color: #ffffff !important;
}

:deep(.accordion-button) {
  padding: 1rem !important;
  font-size: var(--g-kit-font-size-sigma) !important;
  line-height: var(--g-kit-line-height-sigma) !important;
  font-weight: var(--g-kit-font-weight-bold) !important;
  color: var(--g-kit-black-80, #1e293b) !important;
  background-color: #ffffff !important;
  box-shadow: none !important;
}

:deep(.accordion-button:not(.collapsed)) {
  background-color: #f8fafc !important;
  color: var(--g-kit-broccoli-50, #0b4430) !important;
  border-bottom: 1px solid var(--g-kit-black-20, #e2e8f0) !important;
}

:deep(.accordion-body) {
  padding: 1rem !important;
  background-color: #ffffff !important;
}

.cards-scroll-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 330px;
  overflow-y: auto;
  padding-right: 2px;
}

.proyeksi-year-card {
  background: #f8fafc;
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.15s ease;
}

.proyeksi-year-card:hover {
  border-color: #cbd5e1;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.year-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e2e8f0;
}

.year-title-badge {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-broccoli-70, #07281c);
}

.year-gain-pill {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  color: #047857;
  background: #d1fae5;
  border-radius: 4px;
  padding: 2px 8px;
}

.year-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.content-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.text-end {
  text-align: right;
  align-items: flex-end;
}

.content-caption {
  font-size: var(--g-kit-font-size-atom, 12px);
  line-height: var(--g-kit-line-height-atom, 16px);
  color: #64748b;
  font-weight: 500;
}

.value-row {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.content-col.text-end .value-row {
  justify-content: flex-end;
}

.content-value {
  font-size: var(--g-kit-font-size-omicron, 15px) !important;
  line-height: var(--g-kit-line-height-omicron, 20px) !important;
  font-weight: var(--g-kit-font-weight-bold, 700) !important;
  letter-spacing: -0.01em;
}

.content-value.text-reference {
  color: #0f172a !important;
}

.unit-suffix {
  font-size: var(--g-kit-font-size-atom, 12px);
  line-height: 1;
  font-weight: 500;
  color: #64748b;
}
</style>
