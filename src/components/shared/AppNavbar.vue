<script setup lang="ts">
/**
 * @file AppNavbar.vue
 * @description Navbar korporat modern untuk aplikasi Simulasi Rencana Emas Haji Arrum Zada.
 * Menghadirkan logo resmi landscape, navigasi anchor bersih & terstruktur,
 * active section tracking saat scroll, serta primary call-to-action button.
 *
 * Standar: Minimalist & Clean, Vue 3 <script setup lang="ts">, Bebas icon packages eksternal tak terdaftar.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrumZadaLogoLandscape } from '@/components/shared/logo'

const router = useRouter()
const route = useRoute()

const isScrolled = ref<boolean>(false)
const activeSection = ref<'simulasi' | 'keunggulan' | 'wawasan' | ''>('')

const navItems = [
  { id: 'simulasi', label: 'Simulasi', targetId: 'kalkulator-section' },
  { id: 'keunggulan', label: 'Keunggulan', targetId: 'keunggulan-section' },
  { id: 'wawasan', label: 'Wawasan & Edukasi', targetId: 'wawasan-section' },
]

const handleScroll = (): void => {
  const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
  isScrolled.value = scrollY > 20

  const kalkulatorEl = document.getElementById('kalkulator-section') || document.getElementById('heading-kebutuhan')
  const keunggulanEl = document.getElementById('keunggulan-section')
  const wawasanEl = document.getElementById('wawasan-section')

  const threshold = 180

  if (wawasanEl && scrollY >= wawasanEl.offsetTop - threshold) {
    activeSection.value = 'wawasan'
  } else if (keunggulanEl && scrollY >= keunggulanEl.offsetTop - threshold) {
    activeSection.value = 'keunggulan'
  } else if (kalkulatorEl && scrollY >= kalkulatorEl.offsetTop - threshold) {
    activeSection.value = 'simulasi'
  } else {
    activeSection.value = ''
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('scroll', handleScroll, { passive: true })
  document.body.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('scroll', handleScroll)
  document.body.removeEventListener('scroll', handleScroll)
})

const scrollToSection = (targetId: string): void => {
  const performScroll = () => {
    let el = document.getElementById(targetId)
    if (!el && targetId === 'kalkulator-section') {
      el = document.getElementById('heading-kebutuhan')
    }
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (route.path !== '/' && route.path !== '/simulasi-brd') {
    router.push('/').then(() => {
      setTimeout(performScroll, 200)
    })
  } else {
    performScroll()
  }
}

const handleBrandClick = (): void => {
  if (route.path !== '/' && route.path !== '/simulasi-brd') {
    router.push('/')
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
    document.body.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <header
    class="app-navbar"
    :class="{ 'is-scrolled': isScrolled }"
    role="banner"
  >
    <div class="navbar-container">
      <!-- Brand Identitas Arrum Zada -->
      <button
        type="button"
        class="navbar-brand-btn"
        title="Kembali ke atas"
        aria-label="Beranda Arrum Zada"
        @click="handleBrandClick"
      >
        <ArrumZadaLogoLandscape :mark-size="36" variant="dark" />
      </button>

      <!-- Navigasi Utama Anchor Links -->
      <nav class="navbar-nav" aria-label="Navigasi Halaman">
        <ul class="nav-links-list" role="menubar">
          <li
            v-for="item in navItems"
            :key="item.id"
            role="none"
          >
            <button
              :id="`nav-link-${item.id}`"
              type="button"
              role="menuitem"
              class="nav-link-btn"
              :class="{ 'is-active': activeSection === item.id }"
              @click="scrollToSection(item.targetId)"
            >
              {{ item.label }}
              <span class="active-indicator" aria-hidden="true"></span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Action Area: CTA Button Primer -->
      <div class="navbar-actions">
        <button
          id="btn-nav-hitung"
          type="button"
          class="nav-cta-btn"
          title="Mulai hitung simulasi haji"
          @click="scrollToSection('kalkulator-section')"
        >
          <span>Mulai Hitung</span>
          <svg
            class="cta-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="15"
            height="15"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--g-kit-black-20, #e2e8f0);
  transition: all 0.25s ease;
}

.app-navbar.is-scrolled {
  background: rgba(255, 255, 255, 0.98);
  border-bottom-color: #cbd5e1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* Brand Button */
.navbar-brand-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s ease;
}

.navbar-brand-btn:hover {
  opacity: 0.88;
}

.navbar-brand-btn:focus-visible {
  outline: 2px solid var(--g-kit-broccoli-50, #004d43);
  outline-offset: 4px;
  border-radius: 6px;
}

/* Nav Menu */
.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-links-list {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link-btn {
  position: relative;
  background: transparent;
  border: none;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: 20px;
  font-weight: 600;
  color: var(--g-kit-black-70, #475569);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.nav-link-btn:hover {
  color: var(--g-kit-broccoli-50, #004d43);
  background: rgba(0, 77, 67, 0.05);
}

.nav-link-btn.is-active {
  color: var(--g-kit-broccoli-50, #004d43);
  background: rgba(0, 77, 67, 0.08);
  font-weight: 700;
}

.active-indicator {
  position: absolute;
  bottom: 2px;
  left: 16px;
  right: 16px;
  height: 2px;
  border-radius: 2px;
  background: var(--g-kit-broccoli-50, #004d43);
  opacity: 0;
  transform: scaleX(0.4);
  transition: all 0.2s ease;
}

.nav-link-btn.is-active .active-indicator {
  opacity: 1;
  transform: scaleX(1);
}

/* Actions & CTA */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--g-kit-broccoli-50, #004d43);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 9px 18px;
  font-size: var(--g-kit-font-size-sigma, 14px);
  line-height: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 77, 67, 0.2);
}

.nav-cta-btn:hover {
  background: var(--g-kit-broccoli-70, #07281c);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 77, 67, 0.28);
}

.nav-cta-btn:active {
  transform: translateY(0);
}

.cta-icon {
  transition: transform 0.2s ease;
}

.nav-cta-btn:hover .cta-icon {
  transform: translateX(2px);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
    height: 60px;
  }

  .navbar-nav {
    display: none;
  }

  .nav-cta-btn {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
