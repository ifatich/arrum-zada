<script setup lang="ts">
/**
 * @file KeunggulanInvestasi.vue
 * @description Komponen Keunggulan Investasi Emas Haji yang bersih, lapang, manusiawi, dan mudah dibaca (PRD Poin 4).
 * Menggunakan skema warna senada (harmonious unified Pegadaian green palette) agar tampilan elegan,
 * profesional, tidak terlalu ramai/berwarna, dan selaras 100% dengan Kitvue Design Tokens & Typography System.
 */
</script>

<template>
  <section id="keunggulan-section" class="keunggulan-container" aria-labelledby="heading-keunggulan">
    <div class="section-intro">
      <span class="section-badge">Nilai Utama</span>
      <h2 id="heading-keunggulan" class="section-heading">Mengapa Merencanakan Haji dengan Emas?</h2>
      <p class="section-lead">
        Tiga pilar keunggulan instrumen emas fisik untuk memastikan daya beli dan kesiapan dana pelunasan porsi haji Anda.
      </p>
    </div>

    <div class="benefits-grid">
      <!-- Kartu 1: Lindung Nilai -->
      <div class="benefit-card card-featured">
        <div class="card-top-row">
          <div class="icon-box" aria-hidden="true">
            <svg class="benefit-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span class="card-pilar-badge">Pilar 01</span>
        </div>

        <div class="card-body">
          <h3 class="card-title">Perlindungan dari Inflasi</h3>
          <p class="card-desc">
            Masa tunggu haji yang panjang menuntut aset yang <strong>kebal inflasi</strong>. Nilai emas cenderung terus bertumbuh mengimbangi kenaikan biaya hidup dan tiket penerbangan haji.
          </p>
        </div>

        <div class="card-footer-capsule">
          <div class="capsule-icon-wrap" aria-hidden="true">
            <svg class="capsule-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="capsule-text">Daya beli utuh hingga keberangkatan</span>
        </div>
      </div>

      <!-- Kartu 2: Target Terukur -->
      <div class="benefit-card">
        <div class="card-top-row">
          <div class="icon-box" aria-hidden="true">
            <svg class="benefit-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span class="card-pilar-badge">Pilar 02</span>
        </div>

        <div class="card-body">
          <h3 class="card-title">Target Nyata dalam Gramasi</h3>
          <p class="card-desc">
            Mengubah nominal Rupiah yang abstrak menjadi <strong>target gramasi emas nyata</strong>. Menabung dalam gram emas membuat tujuan finansial lebih terukur dan tidak tergerus waktu.
          </p>
        </div>

        <div class="card-footer-capsule">
          <div class="capsule-icon-wrap" aria-hidden="true">
            <svg class="capsule-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="capsule-text">Fokus satuan gram, bebas cemas kurs</span>
        </div>
      </div>

      <!-- Kartu 3: Aman & Likuid -->
      <div class="benefit-card">
        <div class="card-top-row">
          <div class="icon-box" aria-hidden="true">
            <svg class="benefit-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-1.8-1M12 6v2m0 8v2" />
            </svg>
          </div>
          <span class="card-pilar-badge">Pilar 03</span>
        </div>

        <div class="card-body">
          <h3 class="card-title">Amanah &amp; Mudah Dicairkan</h3>
          <p class="card-desc">
            Didukung fisik emas batangan <strong>24 karat resmi Galeri 24 Pegadaian</strong>. Dapat dicicil bertahap sesuai kemampuan dan langsung dicairkan saat nomor porsi haji Anda tiba.
          </p>
        </div>

        <div class="card-footer-capsule">
          <div class="capsule-icon-wrap" aria-hidden="true">
            <svg class="capsule-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="capsule-text">100% fisik terjamin, likuid saat pelunasan</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.keunggulan-container {
  margin-top: 40px;
  margin-bottom: 40px;
}

.section-intro {
  margin-bottom: 26px;
}

.section-badge {
  display: inline-block;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--g-kit-broccoli-50, #004d43);
  margin-bottom: 6px;
}

.section-heading {
  margin: 0 0 8px;
  font-size: var(--g-kit-font-size-epsilon);
  line-height: var(--g-kit-line-height-epsilon);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
  letter-spacing: -0.02em;
}

.section-lead {
  margin: 0;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-60, #58585b);
  max-width: 680px;
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  align-items: stretch;
}

/* Base Benefit Card (Warna Senada & Elegan, Tanpa Efek Hover) */
.benefit-card {
  background: var(--g-kit-white, #ffffff);
  border: 1.5px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

/* Kartu 1: Aksen Lembut Senada */
/* .card-featured {
  background: linear-gradient(180deg, #f7faf8 0%, var(--g-kit-white, #ffffff) 100%);
  border-color: var(--g-kit-lime-20, #99dcab);
  box-shadow: 0 6px 22px rgba(0, 77, 67, 0.05);
} */

/* Card Top Row */
.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Icon Box (Warna Senada Bersih: Mint/Green Pegadaian) */
.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--g-kit-lime-10, #e6f6ea);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  color: var(--g-kit-broccoli-50, #004d43);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-svg {
  width: 22px;
  height: 22px;
}

/* Pilar Micro-Badge (Warna Senada) */
.card-pilar-badge {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  padding: 4px 10px;
  border-radius: 9999px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-broccoli-50, #004d43);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
}

/* Card Body */
.card-body {
  flex: 1;
  margin-bottom: 22px;
}

.card-title {
  margin: 0 0 10px;
  font-size: var(--g-kit-font-size-lambda);
  line-height: var(--g-kit-line-height-lambda);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
}

.card-desc {
  margin: 0;
  font-size: var(--g-kit-font-size-sigma);
  line-height: 1.6;
  color: var(--g-kit-black-60, #58585b);
}

.card-desc strong {
  color: var(--g-kit-black-80, #252528);
  font-weight: var(--g-kit-font-weight-bold);
}

/* Card Footer Takeaway Capsule (Warna Senada Hijau Lembut) */
.card-footer-capsule {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--g-kit-lime-10, #e6f6ea);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  color: var(--g-kit-broccoli-50, #004d43);
}

.capsule-icon-wrap {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #bbf7d0;
  color: var(--g-kit-broccoli-50, #004d43);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.capsule-svg {
  width: 12px;
  height: 12px;
}

.capsule-text {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-normal);
}

/* Responsiveness */
@media (max-width: 960px) {
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>
