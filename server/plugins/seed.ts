import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ensureUploadsDir } from '../utils/uploads'

/**
 * Au démarrage du serveur :
 *  - crée le compte admin s'il n'existe aucun utilisateur (depuis les variables d'env)
 *  - insère le contenu du profil si la base est vide
 *
 * ─── Images des projets ───
 * Déposez les fichiers (jpg/png/webp/gif/avif) dans `seed/images/` puis référencez
 * leur nom dans SEED_PROJECTS ci-dessous (champs `image` et `gallery`), AVANT le
 * premier démarrage. Ils seront importés automatiquement dans le stockage d'uploads
 * (même mécanique que l'upload admin). Une URL https (ex: Unsplash) est aussi acceptée.
 */
// L'authentification repose sur ce seul secret : on alerte s'il est trop court.
const MIN_ADMIN_PASSWORD_LENGTH = 12

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  try {
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      const password = config.adminPassword
      // La connexion se fait au mot de passe seul : l'email n'est plus un
      // identifiant, seulement un libellé affiché dans l'admin.
      const email = config.adminEmail || 'admin@local'

      if (!password) {
        console.warn('[seed] NUXT_ADMIN_PASSWORD non défini - aucun compte admin créé.')
      } else {
        if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
          console.warn(
            `[seed] ATTENTION : NUXT_ADMIN_PASSWORD fait moins de ${MIN_ADMIN_PASSWORD_LENGTH} caractères. `
            + 'L\'accès admin ne tient qu\'à ce seul secret - choisissez-en un long.',
          )
        }
        await prisma.user.create({
          data: {
            email,
            password: await hashPassword(password),
            name: config.adminName || 'Admin',
          },
        })
        console.log('[seed] Compte admin créé (connexion par mot de passe seul).')
      }
    }

    const profile = await prisma.profile.findUnique({ where: { id: 1 } })
    if (!profile) {
      await seedContent()
      console.log('[seed] Contenu du profil inséré.')
    }
  } catch (err) {
    console.error('[seed] Échec de l\'initialisation de la base :', err)
  }
})

async function seedContent() {
  await prisma.profile.create({
    data: {
      id: 1,
      fullName: 'Robin HILAIRE',
      title: 'Ingénieur cybersécurité en alternance',
      intro:
        "Je construis des applications web de bout en bout, du schéma de base de données au reverse proxy qui les sert, "
        + "et j'héberge la plupart moi-même. Ce qui m'intéresse dans la cybersécurité, c'est le concret : durcir ce qu'on "
        + "vient d'écrire, comprendre par où ça casse, garder un déploiement reproductible. Diplômé d'un BUT Informatique, "
        + "je poursuis en école d'ingénieur en alternance, majeure cybersécurité.",
      email: 'hilairerob84@gmail.com',
      linkedin: 'https://www.linkedin.com/in/hilaire-robin',
      github: 'https://github.com/RobinHil',
      location: 'Paris, France',
      photoUrl: '/images/profile.jpg',
    },
  })

  // TODO Robin : l'alternance en cours (depuis septembre 2025) manque ici - le nom
  // de l'entreprise n'était sur aucun des documents fournis. À ajouter depuis /admin,
  // ou ici avant le premier démarrage, avec order: 0 et un décalage des suivants.
  await prisma.experience.createMany({
    data: [
      {
        role: 'Alternant, service technique',
        company: 'Aix-Marseille Université, Arles',
        period: 'Octobre 2024 - Juillet 2025',
        description:
          "Développement d'une solution de RAG destinée aux étudiants de l'université, alimentée par les cours des "
          + "enseignants : déploiement d'Ollama et LocalAI sous Docker, indexation dans une base de données vectorielle "
          + 'et chaîne de requêtes aux modèles construite avec LangChain.',
        order: 0,
      },
      {
        role: 'Stagiaire, service technique et médical',
        company: 'OPALE, Paris 12e',
        period: 'Avril - Juin 2024',
        description:
          "Mise en place et maintenance, matérielle et logicielle, d'un serveur d'imagerie médicale (PACS). "
          + 'Conteneurisation Docker des services associés (SSO, journalisation), sécurisation de '
          + "l'infrastructure par un SSO OpenID Connect, et R&D sur l'architecture déployée pour y intégrer "
          + 'de nouvelles solutions.',
        order: 1,
      },
      {
        role: 'Vacataire, cuisine centrale',
        company: 'Mairie de Sorgues',
        period: 'Août 2022 et 2023',
        description: 'Renfort estival en cuisine centrale municipale, sur deux saisons.',
        order: 2,
      },
    ],
  })

  await prisma.education.createMany({
    data: [
      {
        title: "Diplôme d'ingénieur en informatique, majeure cybersécurité",
        institution: 'EPITA',
        period: '2025 - 2028 (en cours)',
        description: 'Cycle ingénieur en alternance, spécialisation cybersécurité.',
        order: 0,
      },
      {
        title: 'BUT Informatique',
        institution: "IUT d'Arles, Aix-Marseille Université",
        period: '2022 - 2025',
        description: "Parcours « réalisation d'applications : conception, développement, validation ».",
        order: 1,
      },
      {
        title: 'Baccalauréat général, mention bien',
        institution: 'Lycée Frédéric Mistral, Avignon',
        period: '2022',
        description: 'Spécialités mathématiques et informatique, option européenne anglais.',
        order: 2,
      },
    ],
  })

  await prisma.skill.createMany({
    data: [
      // Hard skills - Langages
      { name: 'C, C++', type: 'hard', category: 'Langages', order: 0 },
      { name: 'Python', type: 'hard', category: 'Langages', order: 1 },
      { name: 'JavaScript, TypeScript', type: 'hard', category: 'Langages', order: 2 },
      { name: 'Java', type: 'hard', category: 'Langages', order: 3 },
      { name: 'PHP', type: 'hard', category: 'Langages', order: 4 },
      { name: 'SQL', type: 'hard', category: 'Langages', order: 5 },
      { name: 'Bash', type: 'hard', category: 'Langages', order: 6 },
      // Hard skills - Développement web
      { name: 'Vue, Nuxt', type: 'hard', category: 'Développement web', order: 0 },
      { name: 'React, Next.js', type: 'hard', category: 'Développement web', order: 1 },
      { name: 'Angular, Ionic', type: 'hard', category: 'Développement web', order: 2 },
      { name: 'Node.js, Express', type: 'hard', category: 'Développement web', order: 3 },
      { name: 'Tailwind CSS, Sass', type: 'hard', category: 'Développement web', order: 4 },
      { name: 'Three.js, WebGL', type: 'hard', category: 'Développement web', order: 5 },
      { name: 'Prisma', type: 'hard', category: 'Développement web', order: 6 },
      { name: 'PostgreSQL, MySQL, SQLite', type: 'hard', category: 'Développement web', order: 7 },
      // Hard skills - Systèmes et réseau
      { name: 'Linux (Debian, Ubuntu)', type: 'hard', category: 'Systèmes et réseau', order: 0 },
      { name: 'Docker et Compose', type: 'hard', category: 'Systèmes et réseau', order: 1 },
      { name: 'nginx, Caddy', type: 'hard', category: 'Systèmes et réseau', order: 2 },
      { name: 'Administration de VPS', type: 'hard', category: 'Systèmes et réseau', order: 3 },
      { name: 'Git, intégration continue', type: 'hard', category: 'Systèmes et réseau', order: 4 },
      { name: 'Vite, Webpack', type: 'hard', category: 'Systèmes et réseau', order: 5 },
      { name: 'Qt, PyQt', type: 'hard', category: 'Systèmes et réseau', order: 6 },
      // Hard skills - Sécurité
      { name: 'Durcissement applicatif (CSP, CSRF, en-têtes)', type: 'hard', category: 'Sécurité', order: 0 },
      { name: 'Authentification, sessions, hachage', type: 'hard', category: 'Sécurité', order: 1 },
      { name: 'SSO et OpenID Connect', type: 'hard', category: 'Sécurité', order: 2 },
      { name: 'Reverse proxy et TLS', type: 'hard', category: 'Sécurité', order: 3 },
      { name: 'Limitation de débit et anti-abus', type: 'hard', category: 'Sécurité', order: 4 },
      { name: 'Veille et gestion des vulnérabilités', type: 'hard', category: 'Sécurité', order: 5 },
      // Soft skills
      { name: 'Autonomie', type: 'soft', order: 0 },
      { name: 'Curiosité', type: 'soft', order: 1 },
      { name: 'Minutie', type: 'soft', order: 2 },
      { name: 'Adaptabilité', type: 'soft', order: 3 },
      { name: 'Travail en équipe', type: 'soft', order: 4 },
      // Langues
      { name: 'Français', type: 'language', detail: 'Langue maternelle', order: 0 },
      { name: 'Anglais', type: 'language', detail: 'B2 - Cambridge Certificate', order: 1 },
    ],
  })

  await prisma.interest.createMany({
    data: [
      { label: 'Musique : basse, guitare, chant, composition', order: 0 },
      { label: 'Cuisine', order: 1 },
      { label: 'Photographie', order: 2 },
      { label: 'Cinéma', order: 3 },
      { label: 'Auto-hébergement et homelab', order: 4 },
    ],
  })

  const projectsData = []
  for (const p of SEED_PROJECTS) {
    projectsData.push({
      title: p.title,
      description: p.description,
      tags: JSON.stringify(p.tags),
      repoUrl: p.repoUrl,
      demoUrl: p.demoUrl,
      imageUrl: await resolveSeedImage(p.image) ?? '/images/og.png',
      gallery: JSON.stringify(
        (await Promise.all(p.gallery.map(resolveSeedImage))).filter((u): u is string => !!u),
      ),
      order: p.order,
    })
  }
  await prisma.project.createMany({ data: projectsData })
}

/* ----------------------------------------------------------------
 * Projets affichés sur /projets.
 * `image` / `gallery` : nom d'un fichier de `seed/images/` (recommandé)
 * ou URL https complète. `repoUrl` / `demoUrl` : URL ou null.
 *
 * Les `demoUrl` pointent vers les sous-domaines prévus au déploiement :
 * ils ne répondront qu'une fois robinhi.fr enregistré et les applications
 * mises en ligne.
 * ---------------------------------------------------------------- */
const SEED_PROJECTS = [
  {
    title: 'Records, une collection de disques au mur',
    description:
      "Une galerie pour une collection de vinyles et de CD. La collection elle-même vit sur Discogs ; l'application "
      + "l'y synchronise vers sa propre base SQLite, puis ajoute ce que Discogs ne propose pas : un mur de pochettes, "
      + 'un ordre manuel, des favoris et un filtrage instantané. Back-office protégé, synchronisation quotidienne '
      + 'programmée, et suppression douce pour ne jamais perdre un disque retiré de la collection.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind CSS', 'API Discogs', 'Docker'],
    repoUrl: 'https://github.com/RobinHil/records',
    demoUrl: 'https://records.robinhi.fr',
    image: 'records-mur.jpg',
    gallery: ['records-fiche.jpg'],
    order: 0,
  },
  {
    title: 'Ce portfolio',
    description:
      "Le site que vous lisez. Une façade terminal interactive (démarrage animé, navigation par commandes, "
      + "autocomplétion, historique) doublée d'une navigation classique toujours visible, un back-office pour éditer "
      + 'chaque section sans toucher au code, et un CV PDF compatible ATS généré à la volée depuis la base.',
    tags: ['Nuxt', 'Vue', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind CSS', 'Docker'],
    repoUrl: 'https://github.com/RobinHil/portfolio',
    demoUrl: 'https://portfolio.robinhi.fr',
    image: 'portfolio-terminal.jpg',
    gallery: ['portfolio-projets.jpg'],
    order: 1,
  },
  {
    title: "Echo, sonification de textes et d'images",
    description:
      'Transforme un texte ou une image en pièce musicale, entièrement dans le navigateur. Aucune IA générative : '
      + "un mapping déterministe entre les caractéristiques de l'entrée et des paramètres musicaux, rendu hors-ligne "
      + 'par Tone.js, puis exporté en MP3, FLAC, WAV ou OGG via ffmpeg compilé en WebAssembly. Aucune donnée ne quitte '
      + 'la machine, et le même contenu produit toujours exactement le même son.',
    tags: ['React', 'TypeScript', 'Tone.js', 'Web Audio', 'ffmpeg.wasm', 'Vite'],
    repoUrl: 'https://github.com/RobinHil/echo',
    demoUrl: 'https://echo.robinhi.fr',
    image: 'echo-lecteur.jpg',
    gallery: ['echo-saisie.jpg'],
    order: 2,
  },
  {
    title: 'LifeGlobe, le jeu de la vie sur un globe',
    description:
      'Le jeu de la vie de Conway projeté sur une Terre en 3D : les cellules ne vivent que sur les continents '
      + 'émergés, les océans restent vides. Deux rendus, hologramme et satellite, une grille configurable jusqu\'à '
      + '2880 × 1440 cellules, et un suivi de la population génération par génération.',
    tags: ['React', 'TypeScript', 'Three.js', 'WebGL', 'Zustand', 'Vite'],
    repoUrl: 'https://github.com/RobinHil/lifeglobe',
    demoUrl: 'https://lifeglobe.robinhi.fr',
    image: 'lifeglobe-hologramme.jpg',
    gallery: ['lifeglobe-continents.jpg'],
    order: 3,
  },
  {
    title: "Vélib' Paris, carte en temps réel",
    description:
      "Les quelque 1500 stations Vélib' de Paris sur une carte, avec les vélos et les places disponibles en direct "
      + "depuis l'open data de la Ville de Paris. Regroupement en clusters qui se déplient au zoom, rafraîchissement "
      + 'toutes les deux minutes trente sans reconstruire les marqueurs, et mode plein écran.',
    tags: ['JavaScript', 'Leaflet', 'SCSS', 'Webpack', 'Open data'],
    repoUrl: 'https://github.com/RobinHil/ve-lib-paris',
    demoUrl: 'https://velib.robinhi.fr',
    image: 'velib-carte.jpg',
    gallery: [],
    order: 4,
  },
  {
    title: 'InfoCrypto, suivi des cryptomonnaies',
    description:
      'Les cent premières capitalisations, actualisées chaque minute depuis l\'API CoinGecko, avec une recherche '
      + 'sur l\'index complet et une fiche par monnaie : prix courant, variation sur 24 heures, rang de '
      + 'capitalisation, offre en circulation et deux graphiques de prix.',
    tags: ['JavaScript', 'Chart.js', 'Bootstrap', 'Mustache', 'Webpack', 'API CoinGecko'],
    repoUrl: 'https://github.com/RobinHil/info-crypto',
    demoUrl: 'https://crypto.robinhi.fr',
    image: 'infocrypto-grille.jpg',
    gallery: ['infocrypto-fiche.jpg'],
    order: 5,
  },
  {
    title: 'React Slides, des présentations en composants',
    description:
      "Une bibliothèque pour écrire ses présentations en React : chaque diapositive est un composant assemblé à "
      + "partir de primitives de mise en page et de contenu. Navigation au clavier, vue mosaïque, plein écran, "
      + 'thème partagé, Markdown et coloration syntaxique.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Markdown'],
    repoUrl: 'https://github.com/RobinHil/react-slides',
    demoUrl: 'https://slides.robinhi.fr',
    image: 'react-slides-titre.jpg',
    gallery: ['react-slides-code.jpg'],
    order: 6,
  },
]

/**
 * Résout une référence d'image du seed :
 *  - URL https → renvoyée telle quelle
 *  - nom de fichier → copié depuis seed/images/ vers le stockage d'uploads,
 *    renvoie le chemin public /uploads/seed-<nom> (null si le fichier manque)
 */
async function resolveSeedImage(ref: string): Promise<string | null> {
  if (/^https:\/\//.test(ref)) return ref

  const match = ref.toLowerCase().match(/^(.+)\.(jpg|jpeg|png|webp|gif|avif)$/)
  if (!match) {
    console.warn(`[seed] Image ignorée (extension non supportée) : ${ref}`)
    return null
  }
  const base = match[1]!.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const destName = `seed-${base}.${match[2]}`

  try {
    const dir = await ensureUploadsDir()
    await copyFile(join(process.cwd(), 'seed/images', ref), join(dir, destName))
    return `/uploads/${destName}`
  } catch {
    console.warn(`[seed] Image introuvable dans seed/images/ : ${ref}`)
    return null
  }
}
