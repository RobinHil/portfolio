<template>
  <!-- Unsplash / assets publics : optimisés par @nuxt/image (WebP, tailles adaptées).
       Uploads (/uploads/…) : servis tels quels par la route dédiée (hors de portée d'ipx). -->
  <NuxtImg
    v-if="optimizable"
    :src="resolvedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
  />
  <img
    v-else
    :src="resolvedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
  >
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string | null
  alt: string
  width?: number | string
  height?: number | string
  sizes?: string
  loading?: 'lazy' | 'eager'
}>(), { loading: 'eager', src: null })

// Un enregistrement sans image ne doit pas casser le rendu SSR de la page
// entière : on retombe sur l'image par défaut livrée dans public/images.
const FALLBACK = '/images/profile.jpg'

const resolvedSrc = computed(() => props.src || FALLBACK)

const optimizable = computed(() =>
  resolvedSrc.value.startsWith('https://images.unsplash.com')
  || resolvedSrc.value.startsWith('/images/'),
)
</script>
