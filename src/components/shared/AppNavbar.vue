<script setup lang="ts">
/**
 * @file AppNavbar.vue
 * @description Navbar minimalis aplikasi Simulasi Rencana Emas Haji Arrum Zada.
 * Menyediakan logo resmi Arrum Zada (landscape) dan navigasi anchor ringkas ke formulir, acuan harga, dan hasil simulasi.
 *
 * Standar: Minimalist & Clean, Vue 3 <script setup lang="ts">, Bebas ikon/emoji.
 */
import { ArrumZadaLogoLandscape } from '@/components/shared/logo'

/**
 * Handler scroll halus ke target section formulir atau hasil simulasi
 * @param id - ID elemen target pada DOM
 */
const scrollTo = (id: string): void => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <nav class="app-navbar" aria-label="Navigasi Utama">
    <div class="navbar-container">
      <!-- Identitas Brand Arrum Zada -->
      <div class="navbar-brand">
        <ArrumZadaLogoLandscape :mark-size="38" variant="dark" />
      </div>

      <!-- Navigasi Minimalis Anchor Links -->
      <div class="navbar-actions">
        <button
          type="button"
          class="nav-link-btn"
          @click="scrollTo('heading-kebutuhan')"
        >
          Formulir
        </button>

        <button
          type="button"
          class="nav-link-btn nav-link-desktop-only"
          @click="scrollTo('heading-acuan-harga')"
        >
          Acuan Harga
        </button>

        <button
          type="button"
          class="nav-link-btn nav-link-highlight"
          @click="scrollTo('heading-hasil-simulasi')"
        >
          Hasil Simulasi
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--g-kit-black-20, #e2e8f0);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  user-select: none;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link-btn {
  background: transparent;
  border: none;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  color: var(--g-kit-black-70, #475569);
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.nav-link-btn:hover {
  color: var(--g-kit-broccoli-50, #0b4430);
  background: #f1f5f9;
}

.nav-link-highlight {
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-broccoli-50, #0b4430);
  background: #e8f5e9;
}

.nav-link-highlight:hover {
  background: #d1fae5;
  color: var(--g-kit-broccoli-70, #07281c);
}

@media (max-width: 640px) {
  .navbar-container {
    padding: 0 12px;
    height: 56px;
  }

  .navbar-actions {
    gap: 4px;
  }

  .nav-link-desktop-only {
    display: none;
  }

  .nav-link-btn {
    padding: 6px 10px;
    font-size: var(--g-kit-font-size-omega);
    line-height: var(--g-kit-line-height-omega);
  }
}
</style>
