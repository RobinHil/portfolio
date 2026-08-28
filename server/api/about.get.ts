// Données agrégées de la page "À propos" (une seule requête côté client)
export default defineEventHandler(async () => {
  const [profile, education, certifications, experience, skills, interests] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.education.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.certification.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.interest.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
  ])

  return {
    profile,
    education,
    certifications,
    experience,
    hardSkills: skills.filter(s => s.type === 'hard'),
    softSkills: skills.filter(s => s.type === 'soft'),
    languages: skills.filter(s => s.type === 'language'),
    interests,
  }
})
