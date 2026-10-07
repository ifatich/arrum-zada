<script setup lang="ts">
/**
 * @file ArrumJangkaWaktuCard.vue
 * @description Komponen formulir langkah 2 untuk memilih jangka waktu perencanaan menabung emas.
 * Menggunakan InputNominalEnd Kitvue, tombol chips cepat (5, 10, 15, 20, 25 tahun),
 * dan informasi transparansi asumsi pertumbuhan harga emas historis 7% per tahun.
 */
import { ref } from 'vue'
import { InputNominalEnd } from '@/components'
import { normalizeTahunInput } from '@/utils/normalizeInput'
import { useNumericKeyboard } from '@/composables/useNumericKeyboard'
import { useFormAriaWorkaround } from '@/composables/useFormAriaWorkaround'

/** Interface props untuk jangka waktu perencanaan */
export interface ArrumJangkaWaktuCardProps {
  /** Nilai string jangka waktu dalam tahun (v-model:waktuInvestasi) */
  waktuInvestasi: string
  /** Nilai numerik tahun investasi terhitung */
  tahunInvestasi: number
  /** Daftar pilihan chip tahun cepat */
  quickYearChips: readonly number[]
}

/** Interface events emit */
export interface ArrumJangkaWaktuCardEmits {
  (e: 'update:waktuInvestasi', value: string): void
  (e: 'selectYear', year: number): void
}

const props = defineProps<ArrumJangkaWaktuCardProps>()
const emit = defineEmits<ArrumJangkaWaktuCardEmits>()

const formContainerRef = ref<HTMLElement | null>(null)
const { handleInteraction } = useNumericKeyboard(formContainerRef)

/** Pesan bantu jika input mengandung pemisah desimal yang dipotong atau melebihi 30 tahun */
const tahunHelperText = ref<string>('')
/** Flag penanda jika karakter desimal (. atau ,) baru saja ditekan */
const hasEnteredDecimal = ref<boolean>(false)

// TODO: Workaround imperatif ini dihapus saat Kitvue diperbaiki (dukungan prop aria-* bawaan pada InputNominalEnd).
useFormAriaWorkaround(
  formContainerRef,
  [
    {
      inputId: 'sim-tahun',
      labelId: 'label-sim-tahun',
      labelText: 'Lama Mengumpulkan Emas',
      describedByIds: ['helper-sim-tahun'],
    },
  ],
  tahunHelperText
)

/**
 * Evaluasi teks pesan bantu untuk tahun
 */
const evaluateHelperText = (value: string, hadDecimal: boolean, rawCurrent: string): void => {
  const num = parseInt(value, 10)
  if (num > 30) {
    tahunHelperText.value = 'Maksimal 30 tahun'
  } else if (hadDecimal || rawCurrent.includes('.') || rawCurrent.includes(',')) {
    tahunHelperText.value = 'Isi dengan bilangan bulat (tahun)'
  } else {
    tahunHelperText.value = ''
  }
}

/**
 * Mencegah pemblokiran shortcut keyboard (Ctrl/Cmd+V, dll) di fase capture
 * serta mencegah pengetikan langsung desimal (. atau ,) dan angka pecahan berikutnya.
 * Mereset flag desimal jika seluruh teks dipilih atau ada seleksi aktif.
 */
const handleKeydownCapture = (e: KeyboardEvent): void => {
  const target = e.target as HTMLInputElement | null

  if (e.ctrlKey || e.metaKey) {
    e.stopPropagation()
    return
  }

  // Jika teks sedang terseleksi (misal Ctrl/Cmd+A atau seleksi kursor):
  // Pengetikan karakter apapun mengganti isi seleksi, sehingga desimal harus di-reset
  const hasSelection =
    target &&
    target.selectionStart !== null &&
    target.selectionEnd !== null &&
    target.selectionStart !== target.selectionEnd

  if (hasSelection) {
    hasEnteredDecimal.value = false
    tahunHelperText.value = ''
  }

  if (e.key === 'Backspace' || e.key === 'Delete') {
    hasEnteredDecimal.value = false
    tahunHelperText.value = ''
    return
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
    e.stopPropagation()
    return
  }

  if (e.key === '.' || e.key === ',' || e.key === 'Decimal') {
    e.preventDefault()
    e.stopPropagation()
    hasEnteredDecimal.value = true
    tahunHelperText.value = 'Isi dengan bilangan bulat (tahun)'
    return
  }

  // Jika sebelumnya sudah menekan pemisah desimal, abaikan ketikan angka pecahan berikutnya
  if (hasEnteredDecimal.value && /^\d$/.test(e.key)) {
    e.preventDefault()
    e.stopPropagation()
    tahunHelperText.value = 'Isi dengan bilangan bulat (tahun)'
    return
  }
}

/**
 * Tangkap beforeinput untuk menangani mobile virtual keyboard / IME (keyCode 229)
 * yang mengetik titik atau koma atau pecahan desimal sebelum dimasukkan ke dalam elemen input
 */
const handleBeforeInputCapture = (e: Event): void => {
  const inputEvent = e as InputEvent
  if (inputEvent.inputType === 'deleteContentBackward' || inputEvent.inputType === 'deleteContentForward') {
    hasEnteredDecimal.value = false
    tahunHelperText.value = ''
    return
  }

  const data = inputEvent.data
  if (!data) return

  // Kasus 1: Input berupa atau mengandung pemisah desimal (. atau ,)
  if (data.includes('.') || data.includes(',')) {
    inputEvent.preventDefault()
    inputEvent.stopPropagation()
    hasEnteredDecimal.value = true
    tahunHelperText.value = 'Isi dengan bilangan bulat (tahun)'

    // Jika data berupa potongan teks lengkap (misal "10.5" atau "10,5" dari IME / autokomplit)
    const target = inputEvent.target as HTMLInputElement | null
    if (target) {
      let nextRaw = data
      if (target.selectionStart !== null && target.selectionEnd !== null) {
        const current = target.value
        nextRaw = current.slice(0, target.selectionStart) + data + current.slice(target.selectionEnd)
      }
      const { value, hadDecimal } = normalizeTahunInput(nextRaw)
      evaluateHelperText(value, hadDecimal, nextRaw)
      target.value = value
      emit('update:waktuInvestasi', value)
    }
    return
  }

  // Kasus 2: Sedang dalam mode pecahan desimal (setelah menekan . atau ,), cegah angka pecahan berikutnya
  if (hasEnteredDecimal.value) {
    inputEvent.preventDefault()
    inputEvent.stopPropagation()
    tahunHelperText.value = 'Isi dengan bilangan bulat (tahun)'
    return
  }
}

/**
 * Reset flag desimal saat blur (focusout) dan verifikasi batas maksimal tahun
 */
const handleBlur = (): void => {
  hasEnteredDecimal.value = false
  const inputEl = document.getElementById('sim-tahun') as HTMLInputElement | null
  const num = parseInt(inputEl?.value || props.waktuInvestasi || '', 10)
  if (num > 30) {
    tahunHelperText.value = 'Maksimal 30 tahun'
  } else {
    tahunHelperText.value = ''
  }
}

/**
 * Tangkap paste pada fase capture dengan memperhitungkan seleksi teks atau posisi kursor
 */
const handlePasteCapture = (e: ClipboardEvent): void => {
  const text = e.clipboardData?.getData('text')
  if (text !== undefined && text !== null) {
    e.preventDefault()
    hasEnteredDecimal.value = false
    const target = e.target as HTMLInputElement | null
    let nextRaw = text
    if (target && target.selectionStart !== null && target.selectionEnd !== null) {
      const current = target.value
      const start = target.selectionStart
      const end = target.selectionEnd
      nextRaw = current.slice(0, start) + text + current.slice(end)
    }
    const { value, hadDecimal } = normalizeTahunInput(nextRaw)
    evaluateHelperText(value, hadDecimal, nextRaw)
    if (target) {
      target.value = value
    }
    emit('update:waktuInvestasi', value)
  }
}

/**
 * Tangkap drop pada fase capture
 */
const handleDropCapture = (e: DragEvent): void => {
  const text = e.dataTransfer?.getData('text')
  if (text !== undefined && text !== null) {
    e.preventDefault()
    hasEnteredDecimal.value = false
    const { value, hadDecimal } = normalizeTahunInput(text)
    evaluateHelperText(value, hadDecimal, text)
    emit('update:waktuInvestasi', value)
  }
}

/**
 * Normalisasi saat update dari input
 */
const handleUpdate = (val: string): void => {
  const inputEl = document.getElementById('sim-tahun') as HTMLInputElement | null
  const rawCurrent = inputEl?.value || val
  const { value, hadDecimal } = normalizeTahunInput(rawCurrent)
  evaluateHelperText(value, hadDecimal, rawCurrent)
  if (!val) {
    hasEnteredDecimal.value = false
  }
  emit('update:waktuInvestasi', value)
}

const onSelectChip = (year: number): void => {
  hasEnteredDecimal.value = false
  tahunHelperText.value = ''
  emit('selectYear', year)
}
</script>

<template>
  <section class="card-box" aria-labelledby="heading-jangka-waktu">
    <!-- Header Card Langkah 2 -->
    <div class="card-header-bar">
      <div class="step-badge" aria-hidden="true">2</div>
      <div>
        <h2 id="heading-jangka-waktu" class="card-heading">Jangka Waktu Perencanaan</h2>
        <p class="card-desc">
          Berapa lama nasabah berencana mengumpulkan emas hingga waktu keberangkatan. Tenor cicilan sama dengan lama menabung hingga waktu emas dicairkan atau dijual.
        </p>
      </div>
    </div>

    <div
      ref="formContainerRef"
      class="form-vertical-stack"
      @focusin.capture="handleInteraction"
      @pointerdown.capture="handleInteraction"
      @touchstart.capture="handleInteraction"
    >
      <!-- Input Durasi dengan Unit 'tahun' -->
      <div
        class="field-container"
        @keydown.capture="handleKeydownCapture"
        @beforeinput.capture="handleBeforeInputCapture"
        @paste.capture="handlePasteCapture"
        @drop.capture="handleDropCapture"
        @focusout="handleBlur"
      >
        <InputNominalEnd
          id="sim-tahun"
          title="Lama Mengumpulkan Emas"
          unit="tahun"
          placeholder="10"
          delimeter="none"
          inputmode="numeric"
          pattern="[0-9]*"
          :model-value="waktuInvestasi"
          @update:model-value="handleUpdate"
          @blur="handleBlur"
        />
        <div v-if="tahunHelperText" id="helper-sim-tahun" class="tahun-helper-note" role="status">
          {{ tahunHelperText }}
        </div>
      </div>

      <!-- Pilihan Cepat Tahun (Chips) -->
      <div class="chips-container" role="group" aria-label="Pilihan Cepat Tahun">
        <button
          v-for="year in quickYearChips"
          :key="year"
          type="button"
          class="year-chip-btn"
          :class="{ active: tahunInvestasi === year }"
          :aria-pressed="tahunInvestasi === year"
          @click="onSelectChip(year)"
        >
          {{ year }} Tahun
        </button>
      </div>

      <!-- TODO: menunggu persetujuan kepatuhan/DPS: redaksi netral asumsi 7% per tahun tanpa klaim 10 tahun terakhir -->
      <!-- Keterangan Asumsi Laju Pertumbuhan Emas -->
      <div class="assumption-box">
        <div class="assumption-title">Asumsi Simulasi: 7% per Tahun</div>
        <p class="assumption-desc">
          Asumsi simulasi 7% per tahun, mengacu pada rata-rata kenaikan harga emas sejak 2000, bukan jaminan.
        </p>
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

.tahun-helper-note {
  font-size: var(--g-kit-font-size-atom, 12px);
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 4px 10px;
  margin-top: 4px;
  font-weight: 500;
}

.chips-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.year-chip-btn {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  min-height: 44px;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1.5px solid var(--g-kit-black-20, #e2e8f0);
  background: #ffffff;
  color: var(--g-kit-black-80, #334155);
  cursor: pointer;
  transition: all 0.15s ease;
}

.year-chip-btn:hover {
  border-color: var(--g-kit-broccoli-50, #0b4430);
  color: var(--g-kit-broccoli-50, #0b4430);
}

.year-chip-btn:focus-visible {
  outline: 2px solid var(--g-kit-broccoli-50, #0b4430);
  outline-offset: 2px;
}

.year-chip-btn.active {
  background: var(--g-kit-broccoli-50, #0b4430);
  color: #ffffff;
  border-color: var(--g-kit-broccoli-50, #0b4430);
}

.assumption-box {
  background: #faf2dc;
  border: 1px dashed #9a7416;
  border-radius: 12px;
  padding: 14px 16px;
}

.assumption-title {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: #9a7416;
  margin-bottom: 4px;
}

.assumption-desc {
  margin: 0;
  font-size: var(--g-kit-font-size-omega);
  line-height: 1.55;
  color: #78350f;
}

@media (max-width: 640px) {
  .card-box {
    padding: 16px;
    border-radius: 14px;
  }

  .chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .year-chip-btn {
    flex: 1 1 calc(33.333% - 8px);
    min-width: 75px;
    min-height: 44px;
    padding: 8px 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: var(--g-kit-font-size-omega);
    line-height: var(--g-kit-line-height-omega);
  }

  .assumption-box {
    padding: 12px 14px;
  }
}
</style>
