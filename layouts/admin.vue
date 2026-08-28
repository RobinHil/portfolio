<template>
  <!-- L'admin privilégie la clarté : thème clair/sombre selon les préférences système -->
  <div class="min-h-screen bg-slate-100 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <NuxtLink to="/admin" class="inline-flex items-center gap-2 font-bold">
          <Settings class="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          Administration
        </NuxtLink>
        <div class="flex items-center gap-3 text-sm">
          <span v-if="user" class="hidden text-slate-500 dark:text-slate-400 sm:inline">{{ user.name || user.email }}</span>
          <NuxtLink to="/" class="adm-btn">
            <ExternalLink class="h-4 w-4" aria-hidden="true" />
            Voir le site
          </NuxtLink>
          <button type="button" class="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300" @click="logout">
            <LogOut class="h-4 w-4" aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </div>
      <nav aria-label="Navigation de l'administration" class="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
        <ul class="flex gap-1 pb-2 text-sm">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              active-class="!bg-blue-50 !text-blue-700 font-medium dark:!bg-blue-950 dark:!text-blue-300"
            >
              <component :is="link.icon" class="h-4 w-4" aria-hidden="true" />
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
import { BadgeCheck, Briefcase, ExternalLink, FolderGit2, GraduationCap, Heart, LayoutDashboard, LogOut, Mail, Settings, User, Wrench } from 'lucide-vue-next'

const { user, fetch: refreshSession } = useUserSession()
const { $csrfFetch } = useNuxtApp()

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/admin/profil', label: 'Profil & liens', icon: User },
  { to: '/admin/projets', label: 'Projets', icon: FolderGit2 },
  { to: '/admin/formation', label: 'Formation', icon: GraduationCap },
  { to: '/admin/certifications', label: 'Certifications', icon: BadgeCheck },
  { to: '/admin/experience', label: 'Expérience', icon: Briefcase },
  { to: '/admin/competences', label: 'Compétences', icon: Wrench },
  { to: '/admin/interets', label: 'Centres d\'intérêt', icon: Heart },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
]

async function logout() {
  // Passe par notre route POST protégée : le clear() natif de useUserSession
  // fait un DELETE /api/_auth/session sans token CSRF → 403 avec nuxt-csurf
  await $csrfFetch('/api/auth/logout', { method: 'POST' })
  await refreshSession()
  await navigateTo('/admin/login')
}
</script>
