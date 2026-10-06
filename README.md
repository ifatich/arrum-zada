# Arrum Zada Frontend (Vue 3 + Kitvue Design System)

Project Vue 3 baru dengan standar enterprise Pegadaian, diadopsi langsung dari arsitektur [`bullion-token-wallet`](file:///Users/lord/Documents/Bullion%20Token/bullion-token-wallet).

---

## 🛠️ Tech Stack & Konfigurasi

* **Framework:** Vue 3.5 (`<script setup>`, Composition API)
* **Language:** TypeScript 5.7 (Strict Types)
* **Bundler:** Vite 6
* **UI Kit Library:** `kitvue-public` v1.0.5 (dengan alias `kitvue` di `vite.config.ts`)
* **Design System & Tokens:**
  - `kitvue/src/assets/scss/g-kit.scss` (Tokens, grid, colors, Bootstrap overrides)
  - `src/assets/styles/tokens.css` (G-Kit custom elevation & inputs)
  - Google Font `Nunito Sans` (Standar Tipografi Pegadaian)
* **State Management & Routing:** Pinia 3 & Vue Router 4

---

## 🚀 Menjalankan Project

Masuk ke folder project:
```bash
cd "arrum-zada"
```

Jalankan development server:
```bash
pnpm dev
```
Akses di browser: `http://localhost:5173`

Build production bundle:
```bash
pnpm build
```

---

## 🧩 Cara Menggunakan Komponen Pegadaian (`G-Kit`)

Semua komponen standar Pegadaian diekspor melalui [`src/components.ts`](file:///Users/lord/Documents/Pegadaian%20Project/Desktop/pegadaian-ui-kit-vue/arrum-zada/src/components.ts) dengan prefix `G*` persis seperti di `bullion-token-wallet`:

```vue
<script setup lang="ts">
import { GButton, GAlert, GBadge, GModal } from '@/components'
</script>

<template>
  <GButton
    label="Ajukan Akad"
    type="primary"
    size="md"
    @click="onSubmit"
  />

  <GAlert
    title="Pemberitahuan Syariah"
    description="Proses verifikasi berkas emas memakan waktu maksimal 1 hari kerja."
    variant="success"
  />
</template>
```
