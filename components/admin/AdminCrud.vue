<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <button v-if="!formOpen" type="button" class="adm-btn-primary" @click="openCreate">
        <Plus class="h-4 w-4" aria-hidden="true" />
        Ajouter
      </button>
    </div>

    <!-- Formulaire création / édition -->
    <form v-if="formOpen" class="adm-card mb-8 space-y-4 p-5" @submit.prevent="save">
      <h2 class="font-semibold">{{ editingId ? `Modifier ${entityLabel}` : `Ajouter ${entityLabel}` }}</h2>

      <div v-for="field in visibleFields" :key="field.key">
        <label :for="`field-${field.key}`" class="adm-label">
          {{ field.label }}<span v-if="field.required" class="text-red-600 dark:text-red-400"> *</span>
        </label>

        <textarea
          v-if="field.type === 'textarea'"
          :id="`field-${field.key}`"
          v-model="form[field.key]"
          rows="4"
          :required="field.required"
          :placeholder="field.placeholder"
          class="adm-input"
        />
        <select
          v-else-if="field.type === 'select'"
          :id="`field-${field.key}`"
          v-model="form[field.key]"
          :required="field.required"
          class="adm-input"
        >
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>

        <!-- Image unique : URL (Unsplash…) ou upload direct -->
        <div v-else-if="field.type === 'image'">
          <div class="flex flex-col gap-2 sm:flex-row">
            <input
              :id="`field-${field.key}`"
              v-model="form[field.key]"
              type="text"
              :required="field.required"
              placeholder="https://images.unsplash.com/… ou /uploads/…"
              class="adm-input flex-1"
            >
            <button type="button" class="adm-btn shrink-0 justify-center" :disabled="uploading" @click="pickFiles(field.key, false)">
              <Upload class="h-4 w-4" aria-hidden="true" />
              {{ uploading ? 'Envoi…' : 'Uploader une image' }}
            </button>
          </div>
          <img
            v-if="form[field.key]"
            :src="form[field.key]"
            alt="Aperçu de l'image sélectionnée"
            class="mt-2 h-24 w-40 rounded-md border border-slate-200 object-cover dark:border-slate-600"
          >
        </div>

        <!-- Galerie : upload multiple + réorganisation simple -->
        <div v-else-if="field.type === 'gallery'">
          <ul v-if="form[field.key]?.length" class="mb-3 flex flex-wrap gap-3">
            <li v-for="(url, i) in form[field.key]" :key="`${url}-${i}`" class="relative">
              <img :src="url" :alt="`Photo ${i + 1} de la galerie`" class="h-20 w-32 rounded-md border border-slate-200 object-cover dark:border-slate-600">
              <button
                type="button"
                class="absolute -right-2 -top-2 rounded-full border border-slate-300 bg-white p-1 text-slate-600 shadow-sm hover:bg-red-50 hover:text-red-600 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-200"
                :aria-label="`Retirer la photo ${i + 1}`"
                @click="form[field.key].splice(i, 1)"
              >
                <X class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          </ul>
          <button type="button" class="adm-btn" :disabled="uploading" @click="pickFiles(field.key, true)">
            <Upload class="h-4 w-4" aria-hidden="true" />
            {{ uploading ? 'Envoi…' : 'Ajouter des photos' }}
          </button>
        </div>

        <input
          v-else
          :id="`field-${field.key}`"
          v-model="form[field.key]"
          :type="field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'"
          :required="field.required"
          :placeholder="field.placeholder"
          class="adm-input"
        >
        <p v-if="field.hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ field.hint }}</p>
      </div>

      <!-- Sélecteur de fichiers partagé par les champs image/galerie -->
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        class="hidden"
        :multiple="filePickMultiple"
        @change="onFilesPicked"
      >

      <p v-if="error" class="text-sm text-red-600 dark:text-red-400" role="alert">{{ error }}</p>

      <div class="flex gap-3">
        <button type="submit" :disabled="saving" class="adm-btn-primary">
          <Check class="h-4 w-4" aria-hidden="true" />
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <button type="button" class="adm-btn" @click="closeForm">
          Annuler
        </button>
      </div>
    </form>

    <!-- Liste -->
    <p v-if="pending" class="text-sm text-slate-500 dark:text-slate-400">Chargement…</p>
    <p v-else-if="items.length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
      Aucun élément pour le moment.
    </p>
    <ul v-else class="space-y-3">
      <li
        v-for="item in items"
        :key="item.id"
        class="adm-card flex flex-wrap items-center justify-between gap-3 p-4"
      >
        <div class="min-w-0">
          <p class="font-medium">{{ itemTitle(item) }}</p>
          <p v-if="itemMeta" class="truncate text-sm text-slate-500 dark:text-slate-400">{{ itemMeta(item) }}</p>
        </div>
        <div class="flex shrink-0 gap-2">
          <button type="button" class="adm-btn" @click="openEdit(item)">
            <Pencil class="h-4 w-4" aria-hidden="true" />
            Modifier
          </button>
          <button type="button" class="adm-btn-danger" @click="remove(item)">
            <Trash2 class="h-4 w-4" aria-hidden="true" />
            Supprimer
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Check, Pencil, Plus, Trash2, Upload, X } from 'lucide-vue-next'

export type CrudField = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'tags' | 'url' | 'email' | 'image' | 'gallery'
  required?: boolean
  options?: { value: string, label: string }[]
  placeholder?: string
  hint?: string
  showIf?: (form: Record<string, any>) => boolean
}

const props = defineProps<{
  title: string
  entityLabel: string
  endpoint: string
  fields: CrudField[]
  itemTitle: (item: any) => string
  itemMeta?: (item: any) => string
}>()

const { $csrfFetch } = useNuxtApp()
const { data, pending, refresh } = await useFetch<any[]>(props.endpoint, { default: () => [] })
const items = computed(() => data.value ?? [])

const formOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<Record<string, any>>({})
const saving = ref(false)
const error = ref('')

const visibleFields = computed(() => props.fields.filter(f => !f.showIf || f.showIf(form)))

function resetForm(item?: any) {
  for (const field of props.fields) {
    const value = item?.[field.key]
    if (field.type === 'tags') {
      form[field.key] = Array.isArray(value) ? value.join(', ') : ''
    } else if (field.type === 'gallery') {
      form[field.key] = Array.isArray(value) ? [...value] : []
    } else if (field.type === 'number') {
      form[field.key] = value ?? 0
    } else {
      form[field.key] = value ?? (field.type === 'select' ? field.options?.[0]?.value ?? '' : '')
    }
  }
}

/* --- Upload d'images (champs image/gallery) --- */

const { upload, uploading } = useImageUpload()
const fileInput = ref<HTMLInputElement>()
const filePickTarget = ref('')
const filePickMultiple = ref(false)

function pickFiles(key: string, multiple: boolean) {
  filePickTarget.value = key
  filePickMultiple.value = multiple
  // laisse le temps à :multiple de se propager avant d'ouvrir le sélecteur
  nextTick(() => fileInput.value?.click())
}

async function onFilesPicked(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  error.value = ''
  try {
    const urls = await upload(input.files)
    if (filePickMultiple.value) {
      form[filePickTarget.value] = [...(form[filePickTarget.value] ?? []), ...urls]
    } else {
      form[filePickTarget.value] = urls[0] ?? ''
    }
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Échec de l\'upload - vérifiez le format (jpg, png, webp, gif, avif) et la taille (max 8 Mo).'
  } finally {
    input.value = ''
  }
}

function openCreate() {
  editingId.value = null
  resetForm()
  error.value = ''
  formOpen.value = true
}

function openEdit(item: any) {
  editingId.value = item.id
  resetForm(item)
  error.value = ''
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editingId.value = null
}

function buildPayload() {
  const payload: Record<string, any> = {}
  for (const field of props.fields) {
    let value = form[field.key]
    if (field.type === 'tags') {
      value = String(value ?? '').split(',').map((t: string) => t.trim()).filter(Boolean)
    } else if (field.type === 'number') {
      value = Number(value ?? 0)
    }
    payload[field.key] = value
  }
  return payload
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const payload = buildPayload()
    if (editingId.value) {
      await $csrfFetch(`${props.endpoint}/${editingId.value}`, { method: 'PUT', body: payload })
    } else {
      await $csrfFetch(props.endpoint, { method: 'POST', body: payload })
    }
    closeForm()
    await refresh()
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.data?.message || 'Erreur lors de l\'enregistrement - vérifiez les champs.'
  } finally {
    saving.value = false
  }
}

async function remove(item: any) {
  if (!window.confirm(`Supprimer « ${props.itemTitle(item)} » ? Cette action est définitive.`)) return
  try {
    await $csrfFetch(`${props.endpoint}/${item.id}`, { method: 'DELETE' })
    await refresh()
  } catch {
    window.alert('Erreur lors de la suppression.')
  }
}
</script>
