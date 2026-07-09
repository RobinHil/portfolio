<template>
  <div>
    <h1 class="mb-6 text-xl font-bold">Messages reçus</h1>

    <p v-if="messages.length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      Aucun message pour le moment.
    </p>

    <ul v-else class="space-y-4">
      <li
        v-for="msg in messages"
        :key="msg.id"
        class="rounded-lg border bg-white p-5 shadow-sm"
        :class="msg.read ? 'border-slate-200' : 'border-blue-300 ring-1 ring-blue-100'"
      >
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <span v-if="!msg.read" class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Non lu</span>
            <p class="font-medium">{{ msg.name }}</p>
            <a :href="`mailto:${msg.email}`" class="text-sm text-blue-600 hover:underline">{{ msg.email }}</a>
          </div>
          <time :datetime="msg.createdAt" class="text-xs text-slate-500">{{ formatDate(msg.createdAt) }}</time>
        </div>

        <p class="whitespace-pre-wrap text-sm text-slate-700">{{ msg.message }}</p>

        <div class="mt-4 flex gap-2">
          <button
            type="button"
            class="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            @click="toggleRead(msg)"
          >
            {{ msg.read ? 'Marquer comme non lu' : 'Marquer comme lu' }}
          </button>
          <button
            type="button"
            class="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            @click="remove(msg)"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Messages - Administration', robots: 'noindex' })

const { $csrfFetch } = useNuxtApp()
const { data, refresh } = await useFetch<any[]>('/api/messages', { default: () => [] })
const messages = computed(() => data.value ?? [])

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
}

async function toggleRead(msg: any) {
  await $csrfFetch(`/api/messages/${msg.id}`, { method: 'PATCH', body: { read: !msg.read } })
  await refresh()
}

async function remove(msg: any) {
  if (!window.confirm(`Supprimer le message de ${msg.name} ?`)) return
  await $csrfFetch(`/api/messages/${msg.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
