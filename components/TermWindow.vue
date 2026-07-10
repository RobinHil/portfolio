<template>
  <div class="overflow-hidden rounded-md border border-term-border bg-term-panel shadow-[0_10px_36px_rgba(0,0,0,0.5),0_0_28px_rgba(0,255,65,0.05)]">
    <div class="flex items-center gap-2 border-b border-term-border bg-term-panel2 px-4 py-2.5">
      <span class="h-3 w-3 rounded-full bg-term-red/80" aria-hidden="true" />
      <span class="h-3 w-3 rounded-full bg-term-amber/80" aria-hidden="true" />
      <span class="h-3 w-3 rounded-full bg-term-green/80" aria-hidden="true" />
      <span class="ml-2 truncate text-xs text-term-dim">{{ title }}</span>
      <slot name="actions" />
    </div>
    <div :class="padded ? 'p-4 sm:p-6' : ''">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string, padded?: boolean }>(), { padded: true })
</script>
