<template>
  <component :is="tag" class="mb-6 flex flex-wrap items-baseline gap-x-3 text-lg font-bold sm:text-xl">
    <span class="text-term-dim" aria-hidden="true">$</span>
    <span class="text-term-green">{{ command }}</span>
    <span v-if="comment" class="text-sm font-normal text-term-dim"># {{ comment }}</span>
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ command: string, comment?: string, tag?: string }>(), { tag: 'h2' })
</script>
