<template>
  <div v-if="about">
    <div class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <h1 class="mb-2 text-2xl font-bold text-term-green sm:text-3xl">
          <span class="text-term-dim" aria-hidden="true">~/</span>{{ UI.about.h1 }}
        </h1>
        <p class="max-w-2xl text-term-dim">{{ about.profile?.title }}</p>
      </div>
      <div class="shrink-0">
        <a href="/api/cv" class="term-btn" download>
          <span aria-hidden="true"></span> {{ UI.about.downloadCv }}
        </a>
        <p class="mt-2 max-w-xs text-xs text-term-dim">{{ UI.about.downloadCvHint }}</p>
      </div>
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
        <TermWindow v-for="cat in skillCategories" :key="cat.name" :title="`skills/${cat.name}`">
          <h3 class="sr-only">{{ cat.name }}</h3>
          <ul class="space-y-2.5">
            <li v-for="skill in cat.skills" :key="skill.id" class="flex items-start gap-2.5 text-sm">
              <span aria-hidden="true" class="w-5 shrink-0 text-center">{{ skill.icon || '▸' }}</span>
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
          <li v-for="skill in about.softSkills" :key="skill.id" class="flex items-center gap-3 rounded-md border border-term-border bg-term-panel px-4 py-3 text-sm">
            <span aria-hidden="true">{{ skill.icon || '▸' }}</span>
            <span>{{ skill.name }}</span>
          </li>
        </ul>
      </section>

      <section id="langues" aria-labelledby="langues-title">
        <SectionHeading id="langues-title" command="locale -a" :comment="UI.about.languages" />
        <ul class="space-y-3">
          <li v-for="lang in about.languages" :key="lang.id" class="flex items-center justify-between gap-3 rounded-md border border-term-border bg-term-panel px-4 py-3 text-sm">
            <span class="flex items-center gap-3">
              <span aria-hidden="true">{{ lang.icon || '▸' }}</span>
              <span>{{ lang.name }}</span>
            </span>
            <span class="text-term-green">{{ lang.detail }}</span>
          </li>
        </ul>
      </section>
    </div>

    <!-- Centres d'intérêt -->
    <section aria-labelledby="interets-title" class="mb-6">
      <SectionHeading id="interets-title" command="cat interets.txt" :comment="UI.about.interests" />
      <ul class="flex flex-wrap gap-3">
        <li v-for="interest in about.interests" :key="interest.id" class="rounded-md border border-term-border bg-term-panel px-4 py-2.5 text-sm">
          <span aria-hidden="true" class="mr-2">{{ interest.icon || '▸' }}</span>{{ interest.label }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
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
