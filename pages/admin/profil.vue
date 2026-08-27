<template>
  <div class="max-w-2xl">
    <h1 class="mb-6 text-xl font-bold">Profil & liens de contact</h1>

    <form v-if="form" class="adm-card space-y-4 p-5" @submit.prevent="save">
      <div>
        <span class="adm-label">Photo de profil</span>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input v-model="form.photoUrl" type="text" placeholder="https://… ou /uploads/…" class="adm-input flex-1">
          <button type="button" class="adm-btn shrink-0 justify-center" :disabled="uploading" @click="pickFile">
            <Upload class="h-4 w-4" aria-hidden="true" />
            {{ uploading ? 'Envoi…' : 'Uploader une photo' }}
          </button>
        </div>
        <img
          v-if="form.photoUrl"
          :src="form.photoUrl"
          alt="Aperçu de la photo de profil actuelle"
          class="mt-2 h-24 w-24 rounded-full border border-slate-200 object-cover dark:border-slate-600"
        >
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          class="hidden"
          @change="onFilePicked"
        >
        <p v-if="uploadError" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{{ uploadError }}</p>
      </div>
      <div>
        <label for="p-fullName" class="adm-label">Nom complet *</label>
        <input id="p-fullName" v-model="form.fullName" type="text" required class="adm-input">
      </div>
      <div>
        <label for="p-title" class="adm-label">Titre / poste *</label>
        <input id="p-title" v-model="form.title" type="text" required class="adm-input">
      </div>
      <div>
        <label for="p-intro" class="adm-label">Présentation (page d'accueil, terminal et CV) *</label>
        <textarea id="p-intro" v-model="form.intro" rows="5" required class="adm-input" />
      </div>
      <div>
        <label for="p-location" class="adm-label">Localisation</label>
        <input id="p-location" v-model="form.location" type="text" placeholder="ex: Paris, France" class="adm-input">
      </div>
      <div>
        <label for="p-email" class="adm-label">Email de contact *</label>
        <input id="p-email" v-model="form.email" type="email" required class="adm-input">
      </div>
      <div>
        <label for="p-linkedin" class="adm-label">LinkedIn (URL) *</label>
        <input id="p-linkedin" v-model="form.linkedin" type="url" required class="adm-input">
      </div>
      <div>
        <label for="p-github" class="adm-label">GitHub (URL) *</label>
        <input id="p-github" v-model="form.github" type="url" required class="adm-input">
      </div>

      <p v-if="status === 'saved'" class="text-sm text-green-700 dark:text-green-400" role="status">Profil enregistré</p>
      <p v-else-if="status === 'error'" class="text-sm text-red-600 dark:text-red-400" role="alert">Erreur lors de l'enregistrement - vérifiez les champs.</p>

      <button type="submit" :disabled="status === 'saving'" class="adm-btn-primary">
        <Check class="h-4 w-4" aria-hidden="true" />
        {{ status === 'saving' ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Check, Upload } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Profil - Administration', robots: 'noindex' })

const { $csrfFetch } = useNuxtApp()
const { data: profile } = await useFetch('/api/profile')

const form = ref(profile.value ? { ...profile.value } : null)
const status = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')

/* --- Upload de la photo de profil --- */

const { upload, uploading } = useImageUpload()
const fileInput = ref<HTMLInputElement>()
const uploadError = ref('')

function pickFile() {
  fileInput.value?.click()
}

async function onFilePicked(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length || !form.value) return
  uploadError.value = ''
  try {
    const urls = await upload(input.files)
    if (urls[0]) form.value.photoUrl = urls[0]
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || 'Échec de l\'upload - vérifiez le format (jpg, png, webp, gif, avif) et la taille (max 8 Mo).'
  } finally {
    input.value = ''
  }
}

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
