<template>
  <!-- Unsplash / assets publics : optimisés par @nuxt/image (WebP, tailles adaptées).
       Uploads (/uploads/…) : servis tels quels par la route dédiée (hors de portée d'ipx). -->
  <NuxtImg
    v-if="optimizable"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
  >
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width?: number | string
  height?: number | string
  sizes?: string
  loading?: 'lazy' | 'eager'
}>(), { loading: 'eager' })

const optimizable = computed(() =>
  props.src.startsWith('https://images.unsplash.com') || props.src.startsWith('/images/'),
)
</script>
