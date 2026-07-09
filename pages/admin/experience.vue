<template>
  <AdminCrud
    title="Expérience professionnelle"
    entity-label="une expérience"
    endpoint="/api/experience"
    :fields="fields"
    :item-title="e => e.role"
    :item-meta="e => `${e.company} - ${e.period}`"
  />
</template>

<script setup lang="ts">
import type { CrudField } from '~/components/admin/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Expérience - Administration', robots: 'noindex' })

const fields: CrudField[] = [
  { key: 'role', label: 'Poste', type: 'text', required: true },
  { key: 'company', label: 'Entreprise', type: 'text', required: true },
  { key: 'period', label: 'Période', type: 'text', required: true, placeholder: 'ex: 2022 - 2024' },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'order', label: 'Ordre d\'affichage', type: 'number' },
]
</script>
