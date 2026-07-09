<template>
  <div class="flex min-h-screen flex-col">
    <CrtOverlay />
    <TheNavbar />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
