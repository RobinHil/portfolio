<template>
  <div class="flex min-h-screen flex-col bg-term-bg font-mono text-term-text">
    <CrtOverlay />
    <main class="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16">
      <TermWindow :title="`visiteur@portfolio: ${path}`" class="w-full">
        <h1 class="sr-only">{{ error?.statusCode === 404 ? UI.notFound.title : 'Erreur' }}</h1>
        <div class="space-y-2 text-sm sm:text-base">
          <p>
            <span class="text-term-green">visiteur@portfolio:~$</span>
            cd {{ path }}
          </p>
          <p v-if="error?.statusCode === 404" class="text-term-red">
            bash: cd: {{ path }}: No such file or directory
          </p>
          <p v-else class="text-term-red">
            bash: erreur {{ error?.statusCode ?? 500 }} - {{ error?.statusMessage || 'une erreur inattendue est survenue' }}
          </p>
          <p class="pt-2 text-term-dim"># Suggestions :</p>
          <p>
            <span class="text-term-green">visiteur@portfolio:~$</span>
            <button type="button" class="term-link ml-1" @click="goHome">cd ~ <span class="text-term-dim"># {{ UI.notFound.back }}</span></button>
          </p>
        </div>
      </TermWindow>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const path = useRequestURL().pathname

useSeoMeta({
  title: props.error?.statusCode === 404 ? `404 - ${UI.notFound.title}` : `Erreur ${props.error?.statusCode ?? 500}`,
  robots: 'noindex',
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>
