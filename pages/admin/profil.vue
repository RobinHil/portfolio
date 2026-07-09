<template>
  <div class="max-w-2xl">
    <h1 class="mb-6 text-xl font-bold">Profil & liens de contact</h1>

    <form v-if="form" class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="save">
      <div>
        <label for="p-fullName" class="mb-1 block text-sm font-medium text-slate-700">Nom complet *</label>
        <input id="p-fullName" v-model="form.fullName" type="text" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
      </div>
      <div>
        <label for="p-title" class="mb-1 block text-sm font-medium text-slate-700">Titre / poste *</label>
        <input id="p-title" v-model="form.title" type="text" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
      </div>
      <div>
        <label for="p-intro" class="mb-1 block text-sm font-medium text-slate-700">Présentation (page d'accueil, terminal et CV) *</label>
        <textarea id="p-intro" v-model="form.intro" rows="5" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
      </div>
      <div>
        <label for="p-location" class="mb-1 block text-sm font-medium text-slate-700">Localisation</label>
        <input id="p-location" v-model="form.location" type="text" placeholder="ex: Lyon, France" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
      </div>
      <div>
        <label for="p-email" class="mb-1 block text-sm font-medium text-slate-700">Email de contact *</label>
        <input id="p-email" v-model="form.email" type="email" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
      </div>
      <div>
        <label for="p-linkedin" class="mb-1 block text-sm font-medium text-slate-700">LinkedIn (URL) *</label>
        <input id="p-linkedin" v-model="form.linkedin" type="url" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
      </div>
      <div>
        <label for="p-github" class="mb-1 block text-sm font-medium text-slate-700">GitHub (URL) *</label>
        <input id="p-github" v-model="form.github" type="url" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
      </div>

      <p v-if="status === 'saved'" class="text-sm text-green-700" role="status">Profil enregistré</p>
      <p v-else-if="status === 'error'" class="text-sm text-red-600" role="alert">Erreur lors de l'enregistrement - vérifiez les champs.</p>

      <button type="submit" :disabled="status === 'saving'" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
        {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Profil - Administration', robots: 'noindex' })

const { $csrfFetch } = useNuxtApp()
const { data: profile } = await useFetch('/api/profile')

const form = ref(profile.value ? { ...profile.value } : null)
const status = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')

async function save() {
  if (!form.value) return
  status.value = 'saving'
  try {
    const { id, ...body } = form.value as any
    await $csrfFetch('/api/profile', { method: 'PUT', body })
    status.value = 'saved'
  } catch {
    status.value = 'error'
  }
}
</script>
