<template>
  <img
    :src="resolvedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    decoding="async"
  >
</template>

<script setup lang="ts">
/*
 * Toutes les images de contenu du site passent par ce composant : la photo de
 * profil, les couvertures de projet et les carrousels de la modale. C'est donc
 * le seul endroit qui ait besoin de savoir sous quel chemin le site est servi.
 *
 * Le contenu (utils/content.ts) donne des chemins absolus comme
 * "/images/projects/echo-saisie.jpg", commodes a ecrire et justes a la racine
 * d'un domaine. usePublicPath() les resout contre la base du deploiement.
 *
 * Le site etant statique, il n'y a plus d'optimiseur d'images a l'execution :
 * @nuxt/image a ete retire avec le serveur, les fichiers sont servis tels
 * qu'ils sont dans public/. L'attribut `sizes` que les appelants passaient pour
 * <NuxtImg> n'a plus d'objet et n'est plus declare.
 */
const props = withDefaults(defineProps<{
  src?: string | null
  alt: string
  width?: number | string
  height?: number | string
  loading?: 'lazy' | 'eager'
}>(), { loading: 'eager', src: null })

// Un projet sans image ne doit pas casser le rendu de la page entiere : on
// retombe sur l'image par defaut livree dans public/images.
const FALLBACK = '/images/profile.jpg'

const publicPath = usePublicPath()

const resolvedSrc = computed(() => publicPath(props.src || FALLBACK))
</script>
