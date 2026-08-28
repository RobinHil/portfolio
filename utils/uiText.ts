/**
 * Libellés de l'interface centralisés (v1 : français uniquement).
 * Regroupés ici pour faciliter un futur passage FR/EN sans réécrire les composants.
 */
export const UI = {
  site: {
    name: 'jd@portfolio',
    title: 'Jean Dupont - Administrateur Systèmes & Cybersécurité',
    description:
      'Portfolio de Jean Dupont, administrateur systèmes et réseaux spécialisé en cybersécurité : projets, compétences, parcours et contact.',
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
    metaTitle: 'Jean Dupont - Administrateur Systèmes & Cybersécurité',
    metaDescription:
      'Portfolio interactif façon terminal : découvrez mon parcours d\'administrateur systèmes et réseaux orienté cybersécurité, mes projets et mes compétences.',
    terminalTitle: 'visiteur@portfolio: ~',
    hint: 'Tapez une commande (ex: help) ou utilisez le menu de navigation en haut de page.',
  },
  about: {
    metaTitle: 'À propos - parcours, formation et compétences',
    metaDescription:
      'Formation, expérience professionnelle, compétences techniques (système, réseau, sécurité, dev), soft skills et langues de Jean Dupont.',
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
    photoAlt: 'Photo de profil de Jean Dupont',
  },
  projects: {
    metaTitle: 'Projets - infrastructures, outils et sécurité',
    metaDescription:
      'Sélection de projets : homelab supervisé, outils réseau en Python, SOC Wazuh, hardening automatisé de serveurs Debian.',
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
      'Contactez Jean Dupont : formulaire de contact, email, LinkedIn et GitHub.',
    h1: 'Contact',
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
