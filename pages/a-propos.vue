<template>
  <div v-if="about">
    <div class="mb-10 flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-start">
      <div>
        <h1 class="mb-2 text-2xl font-bold text-term-green sm:text-3xl">
          <span class="text-term-dim" aria-hidden="true">~/</span>{{ UI.about.h1 }}
        </h1>
        <p class="mb-5 max-w-2xl text-term-dim">{{ about.profile?.title }}</p>
        <a href="/api/cv" class="term-btn" download>
          <Download class="h-4 w-4" aria-hidden="true" />
          {{ UI.about.downloadCv }}
        </a>
        <p class="mt-2 max-w-sm text-xs text-term-dim">{{ UI.about.downloadCvHint }}</p>
      </div>
      <NuxtImg
        src="/images/profile.jpg"
        :alt="UI.about.photoAlt"
        width="112"
        height="112"
        sizes="112px"
        class="h-24 w-24 shrink-0 rounded-full border-2 border-term-green/40 object-cover shadow-[0_0_24px_rgba(0,255,65,0.12)] sm:h-28 sm:w-28"
      />
    </div>

    <!-- Formation -->
    <section id="formation" aria-labelledby="formation-title" class="mb-14">
      <SectionHeading id="formation-title" command="cat formation.log" :comment="UI.about.education" />
      <ol class="space-y-6 border-l border-term-border pl-5 sm:pl-6">
        <li v-for="edu in about.education" :key="edu.id" class="relative">
          <span class="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-term-green sm:-left-[31px]" aria-hidden="true" />
          <p class="text-sm text-term-amber">{{ edu.period }}</p>
          <h3 class="font-bold text-term-text">{{ edu.title }}</h3>
          <p class="text-sm text-term-green/90">{{ edu.institution }}</p>
          <p v-if="edu.description" class="mt-1.5 max-w-3xl text-sm leading-relaxed text-term-dim">{{ edu.description }}</p>
        </li>
      </ol>
    </section>

    <!-- Expérience -->
    <section id="experience" aria-labelledby="experience-title" class="mb-14">
      <SectionHeading id="experience-title" command="cat experience.log" :comment="UI.about.experience" />
      <ol class="space-y-6 border-l border-term-border pl-5 sm:pl-6">
        <li v-for="exp in about.experience" :key="exp.id" class="relative">
          <span class="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-term-green sm:-left-[31px]" aria-hidden="true" />
          <p class="text-sm text-term-amber">{{ exp.period }}</p>
          <h3 class="font-bold text-term-text">{{ exp.role }}</h3>
          <p class="text-sm text-term-green/90">{{ exp.company }}</p>
          <p class="mt-1.5 max-w-3xl text-sm leading-relaxed text-term-dim">{{ exp.description }}</p>
        </li>
      </ol>
    </section>

    <!-- Compétences techniques -->
    <section id="competences" aria-labelledby="competences-title" class="mb-14">
      <SectionHeading id="competences-title" command="ls skills/" :comment="UI.about.hardSkills" />
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TermWindow v-for="cat in skillCategories" :key="cat.name" :title="`skills/${cat.name.toLowerCase()}`">
          <h3 class="mb-4 flex items-center gap-2.5 font-bold text-term-green">
            <CategoryIcon :name="cat.name" class="h-5 w-5" />
            {{ cat.name }}
          </h3>
          <ul class="space-y-2.5">
            <li v-for="skill in cat.skills" :key="skill.id" class="flex items-start gap-2 text-sm">
              <ChevronRight class="mt-0.5 h-3.5 w-3.5 shrink-0 text-term-green/60" aria-hidden="true" />
              <span>{{ skill.name }}</span>
            </li>
          </ul>
        </TermWindow>
      </div>
    </section>

    <!-- Soft skills + Langues -->
    <div class="mb-14 grid gap-10 md:grid-cols-2">
      <section aria-labelledby="softskills-title">
        <SectionHeading id="softskills-title" command="cat soft-skills.txt" :comment="UI.about.softSkills" />
        <ul class="space-y-3">
          <li v-for="skill in about.softSkills" :key="skill.id" class="term-card flex items-center gap-3 px-4 py-3 text-sm">
            <Check class="h-4 w-4 shrink-0 text-term-green" aria-hidden="true" />
            <span>{{ skill.name }}</span>
          </li>
        </ul>
      </section>

      <section id="langues" aria-labelledby="langues-title">
        <SectionHeading id="langues-title" command="locale -a" :comment="UI.about.languages" />
        <ul class="space-y-3">
          <li v-for="lang in about.languages" :key="lang.id" class="term-card flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span class="flex items-center gap-3">
              <Globe class="h-4 w-4 shrink-0 text-term-green/70" aria-hidden="true" />
              <span>{{ lang.name }}</span>
            </span>
            <span class="rounded-sm border border-neutral-400/30 bg-neutral-400/10 px-2 py-0.5 text-xs text-neutral-300">{{ lang.detail }}</span>
          </li>
        </ul>
      </section>
    </div>

    <!-- Centres d'intérêt -->
    <section aria-labelledby="interets-title" class="mb-6">
      <SectionHeading id="interets-title" command="cat interets.txt" :comment="UI.about.interests" />
      <ul class="flex flex-wrap gap-3">
        <li v-for="interest in about.interests" :key="interest.id" class="term-card px-4 py-2.5 text-sm">
          {{ interest.label }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Check, ChevronRight, Download, Globe } from 'lucide-vue-next'

const { data: about } = await useFetch('/api/about')

usePageSeo({
  title: UI.about.metaTitle,
  description: UI.about.metaDescription,
  path: '/a-propos',
})

// Regroupe les hard skills par catégorie en conservant l'ordre
const skillCategories = computed(() => {
  const map = new Map<string, NonNullable<typeof about.value>['hardSkills']>()
  for (const skill of about.value?.hardSkills ?? []) {
    const cat = skill.category ?? 'Autres'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(skill)
  }
  return [...map.entries()].map(([name, skills]) => ({ name, skills }))
})
</script>
