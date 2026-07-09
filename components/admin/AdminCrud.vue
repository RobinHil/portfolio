<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <button v-if="!formOpen" type="button" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500" @click="openCreate">
        + Ajouter
      </button>
    </div>

    <!-- Formulaire création / édition -->
    <form v-if="formOpen" class="mb-8 space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="save">
      <h2 class="font-semibold">{{ editingId ? `Modifier ${entityLabel}` : `Ajouter ${entityLabel}` }}</h2>

      <div v-for="field in visibleFields" :key="field.key">
        <label :for="`field-${field.key}`" class="mb-1 block text-sm font-medium text-slate-700">
          {{ field.label }}<span v-if="field.required" class="text-red-600"> *</span>
        </label>

        <textarea
          v-if="field.type === 'textarea'"
          :id="`field-${field.key}`"
          v-model="form[field.key]"
          rows="4"
          :required="field.required"
          :placeholder="field.placeholder"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <select
          v-else-if="field.type === 'select'"
          :id="`field-${field.key}`"
          v-model="form[field.key]"
          :required="field.required"
          class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
        <p v-if="field.hint" class="mt-1 text-xs text-slate-500">{{ field.hint }}</p>
      </div>

      <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

      <div class="flex gap-3">
        <button type="submit" :disabled="saving" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <button type="button" class="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50" @click="closeForm">
          Annuler
        </button>
      </div>
    </form>

    <!-- Liste -->
    <p v-if="pending" class="text-sm text-slate-500">Chargement…</p>
    <p v-else-if="items.length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      Aucun élément pour le moment.
    </p>
    <ul v-else class="space-y-3">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="min-w-0">
          <p class="font-medium">{{ itemTitle(item) }}</p>
          <p v-if="itemMeta" class="truncate text-sm text-slate-500">{{ itemMeta(item) }}</p>
        </div>
        <div class="flex shrink-0 gap-2">
          <button type="button" class="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" @click="openEdit(item)">
            Modifier
          </button>
          <button type="button" class="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50" @click="remove(item)">
            Supprimer
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
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
