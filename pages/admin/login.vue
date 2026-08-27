<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <form class="adm-card w-full max-w-sm space-y-5 p-8" @submit.prevent="login">
      <div>
        <h1 class="flex items-center gap-2 text-xl font-bold">
          <Lock class="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          Administration
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Saisissez le mot de passe d'administration pour gérer le contenu du portfolio.</p>
      </div>

      <div>
        <label for="login-password" class="adm-label">Mot de passe</label>
        <input
          id="login-password"
          ref="passwordInput"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="adm-input"
        >
      </div>

      <p v-if="error" class="text-sm text-red-600 dark:text-red-400" role="alert">{{ error }}</p>

      <button type="submit" :disabled="loading" class="adm-btn-primary w-full justify-center py-2.5">
        <LogIn class="h-4 w-4" aria-hidden="true" />
        {{ loading ? 'Connexion…' : 'Se connecter' }}
      </button>

      <NuxtLink to="/" class="block text-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">← Retour au site</NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Lock, LogIn } from 'lucide-vue-next'

definePageMeta({ layout: false })

useSeoMeta({ title: 'Connexion - Administration', robots: 'noindex' })

const { loggedIn, fetch: refreshSession } = useUserSession()
const { $csrfFetch } = useNuxtApp()

// Déjà connecté → direction l'admin
watchEffect(() => {
  if (loggedIn.value) navigateTo('/admin')
})

const password = ref('')
const loading = ref(false)
const error = ref('')
const passwordInput = ref<HTMLInputElement | null>(null)

// Champ unique : on y place le curseur d'emblée.
onMounted(() => passwordInput.value?.focus())

async function login() {
  loading.value = true
  error.value = ''
  try {
    await $csrfFetch('/api/auth/login', { method: 'POST', body: { password: password.value } })
    await refreshSession()
    await navigateTo('/admin')
  } catch (err: any) {
    error.value = err?.statusCode === 429
      ? 'Trop de tentatives - réessayez dans quelques minutes.'
      : 'Mot de passe invalide.'
    // Le champ est vidé pour éviter qu'une saisie erronée reste affichée.
    password.value = ''
    passwordInput.value?.focus()
  } finally {
    loading.value = false
  }
}
</script>
