<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project"
        class="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
        @keydown.esc="emit('close')"
      >
        <!-- Fond -->
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" @click="emit('close')" />

        <!-- Fenêtre -->
        <div
          ref="dialogEl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          class="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-md border border-term-border bg-term-panel shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(0,255,65,0.07)] sm:rounded-md"
        >
          <div class="flex items-center gap-2 border-b border-term-border bg-term-panel2 px-4 py-2.5">
            <span class="h-3 w-3 rounded-full bg-term-red/80" aria-hidden="true" />
            <span class="h-3 w-3 rounded-full bg-term-amber/80" aria-hidden="true" />
            <span class="h-3 w-3 rounded-full bg-term-green/80" aria-hidden="true" />
            <span class="ml-2 min-w-0 flex-1 truncate text-xs text-term-dim">cat projets/{{ slug }}.txt</span>
            <button
              ref="closeBtn"
              type="button"
              class="rounded-sm p-1.5 text-term-dim transition hover:bg-term-green/10 hover:text-term-green"
              aria-label="Fermer le détail du projet"
              @click="emit('close')"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <NuxtImg
              :src="project.imageUrl"
              :alt="UI.projects.screenshotAlt(project.title)"
              width="800"
              height="420"
              sizes="100vw sm:672px"
              class="h-48 w-full border-b border-term-border object-cover sm:h-56"
            />
            <div class="space-y-5 p-5 sm:p-6">
              <div>
                <p class="mb-1 text-sm text-term-dim">$ cat titre.txt</p>
                <h2 id="project-modal-title" class="text-lg font-bold text-term-green sm:text-xl">{{ project.title }}</h2>
              </div>

              <div>
                <p class="mb-1.5 text-sm text-term-dim">$ cat description.txt</p>
                <p class="whitespace-pre-line text-sm leading-relaxed sm:text-[15px]">{{ project.description }}</p>
              </div>

              <div>
                <p class="mb-2 text-sm text-term-dim">$ cat stack.txt</p>
                <ul class="flex flex-wrap gap-2" :aria-label="UI.projects.stack">
                  <li
                    v-for="tag in project.tags"
                    :key="tag"
                    class="rounded-sm border border-term-green/30 bg-term-green/10 px-2 py-0.5 text-xs text-term-green"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </div>

              <div class="flex flex-wrap gap-3 border-t border-term-border pt-5">
                <a :href="project.repoUrl" target="_blank" rel="noopener" class="term-btn text-sm">
                  <Github class="h-4 w-4" aria-hidden="true" />
                  {{ UI.projects.repo }}
                </a>
                <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener" class="term-btn text-sm">
                  <ExternalLink class="h-4 w-4" aria-hidden="true" />
                  {{ UI.projects.demo }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ExternalLink, Github, X } from 'lucide-vue-next'

type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  repoUrl: string
  demoUrl: string | null
  imageUrl: string
}

const props = defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()

const closeBtn = ref<HTMLButtonElement>()
const dialogEl = ref<HTMLElement>()

const slug = computed(() =>
  (props.project?.title ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
)

// Verrouille le scroll de la page et place le focus dans la modale.
// La largeur de la scrollbar est compensée par un padding pour éviter
// tout décalage horizontal du contenu à l'ouverture/fermeture.
function lockScroll(lock: boolean) {
  const html = document.documentElement
  if (lock) {
    const scrollbarWidth = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : ''
  } else {
    html.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

watch(() => props.project, (open) => {
  if (import.meta.server) return
  lockScroll(!!open)
  if (open) nextTick(() => closeBtn.value?.focus())
})

// Piège à focus minimal : Tab reste dans la fenêtre
function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !dialogEl.value) return
  const focusables = dialogEl.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
  if (focusables.length === 0) return
  const first = focusables[0]!
  const last = focusables[focusables.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!props.project) return
  if (e.key === 'Escape') emit('close')
  else trapFocus(e)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  lockScroll(false)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
