<template>
  <!-- La classe passée par le parent tombe sur l'icône via le fallthrough d'attributs -->
  <component :is="icon" aria-hidden="true" />
</template>

<script setup lang="ts">
import { Server, Network, ShieldCheck, Code, Terminal } from 'lucide-vue-next'

const props = defineProps<{ name: string }>()

// Icône déduite du nom de catégorie (champ libre côté admin) - fallback : Terminal
const icon = computed(() => {
  const n = props.name.toLowerCase()
  if (/(syst|serveur|server|os)/.test(n)) return Server
  if (/(r[ée]seau|network|net)/.test(n)) return Network
  if (/(s[ée]cu|secu|security)/.test(n)) return ShieldCheck
  if (/(dev|outil|code|tool)/.test(n)) return Code
  return Terminal
})
</script>
