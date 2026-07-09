<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4 font-sans text-slate-900">
    <form class="w-full max-w-sm space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm" @submit.prevent="login">
      <div>
        <h1 class="text-xl font-bold">Administration</h1>
        <p class="mt-1 text-sm text-slate-500">Connectez-vous pour gérer le contenu du portfolio.</p>
      </div>

      <div>
        <label for="login-email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          id="login-email" v-model="email" type="email" required autocomplete="username"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
      </div>
      <div>
        <label for="login-password" class="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
        <input
          id="login-password" v-model="password" type="password" required autocomplete="current-password"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
      </div>

      <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

      <button type="submit" :disabled="loading" class="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
        {{ loading ? 'Connexion…' : 'Se connecter' }}
      </button>

      <NuxtLink to="/" class="block text-center text-sm text-slate-500 hover:text-slate-700">← Retour au site</NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ title: 'Connexion - Administration', robots: 'noindex' })

const { loggedIn, fetch: refreshSession } = useUserSession()
const { $csrfFetch } = useNuxtApp()

// Déjà connecté → direction l'admin
watchEffect(() => {
  if (loggedIn.value) navigateTo('/admin')
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  try {
    await $csrfFetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    await refreshSession()
    await navigateTo('/admin')
  } catch (err: any) {
    error.value = err?.statusCode === 429
      ? 'Trop de tentatives - réessayez dans une minute.'
      : 'Identifiants invalides.'
  } finally {
    loading.value = false
  }
}
</script>
