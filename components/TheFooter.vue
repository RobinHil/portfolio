<script setup lang="ts">
/*
 * Le titulaire du copyright vient du profil, pas d'une chaine figee : une
 * mention « (c) 2026 - Tous droits reserves » sans nom ne designe personne et
 * ne protege donc rien. Le nom reste modifiable depuis le back-office.
 *
 * La cle 'profil-pied' evite de refaire la requete a chaque page : Nuxt
 * dedoublonne les appels qui partagent une cle. Si l'appel echoue, on retombe
 * sur la mention seule plutot que d'afficher un pied de page casse.
 */
const { data: profil } = await useFetch('/api/profile', { key: 'profil-pied' })
const titulaire = computed(() => profil.value?.fullName?.trim() || '')
</script>

<template>
  <footer class="border-t border-term-border">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-term-dim sm:flex-row sm:px-6 sm:text-left">
      <p>© {{ new Date().getFullYear() }} {{ titulaire }} - {{ UI.footer.rights }}</p>
      <p>{{ UI.footer.builtWith }}</p>
    </div>
  </footer>
</template>
