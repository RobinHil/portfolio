<template>
  <div>
    <h1 class="mb-6 text-xl font-bold">Tableau de bord</h1>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.to"
        :to="stat.to"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300"
      >
        <p class="text-3xl font-bold text-blue-600">{{ stat.count }}</p>
        <p class="mt-1 text-sm text-slate-600">{{ stat.label }}</p>
      </NuxtLink>
    </div>

    <div class="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="mb-2 font-semibold">Rappels</h2>
      <ul class="list-inside list-disc space-y-1 text-sm text-slate-600">
        <li>Les sections des pages sont fixes ; tout leur contenu s'édite ici.</li>
        <li>Le CV PDF est généré automatiquement à partir des données « Profil », « Formation », « Expérience » et « Compétences ».</li>
        <li>Les messages reçus via le formulaire de contact ne déclenchent pas d'email : pensez à consulter la page « Messages ».</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Tableau de bord - Administration', robots: 'noindex' })

const [{ data: about }, { data: projects }, { data: messages }] = await Promise.all([
  useFetch('/api/about'),
  useFetch<any[]>('/api/projects', { default: () => [] }),
  useFetch<any[]>('/api/messages', { default: () => [] }),
])

const unread = computed(() => (messages.value ?? []).filter(m => !m.read).length)

const stats = computed(() => [
  { to: '/admin/projets', count: projects.value?.length ?? 0, label: 'Projets' },
  { to: '/admin/formation', count: about.value?.education?.length ?? 0, label: 'Entrées de formation' },
  { to: '/admin/experience', count: about.value?.experience?.length ?? 0, label: 'Expériences' },
  { to: '/admin/messages', count: unread.value, label: 'Messages non lus' },
])
</script>
