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
        <TermWindow v-if="profile" title="liens.txt">
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

      <!-- Formulaire -->
      <section aria-labelledby="form-title">
        <SectionHeading id="form-title" :command="UI.contact.formTitle" />
        <TermWindow title="message.form">
          <form class="space-y-5" novalidate @submit.prevent="submit">
            <div>
              <label for="contact-name" class="term-label">{{ UI.contact.name }} <span class="text-term-red" aria-hidden="true">*</span></label>
              <input id="contact-name" v-model="form.name" type="text" name="name" required maxlength="120" autocomplete="name" class="term-input">
            </div>
            <div>
              <label for="contact-email" class="term-label">{{ UI.contact.email }} <span class="text-term-red" aria-hidden="true">*</span></label>
              <input id="contact-email" v-model="form.email" type="email" name="email" required maxlength="200" autocomplete="email" class="term-input">
            </div>
            <div>
              <label for="contact-message" class="term-label">{{ UI.contact.message }} <span class="text-term-red" aria-hidden="true">*</span></label>
              <textarea id="contact-message" v-model="form.message" name="message" required minlength="10" maxlength="5000" rows="6" class="term-input resize-y" />
            </div>

            <p v-if="status === 'success'" class="text-sm text-term-green" role="status">{{ UI.contact.success }}</p>
            <p v-else-if="status === 'error'" class="text-sm text-term-red" role="alert">{{ errorMessage }}</p>

            <button type="submit" class="term-btn w-full justify-center sm:w-auto" :disabled="status === 'sending'">
              <Send class="h-4 w-4" aria-hidden="true" />
              {{ status === 'sending' ? UI.contact.sending : UI.contact.send }}
            </button>
          </form>
        </TermWindow>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail, Send } from 'lucide-vue-next'

const { data: profile } = await useFetch('/api/profile')

usePageSeo({
  title: UI.contact.metaTitle,
  description: UI.contact.metaDescription,
  path: '/contact',
})

const { $csrfFetch } = useNuxtApp()

const form = reactive({ name: '', email: '', message: '' })
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorMessage = ref(UI.contact.error)

async function submit() {
  status.value = 'sending'
  try {
    await $csrfFetch('/api/contact', { method: 'POST', body: { ...form } })
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (err: any) {
    errorMessage.value = err?.statusCode === 429 ? UI.contact.rateLimited : UI.contact.error
    status.value = 'error'
  }
}
</script>
