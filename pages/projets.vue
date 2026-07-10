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
        class="term-card group relative flex flex-col overflow-hidden transition hover:border-term-green/60"
      >
        <NuxtImg
          :src="project.imageUrl"
          :alt="UI.projects.screenshotAlt(project.title)"
          width="600"
          height="340"
          sizes="100vw md:50vw xl:400px"
          loading="lazy"
          class="h-44 w-full border-b border-term-border object-cover transition group-hover:opacity-90"
        />
        <div class="flex flex-1 flex-col p-5">
          <h2 class="mb-2 font-bold text-term-green">
            <!-- Bouton "étiré" : toute la carte ouvre le détail, les liens restent cliquables au-dessus -->
            <button type="button" class="text-left after:absolute after:inset-0 after:content-['']" @click="selected = project">
              {{ project.title }}
            </button>
          </h2>
          <p class="mb-4 flex-1 text-sm leading-relaxed text-term-dim line-clamp-3">{{ project.description }}</p>

          <ul class="mb-4 flex flex-wrap gap-2" :aria-label="UI.projects.stack">
            <li
              v-for="tag in project.tags.slice(0, 4)"
              :key="tag"
              class="rounded-sm border border-term-green/30 bg-term-green/5 px-2 py-0.5 text-xs text-term-green"
            >
              {{ tag }}
            </li>
            <li v-if="project.tags.length > 4" class="px-1 py-0.5 text-xs text-term-dim">
              +{{ project.tags.length - 4 }}
            </li>
          </ul>

          <div class="relative z-10 flex flex-wrap items-center gap-4 text-sm">
            <a :href="project.repoUrl" target="_blank" rel="noopener" class="term-link inline-flex items-center gap-1.5">
              <Github class="h-4 w-4" aria-hidden="true" />
              {{ UI.projects.repo }}
            </a>
            <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener" class="term-link inline-flex items-center gap-1.5">
              <ExternalLink class="h-4 w-4" aria-hidden="true" />
              {{ UI.projects.demo }}
            </a>
            <span class="ml-auto inline-flex items-center gap-1 text-xs text-term-dim transition group-hover:text-term-green">
              {{ UI.projects.details }}
              <ArrowRight class="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </div>

    <ProjectModal :project="selected" @close="selected = null" />
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, ExternalLink, Github } from 'lucide-vue-next'

const { data: projects } = await useFetch('/api/projects', { default: () => [] })

usePageSeo({
  title: UI.projects.metaTitle,
  description: UI.projects.metaDescription,
  path: '/projets',
})

const selected = ref<(typeof projects.value)[number] | null>(null)
</script>
