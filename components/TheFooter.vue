<template>
  <footer class="border-t border-term-border">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-term-dim sm:flex-row sm:px-6 sm:text-left">
      <p>© {{ new Date().getFullYear() }} - {{ UI.footer.rights }}</p>
      <p>{{ UI.footer.builtWith }}</p>
    </div>
  </footer>
</template>
