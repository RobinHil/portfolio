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
import { Check, Pencil, Plus, Trash2 } from 'lucide-vue-next'

export type CrudField = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'tags' | 'url' | 'email'
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
    } else if (field.type === 'number') {
      form[field.key] = value ?? 0
    } else {
      form[field.key] = value ?? (field.type === 'select' ? field.options?.[0]?.value ?? '' : '')
    }
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
