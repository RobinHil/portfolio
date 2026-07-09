<template>
  <AdminCrud
    title="Compétences, soft skills & langues"
    entity-label="une compétence"
    endpoint="/api/skills"
    :fields="fields"
    :item-title="s => `${s.icon ? s.icon + ' ' : ''}${s.name}`"
    :item-meta="s => metaFor(s)"
  />
</template>

<script setup lang="ts">
import type { CrudField } from '~/components/admin/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Compétences - Administration', robots: 'noindex' })

const typeLabels: Record<string, string> = {
  hard: 'Compétence technique',
  soft: 'Soft skill',
  language: 'Langue',
}

const fields: CrudField[] = [
  { key: 'name', label: 'Nom', type: 'text', required: true },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'hard', label: 'Compétence technique (hard skill)' },
      { value: 'soft', label: 'Soft skill' },
      { value: 'language', label: 'Langue' },
    ],
  },
  {
    key: 'category',
    label: 'Catégorie',
    type: 'text',
    placeholder: 'ex: Système, Réseau, Sécurité, Dev & Outils',
    hint: 'Uniquement pour les compétences techniques - les compétences de même catégorie sont regroupées.',
    showIf: form => form.type === 'hard',
  },
  { key: 'icon', label: 'Icône (emoji)', type: 'text', placeholder: 'ex: FR', hint: 'Un emoji illustratif, ou un drapeau pour les langues.' },
  {
    key: 'detail',
    label: 'Niveau',
    type: 'text',
    placeholder: 'ex: Natif, C1, B2',
    showIf: form => form.type === 'language',
  },
  { key: 'order', label: 'Ordre d\'affichage', type: 'number' },
]

function metaFor(s: any) {
  const parts = [typeLabels[s.type] ?? s.type]
  if (s.category) parts.push(s.category)
  if (s.detail) parts.push(s.detail)
  return parts.join(' · ')
}
</script>
