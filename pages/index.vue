<template>
  <div>
    <h1 class="sr-only">{{ UI.home.metaTitle }}</h1>

    <TerminalShell
      :profile="about?.profile ?? null"
      :hard-skills="about?.hardSkills ?? []"
    />
    <p class="mt-3 text-center text-xs text-term-dim">{{ UI.home.hint }}</p>

    <!-- Intro rendue côté serveur (contenu indexable) -->
    <section v-if="about?.profile" class="mt-12 sm:mt-16" aria-labelledby="intro-title">
      <SectionHeading id="intro-title" command="cat intro.txt" />
      <div class="grid gap-8 md:grid-cols-[auto,1fr] md:items-center">
        <NuxtImg
          src="/images/profile.jpg"
          :alt="UI.about.photoAlt"
          width="160"
          height="160"
          sizes="128px md:160px"
          class="mx-auto h-32 w-32 rounded-md border border-term-border object-cover md:h-40 md:w-40"
        />
        <div>
          <p class="text-lg font-bold text-term-green">{{ about.profile.fullName }}</p>
          <p class="mb-3 text-sm text-term-dim">{{ about.profile.title }} · {{ about.profile.location }}</p>
          <p class="max-w-3xl leading-relaxed">{{ about.profile.intro }}</p>
        </div>
      </div>
    </section>

    <!-- Raccourcis vers les sections -->
    <section class="mt-12 sm:mt-16" aria-label="Sections du site">
      <div class="grid gap-4 sm:grid-cols-3">
        <NuxtLink
          v-for="card in cards"
          :key="card.to"
          :to="card.to"
          class="term-card group p-5 transition hover:border-term-green/60 hover:bg-term-panel2"
        >
          <p class="mb-1 text-sm text-term-dim">$ cd {{ card.cmd }}</p>
          <p class="flex items-center gap-1.5 font-bold text-term-green">
            {{ card.title }}
            <ArrowRight class="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </p>
          <p class="mt-2 text-sm text-term-dim">{{ card.text }}</p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { data: about } = await useFetch('/api/about')

usePageSeo({
  title: UI.home.metaTitle,
  description: UI.home.metaDescription,
  path: '/',
})

const cards = [
  { to: '/a-propos', cmd: 'a-propos', title: 'À propos', text: 'Parcours, formation, compétences techniques et CV téléchargeable.' },
  { to: '/projets', cmd: 'projets', title: 'Projets', text: 'Homelab, outils réseau, SOC, hardening : mes réalisations.' },
  { to: '/contact', cmd: 'contact', title: 'Contact', text: 'Formulaire de contact et liens directs (email, LinkedIn, GitHub).' },
]
</script>
