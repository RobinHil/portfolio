<template>
  <AdminCrud
    title="Centres d'intérêt"
    entity-label="un centre d'intérêt"
    endpoint="/api/interests"
    :fields="fields"
    :item-title="i => i.label"
  />
</template>

<script setup lang="ts">
import type { CrudField } from '~/components/admin/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Centres d\'intérêt - Administration', robots: 'noindex' })

const fields: CrudField[] = [
  { key: 'label', label: 'Libellé', type: 'text', required: true },
  { key: 'order', label: 'Ordre d\'affichage', type: 'number' },
]
</script>
