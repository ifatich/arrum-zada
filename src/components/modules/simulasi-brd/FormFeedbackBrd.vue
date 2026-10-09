<script setup lang="ts">
/**
 * @file FormFeedbackBrd.vue
 * @description Formulir Feedback Uji Coba Dashboard Simulasi Rencana Emas Haji.
 * Mengikuti standar modal Kitvue & Pegadaian:
 * 1. Trigger manual berupa Floating Action Button (FAB) di sudut kanan bawah layar.
 * 2. Menggunakan slot standar BaseModal (header, konten/body, dan footer terpisah).
 * 3. Modal header hanya memuat Title tebal & tombol tutup.
 * 4. Halaman sukses interaktif & menarik dengan visual ilustrasi resmi emas haji.
 * 5. Mendukung handoff aplikasi Tring via deep link dan kuesioner 3 langkah.
 */
import { ref, reactive, computed, onMounted } from 'vue'
import {
  GButton,
  GInputText,
  GTextArea,
  GBadge,
  RadioComponent,
} from '@/components'
import BaseModal from '@/components/shared/modals/BaseModal.vue'
import { getDeviceInfo, TRING_CONFIG, launchTringApp, type DeviceInfo } from '@/utils/tringLauncher'

// --- Reactive State Modal & Alur ---
const isModalOpen = ref<boolean>(false)
const modalMode = ref<'handoff' | 'survey'>('survey')
const wasOpenedFromHandoff = ref<boolean>(false)
const isSubmitted = ref<boolean>(false)
const currentStep = ref<number>(1)

// --- Deep Link & Store Target ---
const deviceInfo = ref<DeviceInfo>(getDeviceInfo())

const detectDevice = (): void => {
  deviceInfo.value = getDeviceInfo()
}

onMounted(() => {
  detectDevice()
})

// --- Data Formulir Evaluasi (Sesuai BRD) ---
const form = reactive({
  // Langkah 1: Penilaian & Tampilan
  ratingKeseluruhan: 5,
  kemudahanPaham: 'Sangat Mudah',
  kesederhanaanAlur: 'Sangat Sederhana',
  bagianPalingMembantu: 'Hasil Perhitungan Emas',

  // Langkah 2: Fitur & Saran
  fiturFavorit: 'Konversi Total Kebutuhan Ke Gram',
  urgensiBpih: 'Sangat penting',
  kebutuhanTambahanPenting: 'Ya',
  pilihanNamaProduk: 'Rencana Emas Haji',
  saranMasukan: '',

  // Langkah 3: Profil Calon Jemaah (Opsional)
  namaLengkap: '',
  nomorHp: '',
  rentangUsia: '25 - 35 th',
  tahunKeberangkatanUser: '2035',
})

const steps = [
  { step: 1, title: 'Penilaian Pengalaman' },
  { step: 2, title: 'Fitur & Masukan' },
  { step: 3, title: 'Profil Singkat' },
]

const ratingLabel = computed(() => {
  switch (form.ratingKeseluruhan) {
    case 5:
      return 'Sangat Memuaskan (5/5)'
    case 4:
      return 'Bagus & Bermanfaat (4/5)'
    case 3:
      return 'Cukup Baik (3/5)'
    case 2:
      return 'Perlu Ditingkatkan (2/5)'
    default:
      return 'Kurang Memuaskan (1/5)'
  }
})

// Header Title Hanya Teks Tebal Sesuai Mode/Status
const headerTitle = computed(() => {
  if (isSubmitted.value) {
    return 'Terima Kasih Atas Masukan Anda!'
  }
  if (modalMode.value === 'handoff') {
    return 'Mengarahkan ke Aplikasi Tring'
  }
  return 'Bantu Kami Menyempurnakan Fitur Ini'
})

// Opsi Pilihan Ganda untuk RadioComponent kitvue-public
const kemudahanOptions = [
  { text: 'Sangat Mudah', value: 'Sangat Mudah' },
  { text: 'Cukup Jelas', value: 'Cukup Jelas' },
  { text: 'Perlu Penjelasan Lebih', value: 'Perlu Penjelasan Lebih' },
]

const bagianOptions = [
  { text: 'Hasil Perhitungan Emas', value: 'Hasil Perhitungan Emas' },
  { text: 'Proyeksi Kenaikan Harga', value: 'Proyeksi Kenaikan Harga' },
  { text: 'Fitur Unduh Ringkasan', value: 'Fitur Unduh Ringkasan' },
]

const fiturOptions = [
  { text: 'Konversi Total Kebutuhan Ke Gram', value: 'Konversi Total Kebutuhan Ke Gram' },
  { text: 'Dapat Mengetahui Kebutuhan Keberangkatan', value: 'Dapat Mengetahui Kebutuhan Keberangkatan' },
  { text: 'Menghitung Estimasi Biaya Keberangkatan', value: 'Menghitung Estimasi Biaya Keberangkatan' },
]

const urgensiOptions = [
  { text: 'Sangat penting', value: 'Sangat penting' },
  { text: 'Cukup penting', value: 'Cukup penting' },
]

const namaProdukOptions = [
  { text: 'Rencana Emas Haji', value: 'Rencana Emas Haji' },
  { text: 'Mulia Tabungan Haji', value: 'Mulia Tabungan Haji' },
  { text: 'Investasi Pelunasan Haji', value: 'Investasi Pelunasan Haji' },
]

const usiaOptions = [
  { text: '18 - 25 tahun', value: '18 - 25 th' },
  { text: '25 - 35 tahun', value: '25 - 35 th' },
  { text: '35 - 45 tahun', value: '35 - 45 th' },
  { text: 'Diatas 45 tahun', value: 'Diatas 45 th' },
]

// --- Navigasi & Aksi Modal ---
const triggerAppHandoff = (): void => {
  detectDevice()
  modalMode.value = 'handoff'
  wasOpenedFromHandoff.value = true
  isSubmitted.value = false
  isModalOpen.value = true

  // Otomatis picu pembukaan Tring secara dinamis (Android Intent / iOS Scheme + Fallback Store)
  launchTringApp()
}

const openDirectSurvey = (): void => {
  modalMode.value = 'survey'
  wasOpenedFromHandoff.value = false
  isModalOpen.value = true
}

const openSurveyFromHandoff = (): void => {
  modalMode.value = 'survey'
  currentStep.value = 1
}

const setRatingAndProceed = (star: number): void => {
  form.ratingKeseluruhan = star
  modalMode.value = 'survey'
  currentStep.value = 1
}

const closeModal = (): void => {
  isModalOpen.value = false
}

const submitFeedback = (): void => {
  isSubmitted.value = true
}

const resetFeedback = (): void => {
  isSubmitted.value = false
  currentStep.value = 1
}

// Expose fungsi kontrol untuk dipanggil dari view orchestrator
defineExpose({
  triggerAppHandoff,
  openDirectSurvey,
  closeModal,
})
</script>

<template>
  <!-- ========================================================
       1. TRIGGER FLOATING BUTTON (HANYA BUTTON MENGAMBANG)
       ======================================================== -->
  <button
    id="btn-floating-feedback"
    type="button"
    class="floating-feedback-btn"
    aria-label="Beri Masukan Simulasi Rencana Emas Haji"
    title="Beri Masukan & Evaluasi Simulasi (±1 Menit)"
    @click="openDirectSurvey"
  >
    <span class="floating-btn-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="fb-floating-svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </span>
    <span class="floating-btn-label">Beri Masukan</span>
    <span class="floating-btn-pill">±1 mnt</span>
  </button>

  <!-- ========================================================
       2. MODAL DIALOG STANDAR (SLOT HEADER, KONTEN, FOOTER)
       ======================================================== -->
  <BaseModal
    :model-value="isModalOpen"
    width="740px"
    title-id="feedback-modal-title"
    @update:model-value="isModalOpen = $event"
  >
    <!-- SLOT 1: HEADER (HANYA TITLE TEKS TEBAL & CLOSE BUTTON) -->
    <template #header>
      <header class="fb-modal-header">
        <h3 id="feedback-modal-title" class="fb-modal-title">
          {{ headerTitle }}
        </h3>
        <button
          id="btn-close-fb-modal"
          class="fb-modal-close"
          aria-label="Tutup dialog"
          @click="closeModal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>
    </template>

    <!-- SLOT 2: KONTEN / BODY (SCROLLABLE CONTAINER) -->
    <div class="fb-modal-body">
      <!-- ========================================================
           A. MODE HANDOFF APLIKASI
           ======================================================== -->
      <div v-if="modalMode === 'handoff'" class="handoff-wrapper animate-fade">
        <div class="handoff-status-panel">
          <!-- Background Pattern & Ambient Glow Accents -->
          <div class="handoff-bg-pattern" aria-hidden="true"></div>
          <div class="handoff-bg-glow-emerald" aria-hidden="true"></div>
          <div class="handoff-bg-glow-gold" aria-hidden="true"></div>

          <div class="handoff-main-layout">
            <div class="handoff-app-icon" aria-hidden="true">
              <div class="icon-pulse-aura"></div>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                <line x1="9" y1="6" x2="15" y2="6"></line>
              </svg>
            </div>

            <div class="handoff-info">
              <div class="handoff-title-wrap">
                <h4 class="handoff-app-title">Membuka Tabungan Emas di Tring</h4>
                <span class="platform-tag" :class="`platform-${deviceInfo.platformLabel.toLowerCase()}`">
                  <span class="platform-dot" aria-hidden="true"></span>
                  {{ deviceInfo.platformLabel }}
                </span>
              </div>
              <p class="handoff-app-desc">
                <template v-if="deviceInfo.isAndroid">
                  Browser sedang membuka aplikasi Tring pada perangkat Android Anda. Jika aplikasi belum terpasang, sistem akan otomatis mengarahkan ke Google Play Store.
                </template>
                <template v-else-if="deviceInfo.isIos">
                  Browser sedang membuka aplikasi Tring pada perangkat Apple iOS Anda. Jika aplikasi belum terpasang, sistem akan otomatis mengarahkan ke App Store.
                </template>
                <template v-else>
                  Aplikasi Tring Pegadaian tersedia untuk ponsel Android dan iOS. Buka langsung melalui toko aplikasi resmi di bawah atau gunakan simulasi ini di smartphone Anda.
                </template>
              </p>

              <!-- Actions: Premium Dual App Store Badges -->
              <div class="handoff-actions-row">
                <template v-if="deviceInfo.isMobile">
                  <a
                    :href="deviceInfo.isAndroid ? TRING_CONFIG.androidIntentUrl : TRING_CONFIG.iosSchemeUrl"
                    class="btn-store-badge btn-primary-launch"
                    @click="() => launchTringApp()"
                  >
                    <span>Buka Aplikasi Tring</span>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a
                    :href="deviceInfo.isAndroid ? TRING_CONFIG.androidPlayStoreUrl : TRING_CONFIG.iosAppStoreUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-store-badge btn-app-store"
                  >
                    <svg v-if="deviceInfo.isAndroid" class="store-badge-svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186A2.247 2.247 0 0 1 3 20.6V3.4a2.247 2.247 0 0 1 .609-1.586z" fill="#00D2FF" />
                      <path d="M17.485 8.308L4.853 1.055a2.213 2.213 0 0 0-1.244-.327L13.793 12l3.692-3.692z" fill="#00F076" />
                      <path d="M3.609 23.272a2.213 2.213 0 0 0 1.244-.327l12.632-7.253L13.793 12 3.609 23.272z" fill="#FF3A44" />
                      <path d="M20.578 10.076l-3.093-1.768L13.793 12l3.692 3.692 3.093-1.768a2.235 2.235 0 0 0 0-3.848z" fill="#FFC400" />
                    </svg>
                    <svg v-else class="store-badge-svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.64-1.24z"/>
                    </svg>
                    <span>Unduh di {{ deviceInfo.isAndroid ? 'Play Store' : 'App Store' }}</span>
                  </a>
                </template>
                <template v-else>
                  <!-- Desktop: Dual Official App Store Buttons -->
                  <a
                    :href="TRING_CONFIG.androidPlayStoreUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-store-badge btn-google-play"
                    title="Unduh Tring di Google Play Store"
                  >
                    <svg class="store-badge-svg" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186A2.247 2.247 0 0 1 3 20.6V3.4a2.247 2.247 0 0 1 .609-1.586z" fill="#00D2FF" />
                      <path d="M17.485 8.308L4.853 1.055a2.213 2.213 0 0 0-1.244-.327L13.793 12l3.692-3.692z" fill="#00F076" />
                      <path d="M3.609 23.272a2.213 2.213 0 0 0 1.244-.327l12.632-7.253L13.793 12 3.609 23.272z" fill="#FF3A44" />
                      <path d="M20.578 10.076l-3.093-1.768L13.793 12l3.692 3.692 3.093-1.768a2.235 2.235 0 0 0 0-3.848z" fill="#FFC400" />
                    </svg>
                    <div class="store-badge-text">
                      <span class="store-badge-sub">Temukan di</span>
                      <strong class="store-badge-title">Google Play</strong>
                    </div>
                  </a>

                  <a
                    :href="TRING_CONFIG.iosAppStoreUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-store-badge btn-app-store"
                    title="Unduh Tring di Apple App Store"
                  >
                    <svg class="store-badge-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.64-1.24z"/>
                    </svg>
                    <div class="store-badge-text">
                      <span class="store-badge-sub">Unduh di</span>
                      <strong class="store-badge-title">App Store</strong>
                    </div>
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Jembatan Penilaian Cepat (Dual-Objective Hook) -->
        <div class="handoff-survey-bridge">
          <div class="bridge-header">
            <span class="bridge-eyebrow">Sambil Menunggu Aplikasi</span>
            <h4 class="bridge-title">Bantu Kami Menilai Simulasi Emas Haji Ini</h4>
            <p class="bridge-desc">
              Pengalaman Anda sangat berharga bagi kami. Luangkan waktu sejenak (±1 menit) untuk menilai kemudahan simulasi ini:
            </p>
          </div>

          <div class="bridge-rating-row">
            <span class="bridge-rating-label">Rating Kepuasan Anda:</span>
            <div class="star-row" role="radiogroup" aria-label="Rating cepat simulasi">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="star-click-btn"
                :class="{ 'is-active': star <= form.ratingKeseluruhan }"
                :title="`Beri nilai ${star} dari 5 bintang`"
                @click="setRatingAndProceed(star)"
              >
                <svg viewBox="0 0 24 24" class="star-svg" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="bridge-cta-row">
            <GButton
              id="btn-bridge-to-survey"
              label="Isi Kuesioner Lengkap (3 Langkah) →"
              type="primary"
              size="md"
              @click="openSurveyFromHandoff"
            />
          </div>
        </div>
      </div>

      <!-- ========================================================
           B. STATE SUKSES BERHASIL TERKIRIM (KONTEN MENARIK & GAMBAR)
           ======================================================== -->
      <div v-else-if="isSubmitted" class="success-content animate-fade">
        <div class="success-hero-image-wrap">
          <img
            src="/images/feedback-success-haji.jpg"
            alt="Ilustrasi Tabungan Emas Haji Pegadaian"
            class="success-hero-image"
          />
        </div>

        <div class="success-text-group">
          <div class="success-badge-row">
            <span class="success-pill">
              <span class="pill-dot" aria-hidden="true"></span>
              Alhamdulillah · Masukan Berhasil Diterima
            </span>
          </div>
          <h4 class="success-title">Terima Kasih Banyak Atas Kontribusi Anda!</h4>
          <p class="success-desc">
            Evaluasi dan saran yang Anda sampaikan menjadi panduan penting bagi tim Pegadaian untuk terus menyempurnakan 
            kalkulator simulasi dan fitur perencanaan ibadah haji berbasis emas.
          </p>
        </div>

        <!-- Kartu Poin Manfaat Masukan Pengguna (Flat, Tanpa Shadow Ganda) -->
        <div class="success-takeaway-grid">
          <div class="takeaway-card">
            <div class="takeaway-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <div class="takeaway-info">
              <strong class="takeaway-title">Akurasi &amp; Transparansi</strong>
              <span class="takeaway-sub">Penyempurnaan formula konversi gramasi emas &amp; estimasi BPIH</span>
            </div>
          </div>

          <div class="takeaway-card">
            <div class="takeaway-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div class="takeaway-info">
              <strong class="takeaway-title">Integrasi Layanan Tring</strong>
              <span class="takeaway-sub">Koneksi lebih cepat ke tabungan emas digital resmi Pegadaian</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================
           C. KUESIONER EVALUASI 3 LANGKAH
           ======================================================== -->
      <div v-else class="survey-flow animate-fade">
        <!-- Stepper Track Terpusat -->
        <div class="survey-stepper-header">
          <div class="stepper-track">
            <template v-for="(s, idx) in steps" :key="s.step">
              <div
                :class="['stepper-item', { active: currentStep === s.step, completed: currentStep > s.step }]"
                role="button"
                tabindex="0"
                @click="currentStep = s.step"
              >
                <div class="stepper-indicator">
                  <span v-if="currentStep > s.step" class="indicator-icon">✓</span>
                  <span v-else>{{ s.step }}</span>
                </div>
                <div class="stepper-label-group">
                  <span class="stepper-step-number">Langkah {{ s.step }}</span>
                  <span class="stepper-step-title">{{ s.title }}</span>
                </div>
              </div>

              <div
                v-if="idx < steps.length - 1"
                :class="['stepper-connector', { completed: currentStep > s.step }]"
                aria-hidden="true"
              ></div>
            </template>
          </div>
        </div>

        <!-- LANGKAH 1: PENILAIAN PENGALAMAN -->
        <div v-if="currentStep === 1" class="step-content animate-fade">
          <div class="question-list">
            <!-- 1. Rating Bintang Keseluruhan -->
            <div class="form-item">
              <label class="form-question-label">
                <span class="q-num">1</span>
                <span>Rating kepuasan Anda terhadap kalkulator simulasi:</span>
              </label>
              <div class="star-rating-box">
                <div class="star-row" role="radiogroup" aria-label="Rating kepuasan simulasi">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="star-click-btn"
                    :class="{ 'is-active': star <= form.ratingKeseluruhan }"
                    :title="`Beri nilai ${star} dari 5 bintang`"
                    @click="form.ratingKeseluruhan = star"
                  >
                    <svg viewBox="0 0 24 24" class="star-svg" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                </div>
                <div class="rating-feedback-badge">
                  <GBadge
                    :type="form.ratingKeseluruhan >= 3 ? 'primary' : 'secondary'"
                    :label="ratingLabel"
                  />
                </div>
              </div>
            </div>

            <!-- 2. Kemudahan Pemahaman (Reuse RadioComponent) -->
            <div class="form-item">
              <label class="form-question-label">
                <span class="q-num">2</span>
                <span>Seberapa mudah memahami hasil simulasi konversi emas?</span>
              </label>
              <RadioComponent
                id="radio-kemudahan"
                v-model="form.kemudahanPaham"
                :items="kemudahanOptions"
                class="radio-grid-3"
              />
            </div>

            <!-- 3. Bagian Tampilan yang Paling Membantu (Reuse RadioComponent) -->
            <div class="form-item">
              <label class="form-question-label">
                <span class="q-num">3</span>
                <span>Bagian mana dari tampilan simulasi yang paling membantu Anda?</span>
              </label>
              <RadioComponent
                id="radio-bagian-membantu"
                v-model="form.bagianPalingMembantu"
                :items="bagianOptions"
                class="radio-grid-3"
              />
            </div>
          </div>
        </div>

        <!-- LANGKAH 2: FITUR & SARAN PRODUK -->
        <div v-if="currentStep === 2" class="step-content animate-fade">
          <div class="question-list">
            <!-- 1. Fitur Paling Disukai -->
            <div class="form-item">
              <label class="form-question-label">
                <span class="q-num">1</span>
                <span>Fitur yang paling bermanfaat bagi perencanaan Anda:</span>
              </label>
              <RadioComponent
                id="radio-fitur-favorit"
                v-model="form.fiturFavorit"
                :items="fiturOptions"
                class="radio-grid-stacked"
              />
            </div>

            <!-- 2. Urgensi BPIH -->
            <div class="form-item">
              <label class="form-question-label">
                <span class="q-num">2</span>
                <span>Seberapa penting penggunaan estimasi BPIH nasional?</span>
              </label>
              <RadioComponent
                id="radio-urgensi-bpih"
                v-model="form.urgensiBpih"
                :items="urgensiOptions"
                class="radio-grid-2"
              />
            </div>

            <!-- 3. Pilihan Nama Produk Terbaik -->
            <div class="form-item">
              <label class="form-question-label">
                <span class="q-num">3</span>
                <span>Menurut Anda, nama mana yang paling pas untuk produk ini?</span>
              </label>
              <RadioComponent
                id="radio-nama-produk"
                v-model="form.pilihanNamaProduk"
                :items="namaProdukOptions"
                class="radio-grid-3"
              />
            </div>

            <!-- 4. Saran & Masukan Bebas -->
            <div class="form-item">
              <label class="form-question-label" for="fb-saran-text">
                <span class="q-num">4</span>
                <span>Saran &amp; Masukan Tambahan (Opsional):</span>
              </label>
              <GTextArea
                id="fb-saran-text"
                placeholder="Tuliskan saran perbaikan tampilan, fitur yang diharapkan, atau kendala yang Anda alami..."
                v-model="form.saranMasukan"
                class="text-area"
              />
            </div>
          </div>
        </div>

        <!-- LANGKAH 3: PROFIL SINGKAT CALON JEMAAH -->
        <div v-if="currentStep === 3" class="step-content animate-fade">
          <div class="profile-compact-grid">
            <div class="field-item">
              <label class="field-label" for="fb-nama">Nama Lengkap (Opsional)</label>
              <GInputText
                id="fb-nama"
                placeholder="Contoh: Ahmad Fauzi"
                v-model="form.namaLengkap"
              />
            </div>

            <div class="field-item">
              <label class="field-label" for="fb-hp">Nomor WhatsApp / HP (Opsional)</label>
              <GInputText
                id="fb-hp"
                placeholder="Contoh: 081234567890"
                v-model="form.nomorHp"
              />
            </div>

            <div class="field-item full-width">
              <label class="field-label">Rentang Usia Anda</label>
              <RadioComponent
                id="radio-rentang-usia"
                v-model="form.rentangUsia"
                :items="usiaOptions"
                class="radio-grid-4"
              />
            </div>

            <div class="field-item full-width">
              <label class="field-label" for="fb-thn-user">Estimasi Tahun Keberangkatan Anda</label>
              <GInputText
                id="fb-thn-user"
                placeholder="Contoh: 2035"
                v-model="form.tahunKeberangkatanUser"
              />
            </div>
          </div>

          <!-- Catatan Privasi & Keamanan (Flat, Tanpa Shadow) -->
          <div class="privacy-alert-box">
            <div class="privacy-note-card">
              <div class="privacy-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="privacy-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div class="privacy-text">
                <strong>Data Terlindungi &amp; Anonim:</strong> Data preferensi Anda dijaga kerahasiaannya dan hanya digunakan untuk peningkatan kualitas simulasi layanan Pegadaian.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLOT 3: FOOTER (STANDAR MODAL KITVUE DENGAN NAVIGASI LENGKAP) -->
    <template #footer>
      <div class="fb-modal-footer">
        <!-- FOOTER: HANDOFF MODE -->
        <template v-if="modalMode === 'handoff'">
          <button type="button" class="btn-footer-link" @click="closeModal">
            Nanti Saja
          </button>
          <a
            :href="deviceInfo.isAndroid ? TRING_CONFIG.androidIntentUrl : (deviceInfo.isIos ? TRING_CONFIG.iosSchemeUrl : TRING_CONFIG.androidPlayStoreUrl)"
            class="btn-footer-action"
            @click="() => launchTringApp()"
          >
            Buka Aplikasi Tring ↗
          </a>
        </template>

        <!-- FOOTER: STATE SUKSES -->
        <template v-else-if="isSubmitted">
          <button type="button" class="btn-footer-link" @click="resetFeedback">
            Kirim Masukan Lain
          </button>
          <GButton
            id="btn-feedback-close"
            label="Selesai &amp; Tutup Dialog"
            type="primary"
            size="md"
            @click="closeModal"
          />
        </template>

        <!-- FOOTER: LANGKAH 1 -->
        <template v-else-if="currentStep === 1">
          <button
            v-if="wasOpenedFromHandoff"
            type="button"
            class="btn-footer-secondary"
            @click="modalMode = 'handoff'"
          >
            ← Info Aplikasi
          </button>
          <div v-else></div>
          <GButton
            id="btn-next-step-1"
            label="Lanjut ke Fitur &amp; Masukan →"
            type="primary"
            size="md"
            @click="currentStep = 2"
          />
        </template>

        <!-- FOOTER: LANGKAH 2 -->
        <template v-else-if="currentStep === 2">
          <GButton
            id="btn-prev-step-2"
            label="← Kembali"
            type="secondary"
            size="md"
            @click="currentStep = 1"
          />
          <GButton
            id="btn-next-step-2"
            label="Lanjut ke Profil Singkat →"
            type="primary"
            size="md"
            @click="currentStep = 3"
          />
        </template>

        <!-- FOOTER: LANGKAH 3 -->
        <template v-else-if="currentStep === 3">
          <GButton
            id="btn-prev-step-3"
            label="← Kembali"
            type="secondary"
            size="md"
            @click="currentStep = 2"
          />
          <GButton
            id="btn-submit-feedback"
            label="Kirim Masukan Anda ✓"
            type="primary"
            size="md"
            @click="submitFeedback"
          />
        </template>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
/* ========================================================
   1. TRIGGER FLOATING BUTTON (CORPORATE FLAT, ELEGAN)
   ======================================================== */
.floating-feedback-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1040;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px 10px 12px;
  background: var(--g-kit-broccoli-50, #004d43);
  color: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-broccoli-60, #003e36);
  border-radius: 9999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.floating-feedback-btn:hover {
  background: var(--g-kit-broccoli-60, #003e36);
}

.floating-btn-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.fb-floating-svg {
  width: 16px;
  height: 16px;
}

.floating-btn-label {
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  white-space: nowrap;
}

.floating-btn-pill {
  font-size: var(--g-kit-font-size-atom, 11px);
  line-height: 1;
  padding: 3px 7px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
  font-weight: var(--g-kit-font-weight-normal, 400);
}

/* ========================================================
   2. MODAL HEADER (HANYA TITLE TEKS TEBAL & CLOSE BUTTON)
   ======================================================== */
.fb-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  width: 100%;
}

.fb-modal-title {
  margin: 0;
  font-size: var(--g-kit-font-size-lambda, 20px);
  line-height: var(--g-kit-line-height-lambda, 28px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  color: var(--g-kit-black-80, #252528);
}

.fb-modal-close {
  background: transparent;
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: var(--g-kit-black-60, #58585b);
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.fb-modal-close:hover {
  background: var(--g-kit-black-10, #f8fafc);
  color: var(--g-kit-black-80, #252528);
}

/* ========================================================
   3. MODAL BODY CONTAINER (SCROLLABLE & PROPORTIONAL)
   ======================================================== */
.fb-modal-body {
  padding: 24px;
  background: var(--g-kit-white, #ffffff);
}

/* ========================================================
   4. MODAL FOOTER SLOT (STANDAR MODAL KITVUE)
   ======================================================== */
.fb-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.btn-footer-link {
  background: transparent;
  border: none;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  color: var(--g-kit-black-60, #58585b);
  cursor: pointer;
  text-decoration: underline;
  padding: 8px 12px;
}

.btn-footer-link:hover {
  color: var(--g-kit-black-80, #252528);
}

.btn-footer-secondary {
  background: transparent;
  border: 1px solid var(--g-kit-black-30, #cbd5e1);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  color: var(--g-kit-black-70, #334155);
  font-weight: var(--g-kit-font-weight-normal, 500);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-footer-secondary:hover {
  background: var(--g-kit-black-10, #f8fafc);
}

.btn-footer-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: var(--g-kit-broccoli-50, #004d43);
  color: var(--g-kit-white, #ffffff);
  border-radius: 8px;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 20px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.btn-footer-action:hover {
  background: var(--g-kit-broccoli-60, #003e36);
  color: var(--g-kit-white, #ffffff);
}

/* ========================================================
   5. KONTEN SUKSES INTERAKTIF (DENGAN ILUSTRASI EMAS HAJI)
   ======================================================== */
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 16px 8px;
}

.success-hero-image-wrap {
  width: 140px;
  height: 140px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  background: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.success-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.success-badge-row {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.success-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--g-kit-font-size-atom, 12px);
  line-height: 1.4;
  font-weight: var(--g-kit-font-weight-bold, 700);
  color: var(--g-kit-broccoli-50, #004d43);
  background: var(--g-kit-lime-10, #e6f6ea);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  padding: 4px 12px;
  border-radius: 9999px;
}

.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--g-kit-lime-50, #00ab4e);
}

.success-title {
  margin: 0 0 8px;
  font-size: var(--g-kit-font-size-lambda, 20px);
  line-height: var(--g-kit-line-height-lambda, 28px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  color: var(--g-kit-black-80, #252528);
}

.success-desc {
  margin: 0 auto 24px;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: var(--g-kit-line-height-sigma, 22px);
  color: var(--g-kit-black-60, #58585b);
  max-width: 560px;
}

.success-takeaway-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.takeaway-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--g-kit-black-10, #f8fafc);
  border: 1px solid var(--g-kit-black-20, #e2e8f0);
  text-align: left;
  box-shadow: none;
}

.takeaway-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-broccoli-50, #004d43);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.takeaway-info {
  display: flex;
  flex-direction: column;
}

.takeaway-title {
  font-size: var(--g-kit-font-size-sigma, 14px);
  font-weight: var(--g-kit-font-weight-bold, 700);
  color: var(--g-kit-black-80, #252528);
  margin-bottom: 2px;
}

.takeaway-sub {
  font-size: var(--g-kit-font-size-atom, 12px);
  line-height: 1.4;
  color: var(--g-kit-black-60, #58585b);
}

/* ========================================================
   6. HANDOFF SCREEN STYLES (FLAT, TANPA BAYANGAN GANDA)
   ======================================================== */
.handoff-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.handoff-status-panel {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #022c22 0%, #064e3b 55%, #033a2b 100%);
  border: 1px solid rgba(52, 211, 153, 0.32);
  padding: 22px 24px;
  box-shadow: 0 10px 28px -10px rgba(2, 44, 34, 0.45);
}

.handoff-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: url('/images/banner-pattern-islamic.png');
  background-size: 260px;
  background-repeat: repeat;
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.handoff-bg-glow-emerald {
  position: absolute;
  top: -60px;
  right: -40px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.3) 0%, rgba(52, 211, 153, 0) 70%);
  pointer-events: none;
}

.handoff-bg-glow-gold {
  position: absolute;
  bottom: -50px;
  left: -30px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0) 70%);
  pointer-events: none;
}

.handoff-main-layout {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

.handoff-app-icon {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #34d399;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.icon-pulse-aura {
  position: absolute;
  inset: -3px;
  border-radius: 17px;
  border: 1px solid rgba(52, 211, 153, 0.35);
  pointer-events: none;
  animation: pulse-aura 3s ease-in-out infinite;
}

@keyframes pulse-aura {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.handoff-info {
  flex: 1;
  min-width: 0;
}

.handoff-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.handoff-app-title {
  margin: 0;
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-bold);
  color: #ffffff;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.platform-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #d1fae5;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  letter-spacing: 0.03em;
}

.platform-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #34d399;
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.9);
}

.platform-android {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(74, 222, 128, 0.4);
  color: #bbf7d0;
}

.platform-ios {
  background: rgba(56, 189, 248, 0.2);
  border-color: rgba(125, 211, 252, 0.4);
  color: #bae6fd;
}

.handoff-app-desc {
  margin: 0 0 16px;
  font-size: var(--g-kit-font-size-sigma);
  line-height: 1.55;
  color: #e2e8f0;
}

.handoff-actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* Premium App Store Badges */
.btn-store-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  box-sizing: border-box;
}

.btn-google-play {
  background: #ffffff;
  color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-google-play:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.btn-app-store {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.btn-app-store:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.btn-primary-launch {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}

.btn-primary-launch:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.5);
}

.store-badge-svg {
  flex-shrink: 0;
}

.store-badge-text {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.15;
}

.store-badge-sub {
  font-size: 10px;
  font-weight: 500;
  opacity: 0.8;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.store-badge-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Jembatan Penilaian Cepat */
.handoff-survey-bridge {
  padding: 20px 24px;
  border-radius: 14px;
  background: var(--g-kit-lime-10, #e6f6ea);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  box-shadow: none;
}

.bridge-eyebrow {
  display: block;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--g-kit-broccoli-50, #004d43);
  margin-bottom: 4px;
}

.bridge-title {
  margin: 0 0 6px;
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
}

.bridge-desc {
  margin: 0 0 16px;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-60, #58585b);
}

.bridge-rating-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.bridge-rating-label {
  font-size: var(--g-kit-font-size-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
}

.bridge-cta-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-skip-survey {
  background: transparent;
  border: none;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-60, #58585b);
  cursor: pointer;
  padding: 8px 12px;
  text-decoration: underline;
}

/* ========================================================
   7. STEPPER & QUESTION FLOW (CORPORATE FLAT)
   ======================================================== */
.survey-flow {
  display: flex;
  flex-direction: column;
}

.survey-stepper-header {
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--g-kit-black-20, #e2e8f0);
}

.stepper-track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.stepper-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.stepper-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--g-kit-font-size-omega);
  font-weight: var(--g-kit-font-weight-bold);
  background: var(--g-kit-black-10, #f8fafc);
  color: var(--g-kit-black-50, #939597);
  border: 1.5px solid var(--g-kit-black-20, #e2e8f0);
  box-shadow: none;
  flex-shrink: 0;
}

.stepper-item.active .stepper-indicator {
  background: var(--g-kit-broccoli-50, #004d43);
  color: var(--g-kit-white, #ffffff);
  border-color: var(--g-kit-broccoli-50, #004d43);
}

.stepper-item.completed .stepper-indicator {
  background: var(--g-kit-lime-50, #00ab4e);
  color: var(--g-kit-white, #ffffff);
  border-color: var(--g-kit-lime-50, #00ab4e);
}

.indicator-icon {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
}

.stepper-label-group {
  display: flex;
  flex-direction: column;
}

.stepper-step-number {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-normal);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--g-kit-black-50, #939597);
}

.stepper-item.active .stepper-step-number {
  color: var(--g-kit-broccoli-50, #004d43);
  font-weight: var(--g-kit-font-weight-bold);
}

.stepper-step-title {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-normal);
  color: var(--g-kit-black-60, #58585b);
}

.stepper-item.active .stepper-step-title {
  color: var(--g-kit-black-80, #252528);
  font-weight: var(--g-kit-font-weight-bold);
}

.stepper-connector {
  flex: 1;
  height: 2px;
  background: var(--g-kit-black-20, #e2e8f0);
  margin: 0 14px;
  min-width: 24px;
  transition: background-color 0.25s ease;
}

.stepper-connector.completed {
  background: var(--g-kit-lime-50, #00ab4e);
}

/* Question Flow */
.question-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  padding-bottom: 18px;
  border-bottom: 1px solid var(--g-kit-black-10, #f8fafc);
}

.form-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.form-question-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
  margin-bottom: 12px;
}

.q-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-broccoli-50, #004d43);
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-bold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: none;
}

/* Standarisasi RadioComponent */
:deep(.radio-container) {
  display: grid !important;
  width: 100% !important;
  gap: 12px !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.radio-container.radio-grid-3),
:deep(.radio-grid-3) {
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
}

:deep(.radio-container.radio-grid-2),
:deep(.radio-grid-2) {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

:deep(.radio-container.radio-grid-4),
:deep(.radio-grid-4) {
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
}

:deep(.radio-container.radio-grid-stacked),
:deep(.radio-grid-stacked) {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
}

:deep(.radio-column) {
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(label.radio-content) {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  min-height: 46px !important;
  padding: 10px 14px !important;
  border: 1.5px solid var(--g-kit-black-20, #e2e8f0) !important;
  background-color: var(--g-kit-white, #ffffff) !important;
  border-radius: 10px !important;
  cursor: pointer !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  box-shadow: none !important;
  transition: border-color 0.15s ease, background-color 0.15s ease !important;
}

:deep(label.radio-content:hover) {
  border-color: var(--g-kit-lime-30, #66ca80) !important;
  background-color: #fafffb !important;
}

:deep(label.radio-content:has(input:checked)),
:deep(label.radio-content:has(.form-check-input:checked)) {
  border-color: var(--g-kit-lime-50, #00ab4e) !important;
  background-color: var(--g-kit-lime-10, #e6f6ea) !important;
  box-shadow: none !important;
}

:deep(.radio-content .form-check) {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
}

:deep(.radio-content .form-check-input) {
  margin: 0 !important;
  float: none !important;
  width: 18px !important;
  height: 18px !important;
  flex-shrink: 0 !important;
  cursor: pointer !important;
  accent-color: var(--g-kit-lime-50, #00ab4e);
  border-color: var(--g-kit-black-30, #d4d4d8);
}

:deep(.radio-content .form-check-input:checked) {
  background-color: var(--g-kit-lime-50, #00ab4e) !important;
  border-color: var(--g-kit-lime-50, #00ab4e) !important;
}

:deep(.radio-content label.form-check-label) {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  font-size: var(--g-kit-font-size-sigma) !important;
  line-height: var(--g-kit-line-height-sigma) !important;
  font-weight: var(--g-kit-font-weight-normal) !important;
  color: var(--g-kit-black-80, #252528) !important;
  cursor: pointer !important;
  flex-grow: 1 !important;
  text-align: left !important;
}

:deep(label.radio-content:has(input:checked) label.form-check-label) {
  color: var(--g-kit-broccoli-60, #003e36) !important;
  font-weight: var(--g-kit-font-weight-bold) !important;
}

/* Rating Bintang Interaktif */
.star-rating-box {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 4px 0;
}

.star-row {
  display: flex;
  gap: 6px;
}

.star-click-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.star-svg {
  width: 28px;
  height: 28px;
  color: var(--g-kit-black-30, #d4d4d8);
  transition: color 0.15s ease;
}

.star-click-btn.is-active .star-svg {
  color: #f59e0b;
}

/* Profil Grid */
.profile-compact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-bottom: 20px;
}

.field-item {
  display: flex;
  flex-direction: column;
}

.field-item.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: block;
  font-size: var(--g-kit-font-size-omicron);
  line-height: var(--g-kit-line-height-omicron);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
  margin-bottom: 8px;
}

/* Catatan Privasi & Keamanan */
.privacy-alert-box {
  margin-top: 8px;
  margin-bottom: 12px;
}

.privacy-note-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: var(--g-kit-lime-10, #e6f6ea);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  border-radius: 12px;
  box-shadow: none;
}

.privacy-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--g-kit-broccoli-50, #004d43);
  box-shadow: none;
}

.privacy-svg {
  width: 20px;
  height: 20px;
}

.privacy-text {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-70, #3e3e40);
}

.privacy-text strong {
  color: var(--g-kit-broccoli-60, #003e36);
  font-weight: var(--g-kit-font-weight-bold);
}

/* Animasi Fade */
.animate-fade {
  animation: fadeIn 0.2s ease-out;
}

/* Text Area */
:deep(textarea.form-control:focus) {
  box-shadow: none !important;
  outline: none !important;
  outline-offset: 0 !important;
  border-color: var(--g-kit-lime-50, #00ab4e) !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .floating-feedback-btn {
    bottom: 20px;
    right: 20px;
    padding: 8px 14px 8px 10px;
  }

  .fb-modal-header {
    padding-bottom: 16px;
  }

  .fb-modal-body {
    padding: 16px;
  }

  .handoff-main-layout {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .handoff-actions-row {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .btn-store-badge {
    width: 100%;
    justify-content: center;
  }

  .success-takeaway-grid {
    grid-template-columns: 1fr;
  }

  /* Stepper Tetap Horizontal pada Tampilan Responsif / Mobile */
  .stepper-track {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    position: relative;
    gap: 4px;
  }

  .stepper-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    min-width: 0;
    gap: 6px;
    z-index: 2;
  }

  .stepper-indicator {
    width: 28px;
    height: 28px;
    font-size: var(--g-kit-font-size-atom, 12px);
    flex-shrink: 0;
  }

  .stepper-connector {
    display: block;
    flex: 1;
    height: 2px;
    margin-top: 13px;
    min-width: 8px;
    margin-left: -4px;
    margin-right: -4px;
    z-index: 1;
  }

  .stepper-label-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .stepper-step-number {
    font-size: 10px;
    line-height: 1.2;
    text-align: center;
    display: block;
  }

  .stepper-step-title {
    font-size: 11px;
    line-height: 1.25;
    text-align: center;
    word-break: normal;
  }

  .profile-compact-grid {
    grid-template-columns: 1fr;
  }

  /* Pada tampilan mobile / responsif:
     Jika pilihan 3 atau lebih (radio-grid-3, radio-grid-4), tampilkan 1 baris satu (1 kolom penuh)
     agar teks tidak terhimpit dan ramah sentuhan */
  :deep(.radio-container.radio-grid-3),
  :deep(.radio-grid-3.radio-container),
  :deep(.radio-grid-3),
  :deep(.radio-grid-3 .radio-container),
  :deep(.radio-container.radio-grid-4),
  :deep(.radio-grid-4.radio-container),
  :deep(.radio-grid-4),
  :deep(.radio-grid-4 .radio-container) {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  /* Pilihan 2 opsi tetap 2 kolom seimbang */
  :deep(.radio-container.radio-grid-2),
  :deep(.radio-grid-2.radio-container),
  :deep(.radio-grid-2),
  :deep(.radio-grid-2 .radio-container) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px !important;
  }
}
</style>
