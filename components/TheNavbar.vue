<template>
  <header class="sticky top-0 z-40 border-b border-term-border bg-term-bg/90 backdrop-blur">
    <nav :aria-label="UI.nav.mainNavLabel" class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <NuxtLink to="/" class="shrink-0 text-sm font-bold text-term-green sm:text-base">
        {{ UI.site.name }}:~$<span class="ml-1 inline-block h-4 w-2 animate-blink bg-term-green align-middle" aria-hidden="true" />
      </NuxtLink>

      <!-- Navigation desktop -->
      <ul class="hidden items-center gap-1 md:flex">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="rounded-sm px-3 py-2 text-sm text-term-dim transition hover:bg-term-green/10 hover:text-term-green"
            active-class="!text-term-green bg-term-green/10"
          >
            ./{{ link.label }}
          </NuxtLink>
        </li>
        <li>
          <a href="/api/cv" class="ml-2 rounded-sm border border-term-green/50 px-3 py-2 text-sm text-term-green transition hover:bg-term-green/15">
            cv.pdf ↓
          </a>
        </li>
      </ul>

      <!-- Bouton menu mobile -->
      <button
        type="button"
        class="rounded-sm border border-term-border p-2.5 text-term-green md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? UI.nav.closeMenu : UI.nav.openMenu"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </nav>

    <!-- Menu mobile -->
    <div v-show="menuOpen" id="mobile-menu" class="border-t border-term-border md:hidden">
      <ul class="space-y-1 px-4 py-3">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block rounded-sm px-3 py-3 text-term-dim transition hover:bg-term-green/10 hover:text-term-green"
            active-class="!text-term-green bg-term-green/10"
            @click="menuOpen = false"
          >
            ./{{ link.label }}
          </NuxtLink>
        </li>
        <li>
          <a href="/api/cv" class="block rounded-sm border border-term-green/50 px-3 py-3 text-term-green" @click="menuOpen = false">
            cv.pdf ↓ <span class="text-term-dim">- télécharger mon CV</span>
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)

const links = [
  { to: '/', label: UI.nav.home },
  { to: '/a-propos', label: UI.nav.about },
  { to: '/projets', label: UI.nav.projects },
  { to: '/contact', label: UI.nav.contact },
]
</script>
