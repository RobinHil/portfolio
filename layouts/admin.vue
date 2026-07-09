<template>
  <!-- L'admin privilégie la clarté : thème clair, police sans-serif -->
  <div class="min-h-screen bg-slate-100 font-sans text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <NuxtLink to="/admin" class="font-bold text-slate-900">Administration</NuxtLink>
        <div class="flex items-center gap-3 text-sm">
          <span v-if="user" class="hidden text-slate-500 sm:inline">{{ user.email }}</span>
          <NuxtLink to="/" class="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50">Voir le site</NuxtLink>
          <button type="button" class="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700" @click="logout">
            Déconnexion
          </button>
        </div>
      </div>
      <nav aria-label="Navigation de l'administration" class="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
        <ul class="flex gap-1 pb-2 text-sm">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="block whitespace-nowrap rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100"
              active-class="!bg-blue-50 !text-blue-700 font-medium"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession()

const links = [
  { to: '/admin', label: 'Tableau de bord' },
  { to: '/admin/profil', label: 'Profil & liens' },
  { to: '/admin/projets', label: 'Projets' },
  { to: '/admin/formation', label: 'Formation' },
  { to: '/admin/experience', label: 'Expérience' },
  { to: '/admin/competences', label: 'Compétences' },
  { to: '/admin/interets', label: 'Centres d\'intérêt' },
  { to: '/admin/messages', label: 'Messages' },
]

async function logout() {
  await clear()
  await navigateTo('/admin/login')
}
</script>
