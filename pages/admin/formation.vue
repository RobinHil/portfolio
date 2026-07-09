<template>
  <AdminCrud
    title="Formation"
    entity-label="une formation"
    endpoint="/api/education"
    :fields="fields"
    :item-title="e => e.title"
    :item-meta="e => `${e.institution} - ${e.period}`"
  />
</template>

<script setup lang="ts">
import type { CrudField } from '~/components/admin/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Formation - Administration', robots: 'noindex' })

const fields: CrudField[] = [
  { key: 'title', label: 'Intitulé', type: 'text', required: true },
  { key: 'institution', label: 'Établissement', type: 'text', required: true },
  { key: 'period', label: 'Période', type: 'text', required: true, placeholder: 'ex: 2022 - 2024' },
  { key: 'description', label: 'Description (optionnelle)', type: 'textarea' },
  { key: 'order', label: 'Ordre d\'affichage', type: 'number' },
]
</script>
