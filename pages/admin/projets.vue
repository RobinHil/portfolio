<template>
  <AdminCrud
    title="Projets"
    entity-label="un projet"
    endpoint="/api/projects"
    :fields="fields"
    :item-title="p => p.title"
    :item-meta="p => (p.tags ?? []).join(' · ')"
  />
</template>

<script setup lang="ts">
import type { CrudField } from '~/components/admin/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Projets - Administration', robots: 'noindex' })

const fields: CrudField[] = [
  { key: 'title', label: 'Titre', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'tags', label: 'Stack technique (tags)', type: 'tags', hint: 'Séparés par des virgules - ex: Docker, Ansible, Python' },
  { key: 'repoUrl', label: 'Lien du dépôt GitHub', type: 'url', required: true, placeholder: 'https://github.com/…' },
  { key: 'demoUrl', label: 'Lien de démo (optionnel)', type: 'url', placeholder: 'https://…' },
  { key: 'imageUrl', label: 'Image / screenshot (URL)', type: 'text', required: true, hint: 'URL Unsplash (images.unsplash.com) ou chemin local /images/…' },
  { key: 'order', label: 'Ordre d\'affichage', type: 'number' },
]
</script>
