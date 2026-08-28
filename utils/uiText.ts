/**
 * Libellés de l'interface centralisés (v1 : français uniquement).
 * Regroupés ici pour faciliter un futur passage FR/EN sans réécrire les composants.
 */
export const UI = {
  site: {
    name: 'rh@portfolio',
    title: 'Robin HILAIRE - Apprenti ingénieur système et cybersécurité',
    description:
      'Portfolio de Robin HILAIRE, apprenti ingénieur en administration système et cybersécurité : projets, compétences, parcours et contact.',
  },
  nav: {
    home: 'accueil',
    about: 'à-propos',
    projects: 'projets',
    contact: 'contact',
    admin: 'admin',
    openMenu: 'Ouvrir le menu de navigation',
    closeMenu: 'Fermer le menu de navigation',
    mainNavLabel: 'Navigation principale',
  },
  home: {
    metaTitle: 'Robin HILAIRE - Apprenti ingénieur système et cybersécurité',
    metaDescription:
      'Portfolio interactif façon terminal : mon parcours d\'apprenti ingénieur en administration système et cybersécurité, mes projets et mes compétences.',
    terminalTitle: 'visiteur@portfolio: ~',
    hint: 'Tapez une commande (ex: help) ou utilisez le menu de navigation en haut de page.',
  },
  about: {
    metaTitle: 'À propos - parcours, formation et compétences',
    metaDescription:
      'Formation, certifications, expérience professionnelle, compétences techniques (langages, développement, systèmes et réseau, sécurité), soft skills et langues de Robin HILAIRE.',
    h1: 'À propos',
    education: 'Formation',
    certifications: 'Certifications',
    experience: 'Expérience professionnelle',
    hardSkills: 'Compétences techniques',
    softSkills: 'Soft skills',
    languages: 'Langues',
    interests: 'Centres d\'intérêt',
    downloadCv: 'Télécharger mon CV (PDF)',
    downloadCvHint: 'PDF généré à partir des données de cette page - format sobre, compatible ATS.',
    photoAlt: 'Photo de profil de Robin HILAIRE',
  },
  projects: {
    metaTitle: 'Projets - applications web, données et sécurité',
    metaDescription:
      'Sélection de projets : galerie de disques synchronisée depuis Discogs, sonification de textes et d\'images, jeu de la vie sur un globe 3D, carte Vélib\' en temps réel.',
    h1: 'Projets',
    repo: 'Code source',
    demo: 'Démo',
    details: 'détails',
    stack: 'Stack technique',
    screenshotAlt: (title: string) => `Illustration du projet ${title}`,
  },
  contact: {
    metaTitle: 'Contact - me joindre',
    metaDescription:
      'Contactez Robin HILAIRE : formulaire de contact, email, LinkedIn et GitHub.',
    h1: 'Contact',
    subtitle: '$ ping -c 1 robin.hilaire - réponse sous 48 h',
    formTitle: './envoyer-un-message.sh',
    linksTitle: 'cat liens.txt',
    name: 'Nom',
    email: 'Email',
    message: 'Message',
    send: 'Envoyer le message',
    sending: 'Envoi en cours…',
    success: 'Message envoyé - je vous répondrai rapidement.',
    error: 'Échec de l\'envoi. Vérifiez les champs et réessayez.',
    rateLimited: 'Trop de messages envoyés en peu de temps. Réessayez dans une minute.',
  },
  notFound: {
    title: 'Page introuvable',
    back: 'Revenir à l\'accueil',
  },
  footer: {
    rights: 'Tous droits réservés.',
    builtWith: 'Propulsé par Nuxt · design "terminal"',
  },
} as const
