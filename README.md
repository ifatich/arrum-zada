# Arrum Zada Frontend (Vue 3 + Kitvue Design System)

Aplikasi kalkulator dan presentasi **Simulasi Rencana Emas Haji Arrum Zada** untuk Sales Officer dan nasabah PT Pegadaian. Dibangun menggunakan Vue 3, Vite, TypeScript, Pinia, dan Kitvue Design System (`kitvue-public`).

---

## 🛠️ Tech Stack & Konfigurasi

* **Framework:** Vue 3.5 (`<script setup>`, Composition API)
* **Language:** TypeScript 5.7 (Strict Types, Zero `any`)
* **Bundler:** Vite 6
* **UI Kit Library:** `kitvue-public` v1.0.5 (dengan alias `kitvue` di `vite.config.ts`)
* **Unit Testing:** Vitest
* **Design System & Tokens:**
  - `kitvue/src/assets/scss/g-kit.scss` (Tokens, grid, colors, Bootstrap overrides)
  - `src/assets/styles/tokens.css` (G-Kit custom elevation & inputs)
  - Font `Nunito Sans` (Standar Tipografi Pegadaian)
* **State Management & Routing:** Pinia 3 & Vue Router 4

---

## 🚀 Perintah Kerja (Scripts)

Masuk ke direktori project:
```bash
cd "arrum-zada"
```

1. **Jalankan development server:**
   ```bash
   pnpm dev
   ```
   Akses di browser: `http://localhost:5173`

2. **Pemeriksaan Tipe TypeScript (Type Check):**
   ```bash
   pnpm type-check
   ```

3. **Jalankan Unit Tests:**
   ```bash
   pnpm test
   ```

4. **Kompilasi Production Bundle:**
   ```bash
   pnpm build
   ```

5. **Sinkronisasi Harga Emas Galeri 24 (CLI Script):**
   ```bash
   node scripts/fetch-gold-price.mjs
   ```

---

## 🏛️ Arsitektur Proyek & Modul

```
arrum-zada/
├── .github/workflows/
│   └── deploy.yml              # CI/CD: fetch price -> type-check -> test -> build -> Pages
├── docs/
│   └── metodologi-asumsi-7-persen.md  # Spesifikasi metodologi asumsi simulasi 7%
├── scripts/
│   └── fetch-gold-price.mjs    # Skrip sinkronisasi harga resmi Galeri 24
├── src/
│   ├── assets/                 # SVGs, font assets, and custom tokens
│   ├── components/
│   │   ├── modules/arrum/      # Atomic UI components: Header, Form, Waktu, Hasil, Modal
│   │   └── index.ts            # Ekspor modul komponen
│   ├── composables/
│   │   ├── useArrumSimulasi.ts # Composable logika kalkulasi finansial & reactive state
│   │   └── useNumericKeyboard.ts # Composable penegakan mode keyboard numerik di mobile
│   ├── services/
│   │   └── galeri24Service.ts  # Service data acuan resmi Galeri 24
│   ├── utils/
│   │   └── normalizeInput.ts   # Sanitasi & normalisasi pure functions untuk input form
│   ├── views/
│   │   └── DashboardView.vue   # Orchestrator layout dashboard simulasi
│   ├── components.ts           # Adapter komponen Kitvue (GButton, GAlert, GModal, dll.)
│   └── main.ts                 # Vue app entry point
└── tests/
    └── normalizeInput.test.ts  # Test suite unit normalisasi dan sanitasi
```

---

## 📋 Konteks Bisnis & Standar Kepatuhan

Detail keputusan produk, akad tabungan cicil, integritas harga, dan kepatuhan syariah dapat dibaca pada:
* [`konteks.md`](file:///Users/lord/Documents/Bullion%20Token/arrum-zada/konteks.md)
* [`docs/metodologi-asumsi-7-persen.md`](file:///Users/lord/Documents/Bullion%20Token/arrum-zada/docs/metodologi-asumsi-7-persen.md)
