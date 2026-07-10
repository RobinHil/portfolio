/**
 * Au démarrage du serveur :
 *  - crée le compte admin s'il n'existe aucun utilisateur (depuis les variables d'env)
 *  - insère le contenu placeholder si la base est vide
 */
export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  try {
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      const email = config.adminEmail
      const password = config.adminPassword
      if (!email || !password) {
        console.warn('[seed] NUXT_ADMIN_EMAIL / NUXT_ADMIN_PASSWORD non définis - aucun compte admin créé.')
      } else {
        await prisma.user.create({
          data: {
            email,
            password: await hashPassword(password),
            name: config.adminName || 'Admin',
          },
        })
        console.log(`[seed] Compte admin créé : ${email}`)
      }
    }

    const profile = await prisma.profile.findUnique({ where: { id: 1 } })
    if (!profile) {
      await seedContent()
      console.log('[seed] Contenu placeholder inséré.')
    }
  } catch (err) {
    console.error('[seed] Échec de l\'initialisation de la base :', err)
  }
})

async function seedContent() {
  await prisma.profile.create({
    data: {
      id: 1,
      fullName: 'Jean Dupont',
      title: 'Administrateur Systèmes & Réseaux - Cybersécurité',
      intro:
        "Administrateur systèmes passionné par la sécurité informatique, j'aime concevoir des infrastructures fiables, "
        + "automatiser tout ce qui peut l'être et traquer ce qui cloche dans les logs. "
        + "Mon terrain de jeu : Linux, les réseaux, la supervision et la sécurité défensive comme offensive.",
      email: 'contact@example.com',
      linkedin: 'https://www.linkedin.com/in/jean-dupont-placeholder',
      github: 'https://github.com/jdupont-placeholder',
      location: 'Lyon, France',
    },
  })

  await prisma.experience.createMany({
    data: [
      {
        role: 'Analyste SOC junior',
        company: 'CyberGarde SAS',
        period: '2024 - aujourd\'hui',
        description:
          'Surveillance et qualification des alertes de sécurité (SIEM Wazuh/Elastic). Investigation des incidents, '
          + 'rédaction de rapports, amélioration continue des règles de détection et participation aux exercices de crise.',
        order: 0,
      },
      {
        role: 'Administrateur systèmes et réseaux',
        company: 'InfraNova',
        period: '2022 - 2024',
        description:
          'Administration d\'un parc de 300 postes et 40 serveurs Linux/Windows. Migration de la virtualisation vers Proxmox, '
          + 'mise en place de la supervision (Zabbix, Grafana), automatisation des déploiements avec Ansible et durcissement des configurations.',
        order: 1,
      },
      {
        role: 'Technicien support informatique (alternance)',
        company: 'Mairie de Villebonne',
        period: '2020 - 2022',
        description:
          'Support utilisateurs niveau 1/2, gestion Active Directory, déploiement de postes, '
          + 'documentation des procédures et participation à la refonte du réseau (VLAN, Wi-Fi).',
        order: 2,
      },
    ],
  })

  await prisma.education.createMany({
    data: [
      {
        title: 'Master Cybersécurité et administration des systèmes',
        institution: 'Université Claude Bernard - Lyon',
        period: '2022 - 2024',
        description: 'Sécurité des systèmes et réseaux, réponse à incident, cryptographie appliquée, projet de fin d\'études sur la détection d\'intrusion.',
        order: 0,
      },
      {
        title: 'Licence professionnelle Administration de systèmes et réseaux',
        institution: 'IUT de Grenoble',
        period: '2021 - 2022',
        description: 'Administration Linux/Windows, réseaux TCP/IP, virtualisation, scripting.',
        order: 1,
      },
      {
        title: 'BTS Services informatiques aux organisations (SISR)',
        institution: 'Lycée Gustave Eiffel - Dijon',
        period: '2019 - 2021',
        description: null,
        order: 2,
      },
    ],
  })

  await prisma.skill.createMany({
    data: [
      // Hard skills - Système
      { name: 'Linux (Debian, RHEL)', type: 'hard', category: 'Système', order: 0 },
      { name: 'Windows Server / AD', type: 'hard', category: 'Système', order: 1 },
      { name: 'Bash / scripting', type: 'hard', category: 'Système', order: 2 },
      { name: 'Ansible', type: 'hard', category: 'Système', order: 3 },
      { name: 'Proxmox / KVM', type: 'hard', category: 'Système', order: 4 },
      // Hard skills - Réseau
      { name: 'TCP/IP, VLAN, routage', type: 'hard', category: 'Réseau', order: 0 },
      { name: 'pfSense / OPNsense', type: 'hard', category: 'Réseau', order: 1 },
      { name: 'VPN (WireGuard, OpenVPN)', type: 'hard', category: 'Réseau', order: 2 },
      { name: 'DNS / DHCP / PKI', type: 'hard', category: 'Réseau', order: 3 },
      // Hard skills - Sécurité
      { name: 'SIEM (Wazuh, Elastic)', type: 'hard', category: 'Sécurité', order: 0 },
      { name: 'Analyse réseau (Wireshark, Nmap)', type: 'hard', category: 'Sécurité', order: 1 },
      { name: 'Pentest (Burp, Metasploit)', type: 'hard', category: 'Sécurité', order: 2 },
      { name: 'Durcissement (CIS, ANSSI)', type: 'hard', category: 'Sécurité', order: 3 },
      // Hard skills - Dev & Outils
      { name: 'Python', type: 'hard', category: 'Dev & Outils', order: 0 },
      { name: 'Docker / Compose', type: 'hard', category: 'Dev & Outils', order: 1 },
      { name: 'Git / CI-CD', type: 'hard', category: 'Dev & Outils', order: 2 },
      { name: 'Supervision (Zabbix, Grafana)', type: 'hard', category: 'Dev & Outils', order: 3 },
      // Soft skills
      { name: 'Rigueur et sens du détail', type: 'soft', order: 0 },
      { name: 'Esprit d\'analyse', type: 'soft', order: 1 },
      { name: 'Communication et vulgarisation', type: 'soft', order: 2 },
      { name: 'Travail en équipe', type: 'soft', order: 3 },
      { name: 'Sang-froid en gestion d\'incident', type: 'soft', order: 4 },
      // Langues
      { name: 'Français', type: 'language', detail: 'Natif', order: 0 },
      { name: 'Anglais', type: 'language', detail: 'C1 - courant technique', order: 1 },
      { name: 'Espagnol', type: 'language', detail: 'B1', order: 2 },
    ],
  })

  await prisma.interest.createMany({
    data: [
      { label: 'CTF et sécurité offensive (HackTheBox, RootMe)', order: 0 },
      { label: 'Homelab et self-hosting', order: 1 },
      { label: 'Veille technologique et conférences sécurité', order: 2 },
      { label: 'Contribution open source', order: 3 },
      { label: 'Randonnée et trail', order: 4 },
    ],
  })

  await prisma.project.createMany({
    data: [
      {
        title: 'Homelab supervisé et auto-hébergé',
        description:
          'Infrastructure personnelle complète sous Proxmox : services auto-hébergés (Nextcloud, Vaultwarden, Gitea) '
          + 'derrière un reverse proxy, VLAN dédiés, sauvegardes chiffrées automatisées et supervision Zabbix/Grafana avec alerting.',
        tags: JSON.stringify(['Proxmox', 'Docker', 'Ansible', 'Zabbix', 'Grafana', 'WireGuard']),
        repoUrl: 'https://github.com/jdupont-placeholder/homelab',
        demoUrl: null,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
        order: 0,
      },
      {
        title: 'NetProbe - scanner réseau en Python',
        description:
          'Outil en ligne de commande pour cartographier un réseau local : découverte d\'hôtes, scan de ports multi-threadé, '
          + 'détection de services et export des résultats en JSON/HTML. Pensé pour les audits internes et les TP réseau.',
        tags: JSON.stringify(['Python', 'Scapy', 'CLI', 'Réseau']),
        repoUrl: 'https://github.com/jdupont-placeholder/netprobe',
        demoUrl: null,
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
        order: 1,
      },
      {
        title: 'SOC maison avec Wazuh',
        description:
          'Déploiement d\'un mini-SOC : agents Wazuh sur l\'ensemble du homelab, règles de détection personnalisées, '
          + 'tableaux de bord Kibana et playbooks de réponse aux incidents documentés. Simulation d\'attaques pour valider la détection.',
        tags: JSON.stringify(['Wazuh', 'Elastic', 'SIEM', 'Détection', 'Blue Team']),
        repoUrl: 'https://github.com/jdupont-placeholder/soc-wazuh',
        demoUrl: 'https://demo.example.com/soc',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
        order: 2,
      },
      {
        title: 'Hardening automatisé de serveurs Debian',
        description:
          'Collection de rôles Ansible appliquant les recommandations ANSSI/CIS sur des serveurs Debian : SSH, pare-feu nftables, '
          + 'auditd, fail2ban, mises à jour automatiques. Rapport de conformité généré après chaque exécution.',
        tags: JSON.stringify(['Ansible', 'Debian', 'ANSSI', 'nftables', 'Conformité']),
        repoUrl: 'https://github.com/jdupont-placeholder/debian-hardening',
        demoUrl: null,
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop',
        order: 3,
      },
    ],
  })
}
