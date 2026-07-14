<template>
  <TermWindow :title="UI.home.terminalTitle" :padded="false">
    <div
      ref="scroller"
      class="h-[340px] cursor-text overflow-x-auto overflow-y-auto p-4 leading-relaxed sm:h-[420px] sm:p-6"
      @click="focusInput"
    >
      <!-- Sortie du terminal : annoncée progressivement aux lecteurs d'écran -->
      <div role="log" aria-live="polite" class="space-y-0.5 text-[11px] leading-relaxed sm:text-sm">
        <div v-for="(line, i) in lines" :key="i" :class="lineClass(line)">
          <template v-if="line.kind === 'in'">
            <span class="whitespace-pre text-term-green">{{ prompt + ' ' }}</span>
            <span class="whitespace-pre-wrap break-words text-term-text">{{ line.text }}</span>
          </template>
          <template v-else-if="line.kind === 'link'">
            <span class="text-term-dim">→ </span>
            <a :href="line.href" target="_blank" rel="noopener" class="term-link">{{ line.text }}</a>
          </template>
          <template v-else-if="line.segments">
            <!-- Contenu à alignement fixe (art ASCII, colonnes) : ne se retourne jamais à la
                 ligne, défile horizontalement au besoin plutôt que de casser l'alignement. -->
            <span
              v-for="(seg, si) in line.segments"
              :key="si"
              class="whitespace-pre"
              :class="lineClass(seg)"
            >{{ seg.text }}</span>
          </template>
          <template v-else>
            <span :class="line.noWrap ? 'whitespace-pre' : 'whitespace-pre-wrap break-words'">{{ line.text || ' ' }}</span>
          </template>
        </div>
      </div>

      <!-- Ligne de saisie : curseur bloc positionné au point d'insertion, juste après le "$ ".
           Sur mobile l'input garde une taille calculée de 16px (sinon iOS zoome au focus) mais
           est réduit visuellement à 11px via scale(0.6875) + compensation de largeur ; le
           curseur en unité ch (11px) correspond alors exactement au texte affiché.
           Pas d'outline de focus ni de tap highlight : le curseur bloc est l'indicateur. -->
      <form v-if="booted" class="mt-1 flex items-center text-[11px] sm:text-sm" @submit.prevent="submit">
        <label for="terminal-input" class="sr-only">Ligne de commande du terminal interactif</label>
        <span class="shrink-0 whitespace-pre text-term-green">{{ prompt + ' ' }}</span>
        <span class="relative min-w-0 flex-1 overflow-hidden">
          <input
            id="terminal-input"
            ref="inputEl"
            v-model="input"
            type="text"
            class="w-full border-none bg-transparent p-0 text-inherit text-term-text caret-transparent outline-none [-webkit-tap-highlight-color:transparent] focus:outline-none focus:ring-0 focus-visible:outline-none max-sm:w-[145.455%] max-sm:origin-left max-sm:scale-[0.6875] max-sm:text-[16px]"
            autocomplete="off"
            autocapitalize="none"
            autocorrect="off"
            spellcheck="false"
            enterkeyhint="send"
            @keydown="onKeydown"
            @input="syncCursor"
            @keyup="syncCursor"
            @click="syncCursor"
            @select="syncCursor"
            @focus="focused = true; syncCursor()"
            @blur="focused = false"
          >
          <span
            aria-hidden="true"
            class="pointer-events-none absolute top-1/2 h-[1.2em] w-[0.62em] -translate-y-1/2 bg-term-green"
            :class="focused ? 'animate-blink' : 'opacity-40'"
            :style="{ left: `${cursorPos}ch` }"
          />
        </span>
      </form>
      <button
        v-else
        type="button"
        class="mt-2 text-xs text-term-dim underline underline-offset-4"
        @click="finishBoot"
      >
        [ passer l'animation ]
      </button>
    </div>
  </TermWindow>
</template>

<script setup lang="ts">
type Segment = {
  kind: 'out' | 'ok' | 'err' | 'accent' | 'dim'
  text: string
}

type Line = {
  kind: 'in' | 'out' | 'ok' | 'err' | 'accent' | 'dim' | 'link'
  text: string
  href?: string
  segments?: Segment[]
  // Contenu à alignement fixe (colonnes) : ne se retourne jamais à la ligne
  noWrap?: boolean
}

type ProfileLike = {
  fullName: string
  title: string
  intro: string
  email: string
  linkedin: string
  github: string
} | null

const props = defineProps<{
  profile: ProfileLike
  hardSkills: { name: string, category: string | null }[]
}>()

const lines = ref<Line[]>([])
const input = ref('')
const booted = ref(false)
const history = ref<string[]>([])
const historyIndex = ref(-1)
const scroller = ref<HTMLElement>()
const inputEl = ref<HTMLInputElement>()
const focused = ref(false)
// Position du curseur bloc, en nombre de caractères après le prompt (police monospace → unité ch)
const cursorPos = ref(0)

function syncCursor() {
  nextTick(() => {
    cursorPos.value = inputEl.value?.selectionStart ?? input.value.length
  })
}

// Couvre les modifications programmatiques (historique ↑/↓, autocomplétion, reset après Entrée)
watch(input, syncCursor)

const prompt = 'visiteur@portfolio:~$'

const SECTIONS = ['a-propos', 'projets', 'contact', 'competences'] as const
const COMMANDS = ['help', 'ls', 'cd', 'cat', 'contact', 'whoami', 'clear', 'fastfetch', 'date', 'echo', 'sudo']

const slug = (props.profile?.fullName ?? 'visiteur').toLowerCase().replace(/\s+/g, '.')

/* ----- Séquence de boot ----- */

const bootLines: Line[] = [
  { kind: 'ok', text: '[  OK  ] Démarrage de portfolio.service…' },
  { kind: 'ok', text: '[  OK  ] Montage de /home/visiteur' },
  { kind: 'ok', text: '[  OK  ] Chargement des modules : projets, competences, contact' },
  { kind: 'in', text: 'whoami' },
  { kind: 'accent', text: `${slug} - ${props.profile?.title ?? 'sysadmin & cybersécurité'}` },
  { kind: 'in', text: './portfolio --interactif' },
  { kind: 'out', text: 'Bienvenue sur mon portfolio. Tapez `help` pour la liste des commandes,' },
  { kind: 'out', text: 'ou utilisez simplement le menu de navigation en haut de page.' },
  { kind: 'out', text: '' },
]

let bootTimer: ReturnType<typeof setTimeout> | undefined
let bootStep = 0

function playBoot() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    finishBoot()
    return
  }
  const step = () => {
    if (bootStep >= bootLines.length) {
      finishBoot()
      return
    }
    lines.value.push(bootLines[bootStep]!)
    bootStep++
    scrollToBottom()
    bootTimer = setTimeout(step, bootStep <= 3 ? 260 : 150)
  }
  bootTimer = setTimeout(step, 350)
}

function finishBoot() {
  if (booted.value) return
  if (bootTimer) clearTimeout(bootTimer)
  lines.value = [...bootLines]
  booted.value = true
  scrollToBottom()
}

onMounted(() => playBoot())
onBeforeUnmount(() => {
  if (bootTimer) clearTimeout(bootTimer)
})

/* ----- Exécution des commandes ----- */

function submit() {
  const raw = input.value
  const cmd = raw.trim()
  input.value = ''
  print({ kind: 'in', text: raw })
  if (cmd) {
    history.value.push(cmd)
    historyIndex.value = history.value.length
    execute(cmd)
  }
  scrollToBottom()
}

function execute(cmdline: string) {
  const [cmd = '', ...args] = cmdline.split(/\s+/)
  const arg = args.join(' ')

  switch (cmd.toLowerCase()) {
    case 'help':
      printAll([
        { kind: 'accent', text: 'Commandes disponibles :' },
        { kind: 'out', text: '  help              afficher cette aide', noWrap: true },
        { kind: 'out', text: '  ls                lister les sections du site', noWrap: true },
        { kind: 'out', text: '  cd <section>      naviguer - ex: cd projets, cd a-propos', noWrap: true },
        { kind: 'out', text: '  cat about.txt     afficher ma présentation', noWrap: true },
        { kind: 'out', text: '  ls skills         lister mes compétences', noWrap: true },
        { kind: 'out', text: '  contact           afficher mes liens (email, LinkedIn, GitHub)', noWrap: true },
        { kind: 'out', text: '  whoami · fastfetch · clear' },
        { kind: 'dim', text: 'Astuce : Tab pour compléter, ↑/↓ pour l\'historique.' },
      ])
      break

    case 'ls':
      if (['skills', 'competences', 'compétences'].includes(arg.toLowerCase())) {
        listSkills()
      } else {
        printAll([{ kind: 'accent', text: SECTIONS.map(s => `${s}/`).join('   ') }])
      }
      break

    case 'cd':
      handleCd(arg)
      break

    case 'cat':
      handleCat(arg)
      break

    case 'contact':
      printContact()
      break

    case 'whoami':
      print({ kind: 'accent', text: `${slug} - ${props.profile?.title ?? ''}` })
      break

    case 'fastfetch':
      printAll([
        { kind: 'out', text: '' },
        { kind: 'out', text: '', segments: [
          { kind: 'out', text: '   _____      ____  ' },
          { kind: 'dim', text: '│ ' },
          { kind: 'accent', text: slug },
        ] },
        { kind: 'out', text: '', segments: [
          { kind: 'out', text: '  /\\/\\/\\/\\   | "o \\ ' },
          { kind: 'dim', text: '│ ' },
          { kind: 'accent', text: '─────────────────────────' },
        ] },
        { kind: 'out', text: '', segments: [
          { kind: 'out', text: '<|\\/\\/\\/\\/|_/ /___/ ' },
          { kind: 'dim', text: '│ ' },
          { kind: 'out', text: 'OS: Portfolio Linux v1.0' },
        ] },
        { kind: 'out', text: '', segments: [
          { kind: 'out', text: ' |___________/      ' },
          { kind: 'dim', text: '│ ' },
          { kind: 'out', text: `Rôle: ${props.profile?.title ?? 'sysadmin'}` },
        ] },
        { kind: 'out', text: '', segments: [
          { kind: 'out', text: ' |_|_|  /_/_/       ' },
          { kind: 'dim', text: '│ ' },
          { kind: 'out', text: 'Shell: visiteur-sh 5.2' },
        ] },
        { kind: 'out', text: '', segments: [
          { kind: 'out', text: '                    ' },
          { kind: 'dim', text: '│ ' },
          { kind: 'out', text: 'Uptime: toujours dispo pour un café' },
        ] },
        { kind: 'out', text: '' },
      ])
      break

    case 'date':
      print({ kind: 'out', text: new Date().toLocaleString('fr-FR') })
      break

    case 'echo':
      print({ kind: 'out', text: arg })
      break

    case 'sudo':
      print({ kind: 'err', text: `${slug} n'est pas dans le fichier sudoers. Cet incident sera signalé.` })
      break

    case 'clear':
      lines.value = []
      break

    default:
      print({ kind: 'err', text: `bash: ${cmd} : commande introuvable. Tapez 'help' pour la liste des commandes.` })
  }
}

function handleCd(arg: string) {
  const target = arg.toLowerCase().replace(/^\.\//, '').replace(/\/$/, '')
  const routes: Record<string, string> = {
    'projets': '/projets',
    'projects': '/projets',
    'a-propos': '/a-propos',
    'apropos': '/a-propos',
    'about': '/a-propos',
    'contact': '/contact',
    'competences': '/a-propos#competences',
    'compétences': '/a-propos#competences',
    'skills': '/a-propos#competences',
    '': '/',
    '~': '/',
    '/': '/',
    'home': '/',
  }
  const route = routes[target]
  if (route !== undefined) {
    print({ kind: 'dim', text: `→ navigation vers ${route === '/' ? '~' : route}` })
    navigateTo(route)
  } else {
    print({ kind: 'err', text: `bash: cd: ${arg}: Aucun fichier ou dossier de ce nom` })
    print({ kind: 'dim', text: `Sections disponibles : ${SECTIONS.join(', ')}` })
  }
}

function handleCat(arg: string) {
  const file = arg.toLowerCase()
  if (['about.txt', 'a-propos.txt', 'apropos.txt'].includes(file)) {
    const intro = props.profile?.intro ?? 'Présentation indisponible.'
    printAll(intro.split(/(?<=\.)\s+/).map(text => ({ kind: 'out' as const, text })))
  } else if (['contact.txt', 'liens.txt'].includes(file)) {
    printContact()
  } else if (!file) {
    print({ kind: 'err', text: 'cat: argument manquant - essayez `cat about.txt`' })
  } else {
    print({ kind: 'err', text: `cat: ${arg}: Aucun fichier ou dossier de ce nom` })
  }
}

function printContact() {
  const p = props.profile
  if (!p) {
    print({ kind: 'err', text: 'contact: données indisponibles' })
    return
  }
  printAll([
    { kind: 'accent', text: 'Mes liens :' },
    { kind: 'link', text: p.email, href: `mailto:${p.email}` },
    { kind: 'link', text: 'LinkedIn', href: p.linkedin },
    { kind: 'link', text: 'GitHub', href: p.github },
    { kind: 'dim', text: 'Ou directement : cd contact' },
  ])
}

function listSkills() {
  const byCategory = new Map<string, string[]>()
  for (const s of props.hardSkills) {
    const cat = s.category ?? 'Autres'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(s.name)
  }
  if (byCategory.size === 0) {
    print({ kind: 'err', text: 'ls: skills: aucune donnée' })
    return
  }
  for (const [cat, names] of byCategory) {
    print({ kind: 'accent', text: `${cat}/` })
    print({ kind: 'out', text: `  ${names.join(' · ')}` })
  }
  print({ kind: 'dim', text: 'Détail complet : cd a-propos' })
}

/* ----- Historique + autocomplétion ----- */

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (history.value.length === 0) return
    historyIndex.value = Math.max(0, historyIndex.value - 1)
    input.value = history.value[historyIndex.value] ?? ''
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value >= history.value.length - 1) {
      historyIndex.value = history.value.length
      input.value = ''
    } else {
      historyIndex.value++
      input.value = history.value[historyIndex.value] ?? ''
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    autocomplete()
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault()
    lines.value = []
  }
}

function autocomplete() {
  const raw = input.value
  const parts = raw.split(/\s+/)
  let candidates: string[] = []
  let prefix = ''

  if (parts.length <= 1) {
    prefix = parts[0] ?? ''
    candidates = COMMANDS
  } else {
    prefix = parts[parts.length - 1] ?? ''
    const cmd = parts[0]!.toLowerCase()
    if (cmd === 'cd') candidates = [...SECTIONS]
    else if (cmd === 'cat') candidates = ['about.txt', 'contact.txt']
    else if (cmd === 'ls') candidates = ['skills', ...SECTIONS]
  }

  const matches = candidates.filter(c => c.startsWith(prefix.toLowerCase()))
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0]!
    input.value = parts.join(' ') + (parts.length === 1 ? ' ' : '')
  } else if (matches.length > 1) {
    // Complète le préfixe commun puis affiche les possibilités
    let common = matches[0]!
    for (const m of matches) {
      while (!m.startsWith(common)) common = common.slice(0, -1)
    }
    if (common.length > prefix.length) {
      parts[parts.length - 1] = common
      input.value = parts.join(' ')
    }
    print({ kind: 'dim', text: matches.join('   ') })
    scrollToBottom()
  }
}

/* ----- Helpers ----- */

function print(line: Line) {
  lines.value.push(line)
}

function printAll(newLines: Line[]) {
  lines.value.push(...newLines)
}

function lineClass(line: Line) {
  switch (line.kind) {
    case 'ok': return 'text-term-green/80'
    case 'err': return 'text-term-red'
    case 'accent': return 'text-term-green'
    case 'dim': return 'text-term-dim'
    default: return 'text-term-text'
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  })
}

function focusInput() {
  // Ne vole pas le focus si l'utilisateur sélectionne du texte
  if (window.getSelection()?.toString()) return
  inputEl.value?.focus({ preventScroll: true })
}
</script>
