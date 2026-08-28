<template>
  <AdminCrud
    title="Certifications"
    entity-label="une certification"
    endpoint="/api/certifications"
    :fields="fields"
    :item-title="c => c.title"
    :item-meta="c => `${c.issuer} - ${c.period}`"
  />
</template>

<script setup lang="ts">
import type { CrudField } from '~/components/admin/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Certifications - Administration', robots: 'noindex' })

const fields: CrudField[] = [
  { key: 'title', label: 'Intitulé', type: 'text', required: true },
  { key: 'issuer', label: 'Organisme émetteur', type: 'text', required: true },
  { key: 'period', label: 'Période', type: 'text', required: true, placeholder: 'ex: Octobre 2025, ou 2026 - 2028' },
  { key: 'description', label: 'Description (optionnelle)', type: 'textarea' },
  { key: 'order', label: 'Ordre d\'affichage', type: 'number' },
]
</script>
