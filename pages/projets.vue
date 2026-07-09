<template>
  <div>
    <h1 class="mb-2 text-2xl font-bold text-term-green sm:text-3xl">
      <span class="text-term-dim" aria-hidden="true">~/</span>{{ UI.projects.h1 }}
    </h1>
    <p class="mb-10 text-term-dim">$ ls -la ~/projets --details</p>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="project in projects"
        :key="project.id"
        class="flex flex-col overflow-hidden rounded-md border border-term-border bg-term-panel transition hover:border-term-green/50"
      >
        <NuxtImg
          :src="project.imageUrl"
          :alt="UI.projects.screenshotAlt(project.title)"
          width="600"
          height="340"
          sizes="100vw md:50vw xl:400px"
          loading="lazy"
          class="h-44 w-full border-b border-term-border object-cover"
        />
        <div class="flex flex-1 flex-col p-5">
          <h2 class="mb-2 font-bold text-term-green">{{ project.title }}</h2>
          <p class="mb-4 flex-1 text-sm leading-relaxed text-term-dim">{{ project.description }}</p>

          <ul class="mb-4 flex flex-wrap gap-2" :aria-label="UI.projects.stack">
            <li
              v-for="tag in project.tags"
              :key="tag"
              class="rounded-sm border border-term-green/30 bg-term-green/5 px-2 py-0.5 text-xs text-term-green"
            >
              {{ tag }}
            </li>
          </ul>

          <div class="flex flex-wrap gap-4 text-sm">
            <a :href="project.repoUrl" target="_blank" rel="noopener" class="term-link">
              [ {{ UI.projects.repo }} ]
            </a>
            <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener" class="term-link">
              [ {{ UI.projects.demo }} ]
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: projects } = await useFetch('/api/projects', { default: () => [] })

usePageSeo({
  title: UI.projects.metaTitle,
  description: UI.projects.metaDescription,
  path: '/projets',
})
</script>
