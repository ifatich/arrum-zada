<script setup lang="ts">
/**
 * @file WawasanFinansialHaji.vue
 * @description Modul Wawasan Finansial & Edukasi Strategis Haji (Emas vs Uang & Data Historis 10 Tahun).
 * Menghadirkan desain lapang, bernapas, modern, dan sangat mudah dipahami:
 * 1. Segmented tab switcher interaktif ("Komparasi Emas vs Uang" & "Data Historis (10 Tahun)")
 * 2. Tab 1: Kartu perbandingan komparatif dengan gradien halus, mikro-indikator, dan poin bernapas
 * 3. Tab 2: Visualisasi grafik historis kurva spline mulus, interaktif dengan radar beacon & hovering tooltip
 */
import { ref, computed } from 'vue'

const activeTab = ref<'komparasi' | 'grafik'>('komparasi')
const baseUrl = import.meta.env.BASE_URL

interface ChartPoint {
  year: number
  value: string
  subtext?: string
  x: number
  y: number
  isStart?: boolean
  isPeak?: boolean
  isCurrent?: boolean
  badge?: string
}

// Data Historis BPIH Kemenag (2016 - 2025)
const bpihPoints: ChartPoint[] = [
  { year: 2016, value: 'Rp 60,0 Jt', subtext: 'Biaya BPIH 2016', x: 50, y: 155, isStart: true },
  { year: 2017, value: 'Rp 61,0 Jt', subtext: 'Biaya BPIH 2017', x: 105, y: 150 },
  { year: 2018, value: 'Rp 69,5 Jt', subtext: 'Biaya BPIH 2018', x: 165, y: 133 },
  { year: 2019, value: 'Rp 70,0 Jt', subtext: 'Biaya BPIH 2019', x: 225, y: 132 },
  { year: 2022, value: 'Rp 97,8 Jt', subtext: 'Puncak Biaya BPIH', x: 295, y: 60, isPeak: true, badge: 'Puncak: Rp 97,8 Jt' },
  { year: 2023, value: 'Rp 90,0 Jt', subtext: 'Biaya BPIH 2023', x: 355, y: 80 },
  { year: 2024, value: 'Rp 93,4 Jt', subtext: 'Biaya BPIH 2024', x: 415, y: 72 },
  { year: 2025, value: 'Rp 89,4 Jt', subtext: 'Penetapan Terkini', x: 485, y: 82, isCurrent: true, badge: 'Terkini: Rp 89,4 Jt' },
]

// Data Historis Harga Emas Galeri 24 (2016 - 2025)
const goldPoints: ChartPoint[] = [
  { year: 2016, value: 'Rp 489 rb/gr', subtext: 'Harga Emas 2016', x: 50, y: 172, isStart: true },
  { year: 2017, value: 'Rp 530 rb/gr', subtext: 'Harga Emas 2017', x: 95, y: 168 },
  { year: 2018, value: 'Rp 550 rb/gr', subtext: 'Harga Emas 2018', x: 140, y: 167 },
  { year: 2019, value: 'Rp 680 rb/gr', subtext: 'Harga Emas 2019', x: 185, y: 160 },
  { year: 2020, value: 'Rp 851 rb/gr', subtext: 'Akselerasi Emas', x: 235, y: 142, badge: 'Akselerasi' },
  { year: 2021, value: 'Rp 840 rb/gr', subtext: 'Harga Emas 2021', x: 285, y: 144 },
  { year: 2022, value: 'Rp 860 rb/gr', subtext: 'Harga Emas 2022', x: 335, y: 141 },
  { year: 2023, value: 'Rp 920 rb/gr', subtext: 'Harga Emas 2023', x: 385, y: 134 },
  { year: 2024, value: 'Rp 1,21 jt/gr', subtext: 'Harga Emas 2024', x: 435, y: 106 },
  { year: 2025, value: 'Rp 1,99 jt/gr', subtext: 'Rekor Tertinggi (+308%)', x: 485, y: 47, isPeak: true, isCurrent: true, badge: 'Rekor: Rp 1,99 Jt/gr' },
]

/**
 * Algoritma Monotone Cubic Spline (Fritsch-Carlson)
 * Menghasilkan kurva grafik yang mengalir mulus, elegan, dan bebas patahan tajam tanpa overshoot.
 */
function computeMonotoneSpline(points: ChartPoint[], baselineY = 185) {
  const n = points.length
  if (n === 0) return { path: '', area: '' }
  if (n === 1) return { path: `M ${points[0].x},${points[0].y}`, area: '' }

  const dx: number[] = []
  const dy: number[] = []
  const m: number[] = []
  for (let i = 0; i < n - 1; i++) {
    const deltaX = points[i + 1].x - points[i].x
    const deltaY = points[i + 1].y - points[i].y
    dx.push(deltaX)
    dy.push(deltaY)
    m.push(deltaY / deltaX)
  }

  const tangents: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1] * m[i] <= 0) {
      tangents.push(0)
    } else {
      tangents.push((m[i - 1] + m[i]) / 2)
    }
  }
  tangents.push(m[m.length - 1])

  let path = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < n - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const h = dx[i]
    const cp1x = Number((p1.x + h / 3).toFixed(1))
    const cp1y = Number((p1.y + tangents[i] * (h / 3)).toFixed(1))
    const cp2x = Number((p2.x - h / 3).toFixed(1))
    const cp2y = Number((p2.y - tangents[i + 1] * (h / 3)).toFixed(1))

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }

  const lastX = points[n - 1].x
  const firstX = points[0].x
  const area = `${path} L ${lastX},${baselineY} L ${firstX},${baselineY} Z`

  return { path, area }
}

const bpihSpline = computed(() => computeMonotoneSpline(bpihPoints, 185))
const goldSpline = computed(() => computeMonotoneSpline(goldPoints, 185))

const hoveredBpihIndex = ref<number | null>(null)
const hoveredGoldIndex = ref<number | null>(null)

const activeBpihPoint = computed<ChartPoint | null>(() => {
  if (hoveredBpihIndex.value !== null && bpihPoints[hoveredBpihIndex.value]) {
    return bpihPoints[hoveredBpihIndex.value]
  }
  return null
})

const activeGoldPoint = computed<ChartPoint | null>(() => {
  if (hoveredGoldIndex.value !== null && goldPoints[hoveredGoldIndex.value]) {
    return goldPoints[hoveredGoldIndex.value]
  }
  return null
})

function getTooltipX(x: number, boxWidth = 114, svgWidth = 520): number {
  const half = boxWidth / 2
  return Math.min(Math.max(x, half + 8), svgWidth - half - 8)
}

function getTooltipY(y: number, boxHeight = 40): number {
  if (y < 70) {
    return y + boxHeight + 8
  }
  return y - 20
}
</script>

<template>
  <section id="wawasan-section" class="wawasan-container" aria-labelledby="heading-wawasan">
    <!-- Header Section yang Lapang & Terstruktur -->
    <div class="wawasan-header">
      <div class="header-left">
        <span class="eyebrow-pill">Wawasan &amp; Edukasi</span>
        <h2 id="heading-wawasan" class="wawasan-title">Pahami Nilai Strategis Emas untuk Haji</h2>
        <p class="wawasan-desc">
          Perbandingan nyata antara menabung rupiah versus emas fisik, didukung pembuktian data pergerakan riil 10 tahun terakhir.
        </p>
      </div>

      <!-- Segmented Tab Switcher (Sesuai Struktur Pilihan User) -->
      <div class="tab-switcher" role="tablist" aria-label="Pilihan Wawasan Finansial">
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'komparasi'"
          :class="['tab-btn', { active: activeTab === 'komparasi' }]"
          @click="activeTab = 'komparasi'"
        >
          Komparasi Emas vs Uang
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'grafik'"
          :class="['tab-btn', { active: activeTab === 'grafik' }]"
          @click="activeTab = 'grafik'"
        >
          Data Historis (10 Tahun)
        </button>
      </div>
    </div>

    <!-- Konten Tab 1: Komparasi Emas vs Uang Tunai (Dual Card Showcase dengan VS Bridge & Card Indikator Interaktif) -->
    <div v-if="activeTab === 'komparasi'" class="tab-panel animate-fade" role="tabpanel">
      <div class="compare-showcase">
        <!-- Kolom Kiri: Menabung Emas Fisik (Hero Card) -->
        <div class="compare-card card-gold-hero">
          <div class="card-head">
            <div class="head-badge-row">
              <span class="pill-badge badge-hero">
                <svg class="badge-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Rekomendasi Utama
              </span>
              <span class="hero-tag-glow">Lindung Nilai #1</span>
            </div>
            <h3 class="card-title">Menabung Emas Fisik</h3>
            <p class="card-desc">Instrumen lindung nilai jangka panjang untuk menjaga daya beli ibadah haji Anda.</p>
          </div>

          <div class="compare-points-list">
            <div class="point-item-card point-gold">
              <div class="point-icon-box box-gold" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="point-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div class="point-content">
                <strong class="point-title">Target Satuan Gram</strong>
                <p class="point-desc">Nilai gramasi kebal pelemahan rupiah seiring waktu</p>
              </div>
            </div>

            <div class="point-item-card point-gold">
              <div class="point-icon-box box-gold" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="point-svg">
                  <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div class="point-content">
                <strong class="point-title">Melampaui Inflasi Haji</strong>
                <p class="point-desc">Kenaikan harga emas mengimbangi lonjakan biaya BPIH</p>
              </div>
            </div>

            <div class="point-item-card point-gold">
              <div class="point-icon-box box-gold" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="point-svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 17l10 5 10-5" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div class="point-content">
                <strong class="point-title">Akumulasi Fleksibel</strong>
                <p class="point-desc">Dapat dicicil per gram lewat ekosistem resmi Pegadaian</p>
              </div>
            </div>
          </div>

          <!-- Bottom Outcome Banner -->
          <div class="card-outcome outcome-green">
            <div class="outcome-icon-wrap icon-wrap-shield" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="outcome-svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div class="outcome-content">
              <strong>Hasil Terjamin:</strong> Daya beli terjaga penuh, bebas cemas kenaikan biaya tiket &amp; hotel.
            </div>
          </div>
        </div>

        <!-- Divider VS Bridge Tengah -->
        <div class="vs-bridge" aria-hidden="true">
          <div class="vs-line"></div>
          <div class="vs-circle">VS</div>
          <div class="vs-line"></div>
        </div>

        <!-- Kolom Kanan: Menabung Uang Tunai (Metode Konvensional) -->
        <div class="compare-card card-cash-muted">
          <div class="card-head">
            <div class="head-badge-row">
              <span class="pill-badge badge-neutral">Metode Konvensional</span>
            </div>
            <h3 class="card-title">Menabung Uang Tunai</h3>
            <p class="card-desc">Target angka nominal statis dalam Rupiah yang rentan terhadap laju inflasi.</p>
          </div>

          <div class="compare-points-list">
            <div class="point-item-card point-cash">
              <div class="point-icon-box box-cash" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="point-svg">
                  <circle cx="12" cy="12" r="10" stroke-width="2" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
              </div>
              <div class="point-content">
                <strong class="point-title">Target Nominal Statis</strong>
                <p class="point-desc">Nominal yang ditargetkan berisiko kurang di masa depan</p>
              </div>
            </div>

            <div class="point-item-card point-cash">
              <div class="point-icon-box box-cash" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="point-svg">
                  <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="22 17 13.5 8.5 8.5 13.5 2 7" />
                  <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="16 17 22 17 22 11" />
                </svg>
              </div>
              <div class="point-content">
                <strong class="point-title">Rentan Erosi Inflasi</strong>
                <p class="point-desc">Daya beli menyusut oleh lonjakan tiket penerbangan &amp; hotel</p>
              </div>
            </div>

            <div class="point-item-card point-cash">
              <div class="point-icon-box box-cash" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="point-svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke-width="2" />
                  <line x1="2" y1="10" x2="22" y2="10" stroke-width="2" />
                  <circle cx="16" cy="14" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div class="point-content">
                <strong class="point-title">Perlu Setoran Tombokan</strong>
                <p class="point-desc">Kerap membutuhkan dana darurat saat penetapan biaya pelunasan</p>
              </div>
            </div>
          </div>

          <!-- Bottom Outcome Banner -->
          <div class="card-outcome outcome-warning">
            <div class="outcome-icon-wrap icon-wrap-alert" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="outcome-svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="outcome-content">
              <strong>Risiko Finansial:</strong> Rawan nombok dana tunai puluhan juta rupiah saat tahun pelunasan.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Konten Tab 2: Grafik Historis & Showcase Bukti Riil -->
    <div v-else-if="activeTab === 'grafik'" class="tab-panel animate-fade" role="tabpanel">
      <div class="charts-container-card">
        <!-- Grid 2 Grafik Historis dengan Area Glow -->
        <div class="charts-grid">
          <!-- Grafik 1: Kenaikan BPIH (Data Kemenag) -->
          <div class="chart-card chart-card-bpih">
            <div class="chart-header">
              <div>
                <span class="chart-kicker">Data Kementerian Agama</span>
                <h4 class="chart-title">Perkembangan Biaya Haji (BPIH)</h4>
              </div>
              <span class="trend-chip chip-neutral">+49% Tren 9 Tahun</span>
            </div>
            
            <div class="svg-container" @mouseleave="hoveredBpihIndex = null">
              <svg viewBox="0 0 520 220" preserveAspectRatio="xMidYMid meet" class="chart-svg">
                <defs>
                  <linearGradient id="bpihAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#087443" stop-opacity="0.32" />
                    <stop offset="50%" stop-color="#087443" stop-opacity="0.10" />
                    <stop offset="100%" stop-color="#087443" stop-opacity="0.0" />
                  </linearGradient>

                  <filter id="bpihGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#087443" flood-opacity="0.25" />
                  </filter>
                </defs>

                <!-- Panduan Garis Grid Horizontal -->
                <g class="chart-grid-lines">
                  <line x1="45" y1="85" x2="495" y2="85" stroke="#edf3ef" stroke-dasharray="4,4" />
                  <text x="36" y="89" class="grid-val-label" text-anchor="end">100 Jt</text>

                  <line x1="45" y1="135" x2="495" y2="135" stroke="#edf3ef" stroke-dasharray="4,4" />
                  <text x="36" y="139" class="grid-val-label" text-anchor="end">70 Jt</text>

                  <line x1="45" y1="185" x2="495" y2="185" stroke="#e2ece5" stroke-width="1.2" />
                  <text x="36" y="188" class="grid-val-label" text-anchor="end">50 Jt</text>
                </g>

                <!-- Area Fill Mulus Mengikuti Kurva Spline -->
                <path
                  :d="bpihSpline.area"
                  fill="url(#bpihAreaGrad)"
                  class="chart-area-path animate-area"
                />

                <!-- Garis Kurva Monotone Spline Halus -->
                <path
                  :d="bpihSpline.path"
                  fill="none"
                  stroke="#087443"
                  stroke-width="3.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="chart-curve-path path-bpih"
                  filter="url(#bpihGlow)"
                />

                <!-- Garis Crosshair Interaktif saat Hover -->
                <line
                  v-if="activeBpihPoint"
                  :x1="activeBpihPoint.x"
                  y1="40"
                  :x2="activeBpihPoint.x"
                  y2="185"
                  class="active-crosshair"
                  stroke="#087443"
                  stroke-width="1.5"
                  stroke-dasharray="3,3"
                  stroke-opacity="0.5"
                />

                <!-- Radar Beacon di Titik Puncak 2022 -->
                <g class="beacon-group">
                  <circle cx="295" cy="60" r="10" class="beacon-pulse beacon-green" />
                  <circle cx="295" cy="60" r="4.5" fill="#087443" stroke="#ffffff" stroke-width="2.5" />
                  <g v-if="hoveredBpihIndex !== 4" transform="translate(295, 36)" class="milestone-badge-group">
                    <rect x="-44" y="-10" width="88" height="18" rx="9" fill="#087443" />
                    <text x="0" y="2" text-anchor="middle" class="milestone-badge-text">Puncak: Rp 97,8 Jt</text>
                  </g>
                </g>

                <!-- Titik-Titik Data (Dots) dengan Hirarki -->
                <g class="chart-dots">
                  <template v-for="(p, idx) in bpihPoints" :key="p.year">
                    <circle
                      v-if="!p.isPeak"
                      :cx="p.x"
                      :cy="p.y"
                      :r="p.isStart || p.isCurrent ? 4.5 : 3"
                      :fill="hoveredBpihIndex === idx ? '#044e2b' : '#087443'"
                      stroke="#ffffff"
                      :stroke-width="hoveredBpihIndex === idx ? 3 : 2"
                      :class="['data-point-dot', { 'is-active': hoveredBpihIndex === idx }]"
                    />
                    <circle
                      v-if="hoveredBpihIndex === idx"
                      :cx="p.x"
                      :cy="p.y"
                      r="8.5"
                      fill="none"
                      stroke="#087443"
                      stroke-width="2"
                      opacity="0.3"
                    />
                    <circle
                      :cx="p.x"
                      :cy="p.y"
                      r="22"
                      fill="transparent"
                      class="interactive-hitbox"
                      @mouseenter="hoveredBpihIndex = idx"
                      @touchstart.passive="hoveredBpihIndex = idx"
                    />
                  </template>
                </g>

                <!-- Tooltip Interaktif Mengambang -->
                <g
                  v-if="activeBpihPoint"
                  class="floating-tooltip"
                  :transform="`translate(${getTooltipX(activeBpihPoint.x)}, ${getTooltipY(activeBpihPoint.y)})`"
                >
                  <rect
                    x="-55"
                    y="-22"
                    width="110"
                    height="38"
                    rx="8"
                    fill="#0f291e"
                    stroke="rgba(255, 255, 255, 0.15)"
                    stroke-width="1"
                    class="tooltip-box-shadow"
                  />
                  <text x="0" y="-8" text-anchor="middle" class="tooltip-year-text tooltip-year-green">
                    TAHUN {{ activeBpihPoint.year }}
                  </text>
                  <text x="0" y="8" text-anchor="middle" class="tooltip-value-text">
                    {{ activeBpihPoint.value }}
                  </text>
                </g>

                <!-- Label Sumbu X (Tahun) -->
                <g class="axis-labels">
                  <text
                    v-for="(p, idx) in bpihPoints"
                    :key="'label-' + p.year"
                    :x="p.x"
                    y="206"
                    text-anchor="middle"
                    :class="{ 'label-active': hoveredBpihIndex === idx }"
                  >
                    {{ p.year }}
                  </text>
                </g>
              </svg>
            </div>

            <!-- Milestone Steps Interaktif -->
            <div class="chart-milestones-track">
              <div
                class="milestone-step"
                :class="{ 'is-active': hoveredBpihIndex === 0 }"
                @mouseenter="hoveredBpihIndex = 0"
                @mouseleave="hoveredBpihIndex = null"
              >
                <span class="step-year">2016</span>
                <span class="step-value">Rp 60,0 Jt</span>
                <span class="step-tag">Awal Periode</span>
              </div>

              <div class="step-connector" aria-hidden="true">
                <span class="connector-arrow">&rarr;</span>
              </div>

              <div
                class="milestone-step step-highlight"
                :class="{ 'is-active': hoveredBpihIndex === 4 }"
                @mouseenter="hoveredBpihIndex = 4"
                @mouseleave="hoveredBpihIndex = null"
              >
                <span class="step-year">2022</span>
                <span class="step-value">Rp 97,8 Jt</span>
                <span class="step-tag tag-peak">Puncak Rekor</span>
              </div>

              <div class="step-connector" aria-hidden="true">
                <span class="connector-arrow">&rarr;</span>
              </div>

              <div
                class="milestone-step"
                :class="{ 'is-active': hoveredBpihIndex === 7 }"
                @mouseenter="hoveredBpihIndex = 7"
                @mouseleave="hoveredBpihIndex = null"
              >
                <span class="step-year">2025</span>
                <span class="step-value">Rp 89,4 Jt</span>
                <span class="step-tag">Penetapan Terkini</span>
              </div>
            </div>
          </div>

          <!-- Grafik 2: Kenaikan Harga Emas (Galeri 24) -->
          <div class="chart-card chart-card-gold">
            <div class="chart-header">
              <div>
                <span class="chart-kicker">Data Acuan Galeri 24</span>
                <h4 class="chart-title">Perkembangan Harga Emas Batangan</h4>
              </div>
              <span class="trend-chip chip-gold">+308% Meroket Signifikan</span>
            </div>
            
            <div class="svg-container" @mouseleave="hoveredGoldIndex = null">
              <svg viewBox="0 0 520 220" preserveAspectRatio="xMidYMid meet" class="chart-svg">
                <defs>
                  <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#d6a72c" stop-opacity="0.35" />
                    <stop offset="50%" stop-color="#eab308" stop-opacity="0.10" />
                    <stop offset="100%" stop-color="#d6a72c" stop-opacity="0.0" />
                  </linearGradient>

                  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#d6a72c" flood-opacity="0.32" />
                  </filter>
                </defs>

                <!-- Panduan Garis Grid Horizontal -->
                <g class="chart-grid-lines">
                  <line x1="45" y1="50" x2="495" y2="50" stroke="#f6f2ea" stroke-dasharray="4,4" />
                  <text x="36" y="54" class="grid-val-label label-gold" text-anchor="end">2,0 Jt</text>

                  <line x1="45" y1="110" x2="495" y2="110" stroke="#f6f2ea" stroke-dasharray="4,4" />
                  <text x="36" y="114" class="grid-val-label label-gold" text-anchor="end">1,0 Jt</text>

                  <line x1="45" y1="170" x2="495" y2="170" stroke="#f6f2ea" stroke-dasharray="4,4" />
                  <text x="36" y="174" class="grid-val-label label-gold" text-anchor="end">500 Rb</text>

                  <line x1="45" y1="185" x2="495" y2="185" stroke="#f0ebe0" stroke-width="1.2" />
                </g>

                <!-- Area Fill Mulus Mengikuti Kurva Spline Emas -->
                <path
                  :d="goldSpline.area"
                  fill="url(#goldAreaGrad)"
                  class="chart-area-path animate-area"
                />

                <!-- Garis Kurva Monotone Spline Halus -->
                <path
                  :d="goldSpline.path"
                  fill="none"
                  stroke="#d6a72c"
                  stroke-width="3.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="chart-curve-path path-gold"
                  filter="url(#goldGlow)"
                />

                <!-- Garis Crosshair Interaktif saat Hover -->
                <line
                  v-if="activeGoldPoint"
                  :x1="activeGoldPoint.x"
                  y1="35"
                  :x2="activeGoldPoint.x"
                  y2="185"
                  class="active-crosshair"
                  stroke="#d6a72c"
                  stroke-width="1.5"
                  stroke-dasharray="3,3"
                  stroke-opacity="0.6"
                />

                <!-- Radar Beacon di Titik Rekor 2025 -->
                <g class="beacon-group">
                  <circle cx="485" cy="47" r="11" class="beacon-pulse beacon-gold" />
                  <circle cx="485" cy="47" r="5" fill="#d6a72c" stroke="#ffffff" stroke-width="2.5" />
                  <g v-if="hoveredGoldIndex !== 9" transform="translate(425, 26)" class="milestone-badge-group">
                    <rect x="-48" y="-10" width="96" height="18" rx="9" fill="#d6a72c" />
                    <text x="0" y="2" text-anchor="middle" class="milestone-badge-text">Rekor: Rp 1,99 Jt/gr</text>
                  </g>
                </g>

                <!-- Titik-Titik Data (Dots) dengan Hirarki -->
                <g class="chart-dots">
                  <template v-for="(p, idx) in goldPoints" :key="p.year">
                    <circle
                      v-if="!p.isPeak"
                      :cx="p.x"
                      :cy="p.y"
                      :r="p.isStart || p.year === 2020 ? 4.5 : 3"
                      :fill="hoveredGoldIndex === idx ? '#b48316' : '#d6a72c'"
                      stroke="#ffffff"
                      :stroke-width="hoveredGoldIndex === idx ? 3 : 2"
                      :class="['data-point-dot', { 'is-active': hoveredGoldIndex === idx }]"
                    />
                    <circle
                      v-if="hoveredGoldIndex === idx"
                      :cx="p.x"
                      :cy="p.y"
                      r="8.5"
                      fill="none"
                      stroke="#d6a72c"
                      stroke-width="2"
                      opacity="0.35"
                    />
                    <circle
                      :cx="p.x"
                      :cy="p.y"
                      r="20"
                      fill="transparent"
                      class="interactive-hitbox"
                      @mouseenter="hoveredGoldIndex = idx"
                      @touchstart.passive="hoveredGoldIndex = idx"
                    />
                  </template>
                </g>

                <!-- Tooltip Interaktif Mengambang -->
                <g
                  v-if="activeGoldPoint"
                  class="floating-tooltip"
                  :transform="`translate(${getTooltipX(activeGoldPoint.x)}, ${getTooltipY(activeGoldPoint.y)})`"
                >
                  <rect
                    x="-56"
                    y="-22"
                    width="112"
                    height="38"
                    rx="8"
                    fill="#261b04"
                    stroke="rgba(253, 224, 71, 0.25)"
                    stroke-width="1"
                    class="tooltip-box-shadow"
                  />
                  <text x="0" y="-8" text-anchor="middle" class="tooltip-year-text tooltip-year-gold">
                    TAHUN {{ activeGoldPoint.year }}
                  </text>
                  <text x="0" y="8" text-anchor="middle" class="tooltip-value-text">
                    {{ activeGoldPoint.value }}
                  </text>
                </g>

                <!-- Label Sumbu X (Tahun) -->
                <g class="axis-labels">
                  <text
                    v-for="(p, idx) in goldPoints"
                    :key="'label-gold-' + p.year"
                    :x="p.x"
                    y="206"
                    text-anchor="middle"
                    :class="{ 'label-active': hoveredGoldIndex === idx }"
                  >
                    {{ p.year }}
                  </text>
                </g>
              </svg>
            </div>

            <!-- Milestone Steps Interaktif Emas -->
            <div class="chart-milestones-track">
              <div
                class="milestone-step step-gold"
                :class="{ 'is-active': hoveredGoldIndex === 0 }"
                @mouseenter="hoveredGoldIndex = 0"
                @mouseleave="hoveredGoldIndex = null"
              >
                <span class="step-year">2016</span>
                <span class="step-value">Rp 489 rb/gr</span>
                <span class="step-tag">Awal Periode</span>
              </div>

              <div class="step-connector" aria-hidden="true">
                <span class="connector-arrow">&rarr;</span>
              </div>

              <div
                class="milestone-step step-gold"
                :class="{ 'is-active': hoveredGoldIndex === 4 }"
                @mouseenter="hoveredGoldIndex = 4"
                @mouseleave="hoveredGoldIndex = null"
              >
                <span class="step-year">2020</span>
                <span class="step-value">Rp 851 rb/gr</span>
                <span class="step-tag tag-gold">Akselerasi Emas</span>
              </div>

              <div class="step-connector" aria-hidden="true">
                <span class="connector-arrow">&rarr;</span>
              </div>

              <div
                class="milestone-step step-gold step-highlight"
                :class="{ 'is-active': hoveredGoldIndex === 9 }"
                @mouseenter="hoveredGoldIndex = 9"
                @mouseleave="hoveredGoldIndex = null"
              >
                <span class="step-year">2025</span>
                <span class="step-value">Rp 1,99 jt/gr</span>
                <span class="step-tag tag-gold">Rekor Tertinggi</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Showcase Bukti Riil Lindung Nilai (Hedging Showcase dengan Background Sinematik) -->
        <div class="hedging-showcase">
          <!-- Background Image & Gradient Layer Sinematik (Konsep Banner) -->
          <div class="hedging-bg-layer" aria-hidden="true">
            <div
              class="hedging-bg-image"
              :style="{ backgroundImage: `url('${baseUrl}images/banner-kaaba-dawn.jpg')` }"
            ></div>
            <div class="hedging-gradient-mask"></div>
            <div class="hedging-ambient-glow"></div>
          </div>

          <div class="hedging-inner-content">
            <div class="showcase-top">
              <span class="showcase-badge">BUKTI RIIL LINDUNG NILAI (HEDGING)</span>
              <h3 class="showcase-title">Mengapa Menabung Gramasi Emas Mengalahkan Inflasi Biaya Haji?</h3>
              <p class="showcase-lead">
                Walaupun biaya haji dalam Rupiah naik +49%, kebutuhan fisik gramasi emas justru <strong>berkurang hingga 63%</strong> berkat kenaikan nilai emas batangan.
              </p>
            </div>

            <div class="showcase-grid">
              <!-- Kolom Tahun 2016 -->
              <div class="showcase-card card-year-past">
                <span class="year-chip">Tahun 2016</span>
                <div class="gram-number">122 Gram</div>
                <span class="gram-label">Dibutuhkan untuk Biaya BPIH</span>
                <div class="card-meta-list">
                  <div class="meta-row">
                    <span>Biaya BPIH:</span>
                    <strong>Rp 60,0 Juta</strong>
                  </div>
                  <div class="meta-row">
                    <span>Harga Emas:</span>
                    <strong>Rp 489.100 / gr</strong>
                  </div>
                </div>
              </div>

              <!-- Arrow Bridge Indicator -->
              <div class="bridge-indicator" aria-hidden="true">
                <div class="bridge-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="bridge-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                <span class="bridge-text">9 Tahun Berjalan</span>
              </div>

              <!-- Kolom Tahun 2025 -->
              <div class="showcase-card card-year-now">
                <span class="year-chip chip-active">Tahun 2025</span>
                <div class="gram-number number-highlight">Hanya 45 Gram!</div>
                <span class="gram-label text-green-bold">Dibutuhkan untuk Biaya BPIH</span>
                <div class="card-meta-list">
                  <div class="meta-row">
                    <span>Biaya BPIH:</span>
                    <strong>Rp 89,4 Juta (+49%)</strong>
                  </div>
                  <div class="meta-row">
                    <span>Harga Emas:</span>
                    <strong>Rp 1,99 Juta / gr (+308%)</strong>
                  </div>
                </div>
              </div>

              <!-- Kolom Hasil Efisiensi -->
              <div class="showcase-card card-efficiency">
                <div class="efficiency-badge">HASIL PROTEKSI ASSET</div>
                <div class="efficiency-percent">-63%</div>
                <p class="efficiency-summary">
                  Beban persiapan haji nasabah <strong>berhemat 77 gram emas</strong> berkat kekuatan lindung nilai emas fisik terhadap laju inflasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wawasan-container {
  margin-top: 48px;
  margin-bottom: 48px;
}

/* Header Section */
.wawasan-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.header-left {
  max-width: 640px;
}

.eyebrow-pill {
  display: inline-block;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--g-kit-broccoli-50, #004d43);
  margin-bottom: 6px;
}

.wawasan-title {
  margin: 0 0 8px;
  font-size: var(--g-kit-font-size-epsilon);
  line-height: var(--g-kit-line-height-epsilon);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
  letter-spacing: -0.02em;
}

.wawasan-desc {
  margin: 0;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-60, #58585b);
}

/* Segmented Tab Switcher */
.tab-switcher {
  display: inline-flex;
  background: var(--g-kit-broccoli-10, #e6edec);
  padding: 5px;
  border-radius: 12px;
  gap: 4px;
}

.tab-btn {
  border: none;
  background: transparent;
  padding: 10px 20px;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-60, #58585b);
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover:not(.active) {
  color: var(--g-kit-broccoli-50, #004d43);
}

.tab-btn.active {
  background: var(--g-kit-white, #ffffff);
  color: var(--g-kit-broccoli-50, #004d43);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Animasi Fade */
.animate-fade {
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* =========================================================================
   TAB 1: DUAL-CARD KOMPARASI SHOWCASE (LUWES, BERDIMENSI & PREMIUM)
   ========================================================================= */
.compare-showcase {
  background: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 24px;
  padding: 34px 36px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
  align-items: stretch;
}

.compare-card {
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Hero Gold/Emas Fisik Card */
.card-gold-hero {
  background: linear-gradient(180deg, var(--g-kit-lime-10, #e6f6ea) 0%, var(--g-kit-white, #ffffff) 100%);
  border: 1.5px solid var(--g-kit-lime-20, #99dcab);
  box-shadow: none;
  position: relative;
}

/* Conventional Cash Card */
.card-cash-muted {
  background: linear-gradient(180deg, var(--g-kit-black-10, #f8f8f8) 0%, var(--g-kit-white, #ffffff) 100%);
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  box-shadow: none;
}

.card-head {
  margin-bottom: 22px;
}

.head-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-hero {
  background: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-lime-80, #00662e);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
}

.badge-icon-svg {
  width: 13px;
  height: 13px;
}

.hero-tag-glow {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  padding: 3px 10px;
  border-radius: 9999px;
  background: var(--g-kit-yellow-10, #fff9ed);
  color: var(--g-kit-gold-90, #56482b);
  border: 1px solid var(--g-kit-gold-40, #e1c791);
  letter-spacing: 0.3px;
}

.badge-neutral {
  background: var(--g-kit-black-10, #f8f8f8);
  color: var(--g-kit-black-60, #58585b);
  border: 1px solid var(--g-kit-black-20, #eeeeef);
}

.card-title {
  margin: 0 0 6px;
  font-size: var(--g-kit-font-size-lambda);
  line-height: var(--g-kit-line-height-lambda);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
}

.card-desc {
  margin: 0;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-60, #58585b);
}

/* Compare Points List */
.compare-points-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  flex: 1;
}

.point-item-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--g-kit-white, #ffffff);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.point-gold {
  border: 1px solid var(--g-kit-broccoli-10, #e6edec);
}

.point-gold:hover {
  border-color: var(--g-kit-lime-20, #99dcab);
  background: var(--g-kit-lime-10, #e6f6ea);
}

.point-cash {
  border: 1px solid var(--g-kit-black-20, #eeeeef);
}

.point-cash:hover {
  border-color: var(--g-kit-black-40, #bbbdc0);
  background: var(--g-kit-black-10, #f8f8f8);
}

.point-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: transform 0.2s ease;
}

.point-item-card:hover .point-icon-box {
  transform: scale(1.08);
}

.box-gold {
  background: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-lime-80, #00662e);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
}

.box-cash {
  background: var(--g-kit-black-10, #f8f8f8);
  color: var(--g-kit-black-60, #58585b);
  border: 1px solid var(--g-kit-black-20, #eeeeef);
}

.point-svg {
  width: 18px;
  height: 18px;
}

.point-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.point-title {
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: var(--g-kit-black-80, #252528);
  font-weight: var(--g-kit-font-weight-bold);
}

.point-desc {
  margin: 0;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: var(--g-kit-black-60, #58585b);
}

/* Outcome Banners */
.card-outcome {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
}

.outcome-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.outcome-svg {
  width: 18px;
  height: 18px;
}

.icon-wrap-shield {
  color: var(--g-kit-lime-60, #00883e);
}

.icon-wrap-alert {
  color: var(--g-kit-orange-50, #e07e26);
}

.outcome-green {
  background: var(--g-kit-lime-10, #e6f6ea);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
  color: var(--g-kit-lime-90, #00441f);
}

.outcome-warning {
  background: var(--g-kit-orange-10, #fbf2e9);
  border: 1px solid var(--g-kit-orange-20, #f2cba8);
  color: var(--g-kit-orange-90, #59320f);
}

.outcome-content strong {
  font-weight: var(--g-kit-font-weight-bold);
}

/* VS Bridge */
.vs-bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 4px;
}

.vs-line {
  width: 1px;
  flex: 1;
  background: linear-gradient(180deg, rgba(238, 238, 239, 0.2) 0%, var(--g-kit-black-20, #eeeeef) 50%, rgba(238, 238, 239, 0.2) 100%);
}

.vs-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--g-kit-white, #ffffff);
  border: 1.5px solid var(--g-kit-black-20, #eeeeef);
  color: var(--g-kit-black-60, #58585b);
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  margin: 8px 0;
}

/* =========================================================================
   TAB 2: CHARTS & HEDGING SHOWCASE
   ========================================================================= */
.charts-container-card {
  background: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 20px;
  padding: 32px 30px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}

.chart-card {
  border-radius: 18px;
  padding: 24px;
}

.chart-card-bpih {
  background: linear-gradient(180deg, var(--g-kit-white, #ffffff) 0%, var(--g-kit-broccoli-10, #e6edec) 100%);
  border: 1px solid var(--g-kit-broccoli-20, #99b7b3);
  box-shadow: none;
}

.chart-card-gold {
  background: linear-gradient(180deg, var(--g-kit-white, #ffffff) 0%, var(--g-kit-gold-10, #fbf7f0) 100%);
  border: 1px solid var(--g-kit-gold-20, #efe1c4);
  box-shadow: none;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.chart-kicker {
  display: block;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-50, #939597);
  margin-bottom: 2px;
}

.chart-title {
  margin: 0;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
}

.trend-chip {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  padding: 4px 12px;
  border-radius: 9999px;
  white-space: nowrap;
}

.chip-neutral {
  background: var(--g-kit-lime-10, #e6f6ea);
  color: var(--g-kit-lime-80, #00662e);
  border: 1px solid var(--g-kit-lime-20, #99dcab);
}

.chip-gold {
  background: var(--g-kit-yellow-10, #fff9ed);
  color: var(--g-kit-gold-80, #816c41);
  border: 1px solid var(--g-kit-gold-20, #efe1c4);
}

.svg-container {
  width: 100%;
  aspect-ratio: 520 / 220;
  max-height: 220px;
  margin-bottom: 14px;
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Animasi Entrance Kurva Spline */
.chart-curve-path {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawCurve 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes drawCurve {
  to {
    stroke-dashoffset: 0;
  }
}

.animate-area {
  animation: fadeInArea 0.8s ease-out 0.25s forwards;
  opacity: 0;
}

@keyframes fadeInArea {
  to {
    opacity: 1;
  }
}

/* Grid & Reference Labels */
.grid-val-label {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-family: inherit;
  fill: var(--g-kit-black-50, #939597);
  font-weight: var(--g-kit-font-weight-normal);
}

.label-gold {
  fill: var(--g-kit-gold-60, #ac9057);
}

.axis-labels text {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  fill: var(--g-kit-black-60, #58585b);
  font-family: inherit;
  font-weight: var(--g-kit-font-weight-normal);
  transition: fill 0.2s ease, font-weight 0.2s ease;
}

.axis-labels text.label-active {
  fill: var(--g-kit-black-80, #252528);
  font-weight: var(--g-kit-font-weight-bold);
}

/* Beacon Pulse Animation */
.beacon-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: beaconPulse 2.4s ease-out infinite;
}

@keyframes beaconPulse {
  0% {
    r: 4px;
    opacity: 0.9;
  }
  70% {
    r: 13px;
    opacity: 0;
  }
  100% {
    r: 13px;
    opacity: 0;
  }
}

.beacon-green {
  fill: none;
  stroke: var(--g-kit-lime-50, #00ab4e);
  stroke-width: 2;
}

.beacon-gold {
  fill: none;
  stroke: var(--g-kit-gold-50, #d8b56d);
  stroke-width: 2;
}

.milestone-badge-group {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.14));
}

.milestone-badge-text {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  fill: var(--g-kit-white, #ffffff);
}

.tooltip-year-text {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-normal);
  letter-spacing: 0.5px;
}

.tooltip-year-green {
  fill: var(--g-kit-lime-20, #99dcab);
}

.tooltip-year-gold {
  fill: var(--g-kit-yellow-50, #ffc54f);
}

.tooltip-value-text {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-bold);
  fill: var(--g-kit-white, #ffffff);
}

/* Titik Data & Interaktivitas */
.interactive-hitbox {
  cursor: pointer;
}

.data-point-dot {
  transition: r 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), stroke-width 0.2s ease, fill 0.2s ease;
}

.data-point-dot.is-active {
  r: 5.5px;
}

.floating-tooltip {
  pointer-events: none;
  transition: transform 0.15s ease-out;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

/* Milestone Steps Track */
.chart-milestones-track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-broccoli-10, #e6edec);
  border-radius: 12px;
  box-shadow: none;
}

.milestone-step {
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: transparent;
}

.milestone-step:hover,
.milestone-step.is-active {
  background: var(--g-kit-broccoli-10, #e6edec);
  transform: translateY(-1px);
}

.milestone-step.step-gold:hover,
.milestone-step.step-gold.is-active {
  background: var(--g-kit-gold-10, #fbf7f0);
  transform: translateY(-1px);
}

.step-year {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-normal);
  color: var(--g-kit-black-50, #939597);
}

.step-value {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-black-80, #252528);
}

.step-tag {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: var(--g-kit-black-50, #939597);
  font-weight: var(--g-kit-font-weight-normal);
}

.step-tag.tag-peak {
  color: var(--g-kit-broccoli-50, #004d43);
  font-weight: var(--g-kit-font-weight-bold);
}

.step-tag.tag-gold {
  color: var(--g-kit-gold-80, #816c41);
  font-weight: var(--g-kit-font-weight-bold);
}

.step-connector {
  display: flex;
  align-items: center;
  color: var(--g-kit-black-40, #bbbdc0);
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
}

/* =========================================================================
   HEDGING SHOWCASE CARD (BUKTI RIIL DENGAN BACKGROUND SINEMATIK BANNER)
   ========================================================================= */
.hedging-showcase {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 38px 36px;
  color: var(--g-kit-white, #ffffff);
  box-shadow: 0 16px 40px rgba(0, 30, 26, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: var(--g-kit-broccoli-90, #001e1a);
}

.hedging-bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hedging-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
  filter: saturate(1.15) contrast(1.05);
  transform: scale(1.02);
  transition: transform 8s ease-out;
}

.hedging-showcase:hover .hedging-bg-image {
  transform: scale(1.05);
}

.hedging-gradient-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(0, 30, 26, 0.96) 0%,
    rgba(0, 46, 40, 0.90) 45%,
    rgba(0, 61, 53, 0.78) 75%,
    rgba(0, 46, 40, 0.62) 100%
  );
}

.hedging-ambient-glow {
  position: absolute;
  top: -30%;
  right: -10%;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 197, 79, 0.16) 0%, rgba(0, 171, 78, 0.08) 50%, transparent 70%);
  filter: blur(40px);
}

.hedging-inner-content {
  position: relative;
  z-index: 1;
}

.showcase-top {
  margin-bottom: 26px;
}

.showcase-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 1.2px;
  color: var(--g-kit-yellow-50, #ffc54f);
  margin-bottom: 12px;
}

.showcase-title {
  margin: 0 0 8px;
  font-size: var(--g-kit-font-size-delta);
  line-height: var(--g-kit-line-height-delta);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-white, #ffffff);
  letter-spacing: -0.015em;
}

.showcase-lead {
  margin: 0;
  font-size: var(--g-kit-font-size-sigma);
  line-height: var(--g-kit-line-height-sigma);
  color: rgba(255, 255, 255, 0.9);
  max-width: 740px;
}

.showcase-lead strong {
  color: var(--g-kit-yellow-50, #ffc54f);
}

.showcase-grid {
  display: grid;
  grid-template-columns: 1fr auto 1.15fr 1.1fr;
  gap: 16px;
  align-items: center;
}

.showcase-card {
  background: rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  box-shadow: none;
}

.showcase-card:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.35);
}

.card-year-now {
  background: rgba(255, 197, 79, 0.09);
  border: 1.5px solid rgba(255, 197, 79, 0.42);
}

.card-year-now:hover {
  background: rgba(255, 197, 79, 0.15);
  border-color: rgba(255, 197, 79, 0.65);
}

.year-chip {
  display: inline-block;
  align-self: flex-start;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  padding: 4px 11px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.14);
  color: var(--g-kit-white, #ffffff);
  margin-bottom: 10px;
}

.chip-active {
  background: var(--g-kit-yellow-50, #ffc54f);
  color: var(--g-kit-broccoli-90, #001e1a);
}

.gram-number {
  font-size: var(--g-kit-font-size-epsilon);
  line-height: var(--g-kit-line-height-epsilon);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-white, #ffffff);
  margin-bottom: 2px;
}

.number-highlight {
  color: var(--g-kit-yellow-50, #ffc54f);
}

.gram-label {
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 14px;
}

.text-green-bold {
  color: var(--g-kit-lime-20, #99dcab);
  font-weight: var(--g-kit-font-weight-bold);
}

.card-meta-list {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: rgba(255, 255, 255, 0.75);
}

.meta-row strong {
  color: var(--g-kit-white, #ffffff);
}

/* Bridge Indicator */
.bridge-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 4px;
}

.bridge-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.showcase-grid:hover .bridge-circle {
  transform: scale(1.1);
}

.bridge-svg {
  width: 16px;
  height: 16px;
  color: var(--g-kit-yellow-50, #ffc54f);
}

.bridge-text {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
}

/* Card Efficiency */
.card-efficiency {
  background: linear-gradient(135deg, rgba(255, 197, 79, 0.14) 0%, rgba(0, 171, 78, 0.10) 100%);
  border: 1.5px solid rgba(255, 197, 79, 0.45);
}

.card-efficiency:hover {
  background: linear-gradient(135deg, rgba(255, 197, 79, 0.18) 0%, rgba(0, 171, 78, 0.14) 100%);
  border-color: rgba(255, 197, 79, 0.65);
}

.efficiency-badge {
  font-size: var(--g-kit-font-size-atom);
  line-height: var(--g-kit-line-height-atom);
  font-weight: var(--g-kit-font-weight-bold);
  letter-spacing: 1px;
  color: var(--g-kit-yellow-50, #ffc54f);
  margin-bottom: 6px;
}

.efficiency-percent {
  font-size: var(--g-kit-font-size-zeta);
  line-height: var(--g-kit-line-height-zeta);
  font-weight: var(--g-kit-font-weight-bold);
  color: var(--g-kit-white, #ffffff);
  margin-bottom: 8px;
}

.efficiency-summary {
  margin: 0;
  font-size: var(--g-kit-font-size-omega);
  line-height: var(--g-kit-line-height-omega);
  color: rgba(255, 255, 255, 0.9);
}

.efficiency-summary strong {
  color: var(--g-kit-yellow-50, #ffc54f);
}

/* Responsivitas Menyeluruh */
@media (max-width: 960px) {
  .wawasan-container {
    margin-top: 36px;
    margin-bottom: 36px;
  }

  .wawasan-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    margin-bottom: 24px;
  }

  .compare-showcase {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 24px 20px;
  }

  .vs-bridge {
    flex-direction: row;
    padding: 8px 0;
  }

  .vs-line {
    width: auto;
    height: 1px;
    flex: 1;
    background: linear-gradient(90deg, rgba(226, 232, 240, 0.2) 0%, #cbd5e1 50%, rgba(226, 232, 240, 0.2) 100%);
  }

  .vs-circle {
    margin: 0 12px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  .charts-container-card {
    padding: 24px 20px;
  }

  .hedging-showcase {
    padding: 28px 24px;
  }

  .showcase-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .bridge-indicator {
    flex-direction: row;
    padding: 4px 0;
  }
}

@media (max-width: 640px) {
  .wawasan-container {
    margin-top: 28px;
    margin-bottom: 28px;
  }

  .wawasan-header {
    gap: 14px;
    margin-bottom: 18px;
  }

  .wawasan-title {
    font-size: var(--g-kit-font-size-lambda, 20px);
    line-height: var(--g-kit-line-height-lambda, 28px);
    margin-bottom: 6px;
  }

  .wawasan-desc {
    font-size: var(--g-kit-font-size-sigma, 14px);
    line-height: 20px;
  }

  /* Segmented Tab Switcher Responsif (Penuh 2 Kolom Seimbang) */
  .tab-switcher {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 4px;
    gap: 4px;
  }

  .tab-btn {
    padding: 8px 6px;
    font-size: var(--g-kit-font-size-atom, 12px);
    line-height: 1.3;
    text-align: center;
    white-space: normal;
  }

  /* Tab 1: Compare Showcase - Padding Proporsional Sesuai Section Lain (16px) */
  .compare-showcase {
    padding: 16px;
    border-radius: 16px;
    gap: 16px;
  }

  .compare-card {
    padding: 18px 14px;
    border-radius: 14px;
  }

  .card-head {
    margin-bottom: 16px;
  }

  .card-title {
    font-size: var(--g-kit-font-size-omicron, 16px);
    line-height: 22px;
    margin-bottom: 4px;
  }

  .card-desc {
    font-size: var(--g-kit-font-size-omega, 13px);
    line-height: 18px;
  }

  .compare-points-list {
    gap: 8px;
    margin-bottom: 16px;
  }

  .point-item-card {
    padding: 10px 12px;
    gap: 10px;
    border-radius: 10px;
  }

  .point-icon-box {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  .point-svg {
    width: 16px;
    height: 16px;
  }

  .point-title {
    font-size: var(--g-kit-font-size-omega, 13px);
    line-height: 17px;
  }

  .point-desc {
    font-size: var(--g-kit-font-size-atom, 11px);
    line-height: 15px;
  }

  .card-outcome {
    padding: 12px 14px;
    border-radius: 10px;
    font-size: var(--g-kit-font-size-omega, 12px);
    line-height: 17px;
  }

  /* Tab 2: Charts Container Card (Padding 16px Sesuai Section Lain) */
  .charts-container-card {
    padding: 16px;
    border-radius: 16px;
  }

  .charts-grid {
    gap: 16px;
    margin-bottom: 18px;
  }

  .chart-card {
    padding: 16px 12px;
    border-radius: 14px;
  }

  .chart-header {
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .chart-title {
    font-size: var(--g-kit-font-size-sigma, 14px);
    line-height: 19px;
  }

  .trend-chip {
    font-size: var(--g-kit-font-size-atom, 11px);
    padding: 3px 8px;
  }

  .svg-container {
    width: 100%;
    aspect-ratio: 520 / 220;
    max-height: 170px;
    margin-bottom: 10px;
  }

  .chart-milestones-track {
    padding: 8px 10px;
    gap: 6px;
  }

  .milestone-step {
    padding: 6px 8px;
  }

  .step-year {
    font-size: 10px;
  }

  .step-value {
    font-size: 12px;
  }

  .step-tag {
    font-size: 9px;
    padding: 1px 5px;
  }

  /* Hedging Showcase - Bebas Distorsi Gambar & Padding Proporsional (16px) */
  .hedging-showcase {
    padding: 20px 16px;
    border-radius: 16px;
  }

  .hedging-bg-image {
    background-size: 100% auto;
    background-position: center top;
    background-repeat: no-repeat;
    opacity: 0.28;
    transform: none;
  }

  .hedging-showcase:hover .hedging-bg-image {
    transform: none;
  }

  .hedging-gradient-mask {
    background: linear-gradient(
      180deg,
      rgba(0, 30, 26, 0.88) 0%,
      rgba(0, 30, 26, 0.96) 180px,
      var(--g-kit-broccoli-90, #001e1a) 100%
    );
  }

  .hedging-ambient-glow {
    width: 220px;
    height: 220px;
  }

  .showcase-top {
    margin-bottom: 16px;
  }

  .showcase-badge {
    font-size: 10px;
    padding: 3px 10px;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .showcase-title {
    font-size: var(--g-kit-font-size-omicron, 17px);
    line-height: 23px;
    margin-bottom: 6px;
  }

  .showcase-lead {
    font-size: var(--g-kit-font-size-omega, 13px);
    line-height: 19px;
  }

  .showcase-grid {
    gap: 12px;
  }

  .showcase-card {
    padding: 16px 14px;
    border-radius: 12px;
  }

  .gram-number {
    font-size: 22px;
    line-height: 26px;
    margin-bottom: 4px;
  }

  .gram-label {
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 10px;
  }

  .card-meta-list {
    padding-top: 10px;
    gap: 4px;
  }

  .meta-row {
    font-size: 11px;
  }

  .bridge-indicator {
    padding: 2px 0;
  }

  .bridge-circle {
    width: 28px;
    height: 28px;
  }

  .bridge-svg {
    width: 13px;
    height: 13px;
  }

  .bridge-text {
    font-size: 11px;
  }

  .efficiency-percent {
    font-size: 28px;
    line-height: 32px;
    margin-bottom: 6px;
  }

  .efficiency-summary {
    font-size: 12px;
    line-height: 17px;
  }
}
</style>
