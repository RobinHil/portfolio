<template>
  <div>
    <h1 class="mb-2 text-2xl font-bold text-term-text sm:text-3xl">
      <span class="text-term-green" aria-hidden="true">~/</span>{{ UI.contact.h1 }}
    </h1>
    <p class="mb-10 text-term-dim">{{ UI.contact.subtitle }}</p>

    <div class="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
      <!-- Liens directs -->
      <section aria-labelledby="liens-title">
        <SectionHeading id="liens-title" :command="UI.contact.linksTitle" />
        <TermWindow title="liens.txt">
          <ul class="space-y-4 text-sm">
            <li>
              <p class="mb-1 flex items-center gap-2 text-term-dim">
                <Mail class="h-4 w-4 text-term-green/70" aria-hidden="true" /># Email
              </p>
              <a :href="`mailto:${profile.email}`" class="term-link break-all">{{ profile.email }}</a>
            </li>
            <li>
              <p class="mb-1 flex items-center gap-2 text-term-dim">
                <Linkedin class="h-4 w-4 text-term-green/70" aria-hidden="true" /># LinkedIn
              </p>
              <a :href="profile.linkedin" target="_blank" rel="noopener" class="term-link break-all">{{ profile.linkedin }}</a>
            </li>
            <li>
              <p class="mb-1 flex items-center gap-2 text-term-dim">
                <Github class="h-4 w-4 text-term-green/70" aria-hidden="true" /># GitHub
              </p>
              <a :href="profile.github" target="_blank" rel="noopener" class="term-link break-all">{{ profile.github }}</a>
            </li>
          </ul>
        </TermWindow>
      </section>

      <!-- Écrire un message -->
      <section aria-labelledby="mail-title">
        <SectionHeading id="mail-title" :command="UI.contact.mailTitle" />
        <TermWindow title="message.eml">
          <p class="mb-6 max-w-prose text-sm leading-relaxed text-term-dim">
            {{ UI.contact.mailHint }}
          </p>
          <a :href="mailtoUrl" class="term-btn w-full justify-center sm:w-auto">
            <Send class="h-4 w-4" aria-hidden="true" />
            {{ UI.contact.mailCta }}
          </a>
        </TermWindow>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail, Send } from 'lucide-vue-next'

// Le contenu est un module du depot, plus une requete : le site est statique.
const profile = PROFILE

usePageSeo({
  title: UI.contact.metaTitle,
  description: UI.contact.metaDescription,
  path: '/contact',
})

/*
 * Il y avait ici un formulaire, qui postait sur /api/contact : le handler
 * validait le message, le limitait en debit par IP et l'enregistrait en base
 * pour la boite de reception de l'admin. Le site n'a plus de serveur, donc plus
 * rien pour recevoir un POST, et un formulaire qui n'envoie nulle part est pire
 * que pas de formulaire. Reste le lien direct, qui a l'avantage de laisser une
 * trace dans les messages envoyes du visiteur.
 */
const mailtoUrl = computed(
  () => `mailto:${profile.email}?subject=${encodeURIComponent(UI.contact.mailSubject)}`,
)
</script>
