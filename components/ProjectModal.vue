<template>
  <Teleport to="body">
    <Transition name="modal" @after-leave="lockScroll(false)">
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
            <!-- Carrousel : couverture + galerie -->
            <div
              class="relative border-b border-term-border"
              role="group"
              aria-roledescription="carrousel"
              :aria-label="`Photos du projet ${project.title}`"
            >
              <ProjectImage
                :src="images[imageIndex] ?? project.imageUrl"
                :alt="`${project.title} - photo ${imageIndex + 1} sur ${images.length}`"
                width="800"
                height="420"
                sizes="100vw sm:672px"
                class="h-48 w-full object-cover sm:h-56"
              />
              <template v-if="images.length > 1">
                <button
                  type="button"
                  class="absolute left-2 top-1/2 -translate-y-1/2 rounded-sm border border-term-border bg-term-bg/80 p-2 text-term-green backdrop-blur transition hover:bg-term-green/15"
                  aria-label="Photo précédente"
                  @click="prevImage"
                >
                  <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border border-term-border bg-term-bg/80 p-2 text-term-green backdrop-blur transition hover:bg-term-green/15"
                  aria-label="Photo suivante"
                  @click="nextImage"
                >
                  <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </button>
                <div class="absolute inset-x-0 bottom-2 flex justify-center gap-2">
                  <button
                    v-for="(img, i) in images"
                    :key="img"
                    type="button"
                    class="h-2.5 w-2.5 rounded-full border border-term-green/60 transition"
                    :class="i === imageIndex ? 'bg-term-green' : 'bg-term-bg/70 hover:bg-term-green/40'"
                    :aria-label="`Afficher la photo ${i + 1} sur ${images.length}`"
                    :aria-current="i === imageIndex"
                    @click="imageIndex = i"
                  />
                </div>
                <span class="absolute right-2 top-2 rounded-sm bg-term-bg/80 px-1.5 py-0.5 text-xs text-term-dim backdrop-blur" aria-hidden="true">
                  {{ imageIndex + 1 }}/{{ images.length }}
                </span>
              </template>
            </div>

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
                    class="rounded-sm border border-neutral-400/30 bg-neutral-400/10 px-2 py-0.5 text-xs text-neutral-300"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </div>

              <div v-if="project.repoUrl || project.demoUrl" class="flex flex-wrap gap-3 border-t border-term-border pt-5">
                <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noopener" class="term-btn text-sm">
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
import { ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-vue-next'

type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  repoUrl: string | null
  demoUrl: string | null
  imageUrl: string
  gallery: string[]
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

/* --- Carrousel --- */

const imageIndex = ref(0)
const images = computed(() => {
  if (!props.project) return []
  return [...new Set([props.project.imageUrl, ...props.project.gallery])]
})

function prevImage() {
  imageIndex.value = (imageIndex.value - 1 + images.value.length) % images.value.length
}

function nextImage() {
  imageIndex.value = (imageIndex.value + 1) % images.value.length
}

/* --- Verrouillage du scroll --- */

// La largeur de la scrollbar est compensée par un padding pour éviter tout décalage
// horizontal. Le déverrouillage attend la fin de l'animation de sortie (@after-leave) :
// le faire pendant le fondu ferait sauter la fenêtre encore visible.
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
  if (open) {
    imageIndex.value = 0
    lockScroll(true)
    nextTick(() => closeBtn.value?.focus())
  }
  // fermeture : déverrouillage différé via @after-leave sur la Transition
})

/* --- Clavier : Échap, piège à focus, flèches du carrousel --- */

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
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowLeft' && images.value.length > 1) {
    prevImage()
  } else if (e.key === 'ArrowRight' && images.value.length > 1) {
    nextImage()
  } else {
    trapFocus(e)
  }
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
