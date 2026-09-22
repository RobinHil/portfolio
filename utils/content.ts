/*
 * Contenu du portfolio.
 *
 * Il vivait auparavant dans une base SQLite, alimentee au premier demarrage
 * par server/plugins/seed.ts et editable depuis un back-office. Le site etant
 * desormais entierement statique - construit une fois, servi comme des
 * fichiers - il n'y a plus de serveur pour tenir cette base ni d'interface
 * pour l'ecrire : le contenu est donc ce fichier, et se modifie en committant.
 *
 * Les `id` ne servent qu'a donner une cle stable aux boucles `v-for`. Ils sont
 * attribues dans l'ordre de declaration par withIds() : l'ordre du tableau est
 * l'ordre d'affichage, il n'y a plus de colonne `order` a maintenir.
 */

export type Profile = {
  fullName: string
  title: string
  intro: string
  email: string
  linkedin: string
  github: string
  location: string
  photoUrl: string
}

export type Education = {
  id: number
  title: string
  institution: string
  period: string
  description: string | null
}

export type Certification = {
  id: number
  title: string
  issuer: string
  period: string
  description: string | null
}

export type Experience = {
  id: number
  role: string
  company: string
  period: string
  description: string
}

export type Skill = {
  id: number
  name: string
  type: 'hard' | 'soft' | 'language'
  category: string | null
  detail: string | null
}

export type Interest = {
  id: number
  label: string
}

export type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  repoUrl: string | null
  demoUrl: string | null
  imageUrl: string
  gallery: string[]
}

function withIds<T>(items: T[]): (T & { id: number })[] {
  return items.map((item, index) => ({ ...item, id: index + 1 }))
}

export const PROFILE: Profile = {
  fullName: 'Robin HILAIRE',
  title: 'Apprenti ingénieur en administration système et cybersécurité',
  intro:
    "En alternance chez OPALE informatique, sur l'administration système et réseau d'infrastructures client, "
    + "et en cycle ingénieur à l'EPITA, majeure cybersécurité et administration système. Je construis aussi "
    + 'des applications web de bout en bout, du schéma de base de données au reverse proxy qui les sert, et '
    + "j'administre le serveur qui les héberge. Ce qui m'intéresse dans la sécurité, c'est le concret : "
    + "comprendre par où ça casse, et garder un déploiement reproductible.",
  email: 'hilairerob84@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hilaire-robin',
  github: 'https://github.com/RobinHil',
  location: 'Paris, France',
  photoUrl: '/images/profile.jpg',
}

const EXPERIENCE = withIds<Omit<Experience, 'id'>>([
  {
    role: 'Apprenti ingénieur en administration système et cybersécurité',
    company: 'OPALE informatique, Paris',
    period: 'Septembre 2025 - aujourd\'hui',
    description:
      "Alternance sur les infrastructures gérées par l'entreprise : administration des systèmes "
      + 'et du réseau, et travaux autour de la norme DICOM.',
  },
  {
    role: 'Apprenti développeur logiciel IA',
    company: 'Aix-Marseille Université, Arles',
    period: 'Octobre 2024 - Juillet 2025',
    description:
      "Expérimentation et développement d'un prototype de solution RAG (Retrieval Augmented Generation) "
      + "donnant aux étudiants de l'université un LLM dont les sources d'information sont vérifiées par les "
      + "enseignants : des réponses fiables, et une autre manière de consommer les cours. Déploiement d'Ollama "
      + 'et LocalAI sous Docker, indexation dans une base de données vectorielle, chaîne de requêtes aux modèles '
      + 'construite avec LangChain.',
  },
  {
    role: 'Stagiaire en administration système',
    company: 'OPALE informatique, Paris',
    period: 'Avril - Juin 2024',
    description:
      "Mise en place et maintenance, matérielle et logicielle, d'un serveur d'imagerie médicale (PACS, norme "
      + 'DICOM). Conteneurisation Docker des services associés (SSO, journalisation), sécurisation de '
      + "l'infrastructure par un SSO, et R&D sur l'architecture déployée pour y intégrer de "
      + 'nouvelles solutions.',
  },
  {
    role: 'Vacataire, cuisine centrale',
    company: 'Mairie de Sorgues',
    period: 'Août 2023',
    description: 'Renfort estival en cuisine centrale municipale.',
  },
  {
    role: 'Vacataire, service technique',
    company: 'Mairie de Sorgues',
    period: 'Août 2022',
    description: 'Renfort estival au service technique de la commune.',
  },
])

const EDUCATION = withIds<Omit<Education, 'id'>>([
  {
    title: "Diplôme d'ingénieur en informatique, cybersécurité et administration système",
    institution: "EPITA, École d'ingénieurs en informatique",
    period: 'Septembre 2025 - Août 2028 (en cours)',
    description: "Cycle ingénieur en alternance, fin d'études prévue en 2028.",
  },
  {
    title: 'BUT Informatique, développement full-stack et administration système',
    institution: "IUT d'Aix-Marseille, campus d'Arles",
    period: 'Septembre 2022 - Juin 2025',
    description: 'Parcours "réalisation d\'applications : conception, développement, validation".',
  },
  {
    title: 'Baccalauréat général, mention bien',
    institution: 'Lycée Frédéric Mistral, Avignon',
    period: '2022',
    description: 'Spécialités mathématiques et informatique, option européenne anglais.',
  },
])

const CERTIFICATIONS = withIds<Omit<Certification, 'id'>>([
  {
    title: 'Fortinet NSE 4 Certified in FortiOS',
    issuer: 'Fortinet',
    period: 'Juillet 2026 - Juillet 2028',
    description: 'Pare-feu FortiGate : politiques de filtrage, VPN, inspection du trafic.',
  },
  // Les trois premiers niveaux sont regroupés : mêmes dates, même niveau
  // d'introduction, et aucun n'a de description propre. Trois lignes
  // distinctes occupaient la place sans rien apprendre de plus.
  {
    title: 'Fortinet NSE 1 à 3 Certified in Cybersecurity',
    issuer: 'Fortinet',
    period: 'Février 2026 - Février 2028',
    description:
      'Les trois niveaux introductifs du cursus Fortinet : panorama des menaces, produits de '
      + 'sécurité réseau et notions fondamentales, préalables au NSE 4.',
  },
  {
    title: 'MOOC EBIOS Risk Manager',
    issuer: "Club EBIOS, validé par l'ANSSI",
    period: 'Octobre 2025',
    description:
      "Fondamentaux de la méthode d'analyse de risques EBIOS Risk Manager, conçue par l'ANSSI. "
      + 'Formation en ligne bâtie avec le Club EBIOS, certification validée par l\'ANSSI.',
  },
])

const SKILLS = withIds<Omit<Skill, 'id' | 'category' | 'detail'> & { category?: string, detail?: string }>([
  // Hard skills - Langages
  { name: 'C, C++', type: 'hard', category: 'Langages' },
  { name: 'Go', type: 'hard', category: 'Langages' },
  { name: 'Rust', type: 'hard', category: 'Langages' },
  { name: 'Python', type: 'hard', category: 'Langages' },
  { name: 'JavaScript, TypeScript', type: 'hard', category: 'Langages' },
  { name: 'Java', type: 'hard', category: 'Langages' },
  { name: 'PHP', type: 'hard', category: 'Langages' },
  { name: 'SQL', type: 'hard', category: 'Langages' },
  { name: 'Bash', type: 'hard', category: 'Langages' },
  // Hard skills - Développement
  { name: 'Vue, Nuxt', type: 'hard', category: 'Développement' },
  { name: 'React, Next.js', type: 'hard', category: 'Développement' },
  { name: 'Angular, Ionic', type: 'hard', category: 'Développement' },
  { name: 'Node.js, Express', type: 'hard', category: 'Développement' },
  { name: 'Tailwind CSS', type: 'hard', category: 'Développement' },
  { name: 'Three.js', type: 'hard', category: 'Développement' },
  { name: 'Qt, PyQt', type: 'hard', category: 'Développement' },
  { name: 'Prisma', type: 'hard', category: 'Développement' },
  { name: 'PostgreSQL, MySQL, SQLite', type: 'hard', category: 'Développement' },
  { name: 'Vite, Webpack', type: 'hard', category: 'Développement' },
  // Hard skills - Systèmes et réseau
  { name: 'Administration système Linux', type: 'hard', category: 'Systèmes et réseau' },
  { name: 'Administration réseau', type: 'hard', category: 'Systèmes et réseau' },
  { name: 'Pare-feux (Fortinet FortiOS)', type: 'hard', category: 'Systèmes et réseau' },
  { name: 'Docker et Compose', type: 'hard', category: 'Systèmes et réseau' },
  { name: 'nginx, Caddy', type: 'hard', category: 'Systèmes et réseau' },
  { name: 'Administration de VPS', type: 'hard', category: 'Systèmes et réseau' },
  { name: 'Git, intégration continue', type: 'hard', category: 'Systèmes et réseau' },
  // Hard skills - Sécurité
  { name: 'Authentification, sessions, hachage', type: 'hard', category: 'Sécurité' },
  { name: 'SSO', type: 'hard', category: 'Sécurité' },
  { name: 'Reverse proxy et TLS', type: 'hard', category: 'Sécurité' },
  { name: 'Limitation de débit et anti-abus', type: 'hard', category: 'Sécurité' },
  // Soft skills
  { name: 'Autonomie', type: 'soft' },
  { name: 'Curiosité', type: 'soft' },
  { name: 'Minutie', type: 'soft' },
  { name: 'Adaptabilité', type: 'soft' },
  { name: 'Travail en équipe', type: 'soft' },
  // Langues
  { name: 'Français', type: 'language', detail: 'Langue maternelle' },
  { name: 'Anglais', type: 'language', detail: 'B2 - Cambridge Certificate' },
]).map(s => ({ ...s, category: s.category ?? null, detail: s.detail ?? null })) as Skill[]

const INTERESTS = withIds<Omit<Interest, 'id'>>([
  { label: 'Musique : basse, guitare, chant, composition' },
  { label: 'Cuisine' },
  { label: 'Photographie' },
  { label: 'Cinéma' },
  { label: 'Auto-hébergement et homelab' },
])

/*
 * Projets affichés sur /projets.
 *
 * `imageUrl` et `gallery` : un chemin sous public/images/projects/ (les
 * captures sont versionnées avec le site) ou une URL https complète. Les
 * chemins locaux sont résolus contre la base du déploiement par le composant
 * ProjectImage : ne pas les préfixer à la main.
 *
 * `repoUrl` / `demoUrl` : une URL, ou null. L'interface masque la barre de
 * liens, bordure comprise, quand les deux sont nuls.
 *
 * Les `demoUrl` pointent vers les sites publies par GitHub Pages, un par
 * depot : l'application elle-meme quand elle tourne dans un navigateur, sa
 * page de presentation quand c'est un programme qui s'installe. Le jour ou
 * robinhilaire.fr sert ces applications, ce sont ces lignes a changer, et rien
 * d'autre.
 */
export const PROJECTS: Project[] = withIds<Omit<Project, 'id'>>([
  {
    title: 'Records, une collection de disques au mur',
    description:
      "Une galerie pour une collection de vinyles et de CD. La collection elle-même vit sur Discogs ; l'application "
      + "l'y synchronise, puis ajoute ce que Discogs ne propose pas : un mur de pochettes, "
      + 'un ordre manuel, des favoris et un filtrage instantané. Synchronisation quotidienne '
      + 'programmée, et suppression douce pour ne jamais perdre un disque retiré de la collection.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'API Discogs', 'GitHub Actions'],
    repoUrl: 'https://github.com/RobinHil/records',
    demoUrl: 'https://robinhil.github.io/records/',
    imageUrl: '/images/projects/records-mur.jpg',
    gallery: ['/images/projects/records-fiche.jpg'],
  },
  {
    title: 'Ce portfolio',
    description:
      "Le site que vous lisez. Une façade terminal interactive (démarrage animé, navigation par commandes, "
      + "autocomplétion, historique) doublée d'une navigation classique toujours visible, et un CV PDF "
      + 'compatible ATS engendré au build depuis la même source que les pages. Entièrement statique : '
      + 'le contenu est un module du dépôt, le site se construit une fois et se sert comme des fichiers.',
    tags: ['Nuxt', 'Vue', 'TypeScript', 'Tailwind CSS', 'PDFKit', 'GitHub Actions'],
    repoUrl: 'https://github.com/RobinHil/portfolio',
    demoUrl: 'https://robinhil.github.io/portfolio/',
    imageUrl: '/images/projects/portfolio-terminal.jpg',
    gallery: ['/images/projects/portfolio-projets.jpg', '/images/projects/portfolio-apropos.jpg'],
  },
  {
    title: 'hublot, Docker en plein écran dans le terminal',
    description:
      'Une interface terminal pour Docker : la consommation processeur, mémoire et réseau de chaque conteneur en '
      + 'direct, et tout ce que le démon gère - conteneurs, piles Compose, images, volumes, réseaux, disque - '
      + "parcouru au clavier. L'API Docker ne sait pas simuler une purge : elle supprime d'abord et rend des comptes "
      + "ensuite. hublot en reconstruit l'aperçu, applique les mêmes filtres que le démon et nomme ce qui va "
      + 'disparaître avant que rien ne le soit, les objets appartenant à une pile Compose en tête. Ces piles, '
      + 'justement, sont recomposées depuis les étiquettes que Compose laisse sur des objets ordinaires, et '
      + "l'écart avec le YAML sur le disque est signalé. Elle ne parle qu'à la socket locale, par choix, et se livre "
      + 'en paquets Debian, RPM, Arch et AppImage.',
    tags: ['Go', 'Bubble Tea', 'API Docker Engine', 'Compose', 'Linux', 'macOS', 'Empaquetage'],
    repoUrl: 'https://github.com/RobinHil/hublot',
    demoUrl: 'https://robinhil.github.io/hublot/',
    // Captures reelles, prises dans un pty contre un vrai demon puis rendues
    // depuis les runs colores que l'ecran contenait : le texte reste net, et
    // aucun chiffre n'est invente.
    imageUrl: '/images/projects/hublot-conteneurs.jpg',
    gallery: [
      '/images/projects/hublot-compose.jpg',
      '/images/projects/hublot-disque.jpg',
      '/images/projects/hublot-prune.jpg',
      '/images/projects/hublot-logs.jpg',
    ],
  },
  {
    title: "Echo, sonification de textes et d'images",
    description:
      "Transforme un texte ou une image en pièce musicale, entièrement dans le navigateur. Aucune IA générative : "
      + "l'analyse de l'entrée en dégage une intention musicale, traduite en motifs Strudel puis jouée hors ligne, "
      + 'et le résultat se télécharge en MP3, FLAC, WAV ou OGG. Aucune donnée ne quitte la machine, et le même '
      + 'contenu produit toujours exactement le même son. Projet entièrement vibe codé.',
    tags: ['React', 'TypeScript', 'Strudel', 'Tone.js', 'Web Audio', 'ffmpeg.wasm', 'Vite'],
    repoUrl: 'https://github.com/RobinHil/echo',
    demoUrl: 'https://robinhil.github.io/echo/',
    imageUrl: '/images/projects/echo-saisie.jpg',
    gallery: ['/images/projects/echo-resultat.jpg', '/images/projects/echo-historique.jpg'],
  },
  {
    title: 'LifeGlobe, le jeu de la vie sur un globe',
    description:
      'Le jeu de la vie de Conway projeté sur une Terre en 3D : les cellules ne vivent que sur les continents '
      + 'émergés, les océans restent vides. Deux rendus, hologramme et réaliste, une grille configurable jusqu\'à '
      + '2880 × 1440 cellules, et un suivi de la population génération par génération.',
    tags: ['React', 'TypeScript', 'Three.js', 'WebGL', 'Zustand', 'Vite'],
    repoUrl: 'https://github.com/RobinHil/lifeglobe',
    demoUrl: 'https://robinhil.github.io/lifeglobe/',
    imageUrl: '/images/projects/lifeglobe-hologramme.jpg',
    gallery: [
      '/images/projects/lifeglobe-replie.jpg',
      '/images/projects/lifeglobe-realiste.jpg',
      '/images/projects/lifeglobe-dense.jpg',
    ],
  },
  {
    title: "Vélib' Paris, carte en temps réel",
    description:
      "Les quelque 1500 stations Vélib' de Paris sur une carte, avec les vélos et les places disponibles en direct "
      + "depuis l'open data de la Ville de Paris. Regroupement en clusters qui se déplient au zoom, rafraîchissement "
      + 'toutes les deux minutes trente sans reconstruire les marqueurs, et mode plein écran.',
    tags: ['JavaScript', 'Leaflet', 'SCSS', 'Webpack', 'Open data'],
    repoUrl: 'https://github.com/RobinHil/ve-lib-paris',
    demoUrl: 'https://robinhil.github.io/ve-lib-paris/',
    imageUrl: '/images/projects/velib-carte.jpg',
    gallery: ['/images/projects/velib-station.jpg', '/images/projects/velib-zoom.jpg'],
  },
  {
    title: 'InfoCrypto, suivi des cryptomonnaies',
    description:
      'Les cent premières capitalisations, actualisées chaque minute depuis l\'API CoinGecko, avec une recherche '
      + 'sur l\'index complet et une fiche par monnaie : prix courant, variation sur 24 heures, rang de '
      + 'capitalisation, offre en circulation et deux graphiques de prix.',
    tags: ['JavaScript', 'Chart.js', 'Bootstrap', 'Mustache', 'Webpack', 'API CoinGecko'],
    repoUrl: 'https://github.com/RobinHil/info-crypto',
    demoUrl: 'https://robinhil.github.io/info-crypto/',
    imageUrl: '/images/projects/infocrypto-grille.jpg',
    gallery: ['/images/projects/infocrypto-fiche.jpg'],
  },
  {
    title: 'React Slides, des présentations en composants',
    description:
      "Une bibliothèque pour écrire ses présentations en React : chaque diapositive est un composant assemblé à "
      + "partir de primitives de mise en page et de contenu. Navigation au clavier, vue mosaïque, plein écran, "
      + 'thème partagé, Markdown et coloration syntaxique.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Markdown'],
    repoUrl: 'https://github.com/RobinHil/react-slides',
    demoUrl: 'https://robinhil.github.io/react-slides/',
    imageUrl: '/images/projects/react-slides-titre.jpg',
    gallery: [
      '/images/projects/react-slides-code.jpg',
      '/images/projects/react-slides-markdown.jpg',
      '/images/projects/react-slides-tables.jpg',
      '/images/projects/react-slides-couleurs.jpg',
    ],
  },
  {
    title: 'APOD Wallpaper, le ciel du jour en fond d\'écran',
    description:
      "Une application de bureau qui récupère chaque jour l'image astronomique du jour publiée par la NASA et la "
      + 'pose en fond d\'écran. Elle vit dans la zone de notification, sans fenêtre le reste du temps. Trois modes : '
      + 'image du jour, date au hasard dans les archives depuis 1995, ou date choisie. Les images plus petites que '
      + 'l\'écran sont posées sur un flou d\'elles-mêmes plutôt que déformées, et les entrées vidéo sont ramenées à '
      + 'une image fixe. Écrite en Rust avec Tauri, le panneau de réglages en React. Publiée pour macOS et pour '
      + 'GNOME - paquets Debian, RPM, Arch et AppImage - avec Windows pour objectif restant : seules quatre choses '
      + 'sont propres à un système, tout le reste est partagé.',
    tags: ['Rust', 'Tauri 2', 'React', 'TypeScript', 'macOS', 'Linux GNOME', 'API NASA'],
    repoUrl: 'https://github.com/RobinHil/apod-wallpaper',
    demoUrl: 'https://robinhil.github.io/apod-wallpaper/',
    // Fonds d'ecran reellement produits par l'application, recuperes dans son
    // stockage. Le premier est celui du jour. Les deux suivants sont des images
    // NASA du domaine public, choisies pour cela : les APOD signees par un
    // photographe restent la propriete de leur auteur.
    imageUrl: '/images/projects/apod-aujourdhui.jpg',
    gallery: [
      '/images/projects/apod-interface.jpg',
      '/images/projects/apod-webb.jpg',
      '/images/projects/apod-horsehead.jpg',
    ],
  },
  {
    title: 'WLKOM, un rootkit Linux pédagogique',
    description:
      "Un rootkit Linux écrit en module kernel, avec deux objectifs : apprendre la logique interne de Linux, "
      + 'de son kernel et de ses modules, et comprendre par où un système se fait prendre. '
      + 'Chargé sur une machine victime, il rappelle de lui-même la machine de contrôle et attend des ordres, se '
      + "reconnecte s'il perd le lien et survit au redémarrage. Il se retire des listes de modules, masque des "
      + 'lignes dans les fichiers en détournant un appel système de lecture, et obfusque ses échanges. En face, '
      + "un programme d'administration en terminal reçoit la connexion, authentifie le module et lui passe des "
      + 'commandes. Le tout se déroule entre deux machines virtuelles isolées, jamais sur une machine réelle.',
    tags: ['C', 'Module kernel Linux', 'Hook syscall', 'Python', 'Sockets TCP', 'QEMU', 'Argon2'],
    // Pas de demo, et c'est heureux : le module ne se charge que dans une VM
    // jetable. Le depot, lui, est public depuis qu'il a ete nettoye de ses
    // references d'origine.
    repoUrl: 'https://github.com/RobinHil/wlkom-rootkit',
    demoUrl: null,
    // Le rootkit vise un Linux x86_64 et ne peut pas tourner ici : le serveur
    // du programme attaquant utilise des options de socket propres a Linux.
    //
    // La console est donc le rendu de sa propre fonction d'affichage, appelee
    // avec les formats de messages qu'il produit reellement. Les ecrans de
    // configuration et de connexion, eux, sont du Python portable : cette
    // seconde capture est leur sortie authentique, obtenue en les executant.
    imageUrl: '/images/projects/rootkit-tui.jpg',
    gallery: ['/images/projects/rootkit-login.jpg'],
  },
])

/*
 * Ce que consommaient les pages via /api/about : meme forme, pour que les
 * gabarits n'aient pas eu a changer en perdant leur API.
 */
export const ABOUT = {
  profile: PROFILE,
  education: EDUCATION,
  certifications: CERTIFICATIONS,
  experience: EXPERIENCE,
  hardSkills: SKILLS.filter(s => s.type === 'hard'),
  softSkills: SKILLS.filter(s => s.type === 'soft'),
  languages: SKILLS.filter(s => s.type === 'language'),
  interests: INTERESTS,
}
