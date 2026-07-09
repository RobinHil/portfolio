import PDFDocument from 'pdfkit'

/**
 * Génération du CV en PDF à la volée, à partir des données de la base.
 *
 * Contraintes ATS respectées :
 *  - texte réel et sélectionnable (aucune rasterisation)
 *  - une seule colonne, mise en page linéaire, pas de tableaux
 *  - titres de sections standards (Formation, Expérience professionnelle, Compétences, Langues)
 *  - police standard (Helvetica)
 */
export default defineEventHandler(async (event) => {
  const [profile, education, experience, skills, interests] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.education.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.interest.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
  ])

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profil non initialisé' })
  }

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 56, bottom: 56, left: 56, right: 56 },
    info: {
      Title: `CV - ${profile.fullName}`,
      Author: profile.fullName,
      Subject: profile.title,
    },
  })

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  const BLACK = '#111111'
  const GRAY = '#444444'

  const sectionTitle = (title: string) => {
    doc.moveDown(1.2)
    doc.font('Helvetica-Bold').fontSize(13).fillColor(BLACK).text(title.toUpperCase())
    doc.moveTo(doc.page.margins.left, doc.y + 2)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
      .lineWidth(0.8)
      .strokeColor('#999999')
      .stroke()
    doc.moveDown(0.6)
  }

  // --- En-tête ---
  doc.font('Helvetica-Bold').fontSize(22).fillColor(BLACK).text(profile.fullName)
  doc.moveDown(0.2)
  doc.font('Helvetica').fontSize(12).fillColor(GRAY).text(profile.title)
  doc.moveDown(0.4)
  const contactLine = [profile.email, profile.location, profile.linkedin, profile.github]
    .filter(Boolean)
    .join('  ·  ')
  doc.fontSize(9.5).fillColor(GRAY).text(contactLine)

  // --- Profil ---
  sectionTitle('Profil')
  doc.font('Helvetica').fontSize(10.5).fillColor(BLACK).text(profile.intro, { lineGap: 2 })

  // --- Expérience professionnelle ---
  sectionTitle('Expérience professionnelle')
  experience.forEach((exp, i) => {
    if (i > 0) doc.moveDown(0.7)
    doc.font('Helvetica-Bold').fontSize(11).fillColor(BLACK).text(`${exp.role} - ${exp.company}`)
    doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(GRAY).text(exp.period)
    doc.moveDown(0.15)
    doc.font('Helvetica').fontSize(10).fillColor(BLACK).text(exp.description, { lineGap: 1.5 })
  })

  // --- Formation ---
  sectionTitle('Formation')
  education.forEach((edu, i) => {
    if (i > 0) doc.moveDown(0.7)
    doc.font('Helvetica-Bold').fontSize(11).fillColor(BLACK).text(`${edu.title} - ${edu.institution}`)
    doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(GRAY).text(edu.period)
    if (edu.description) {
      doc.moveDown(0.15)
      doc.font('Helvetica').fontSize(10).fillColor(BLACK).text(edu.description, { lineGap: 1.5 })
    }
  })

  // --- Compétences ---
  sectionTitle('Compétences')
  const hard = skills.filter(s => s.type === 'hard')
  const categories = [...new Set(hard.map(s => s.category ?? 'Autres'))]
  categories.forEach((cat) => {
    const names = hard.filter(s => (s.category ?? 'Autres') === cat).map(s => s.name)
    doc.font('Helvetica-Bold').fontSize(10).fillColor(BLACK).text(`${cat} : `, { continued: true })
    doc.font('Helvetica').text(names.join(', '), { lineGap: 1.5 })
    doc.moveDown(0.2)
  })
  const soft = skills.filter(s => s.type === 'soft')
  if (soft.length > 0) {
    doc.font('Helvetica-Bold').fontSize(10).fillColor(BLACK).text('Savoir-être : ', { continued: true })
    doc.font('Helvetica').text(soft.map(s => s.name).join(', '), { lineGap: 1.5 })
  }

  // --- Langues ---
  const languages = skills.filter(s => s.type === 'language')
  if (languages.length > 0) {
    sectionTitle('Langues')
    languages.forEach((lang) => {
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BLACK).text(`${lang.name}`, { continued: true })
      doc.font('Helvetica').text(lang.detail ? ` - ${lang.detail}` : '', { lineGap: 1.5 })
    })
  }

  // --- Centres d'intérêt ---
  if (interests.length > 0) {
    sectionTitle("Centres d'intérêt")
    doc.font('Helvetica').fontSize(10).fillColor(BLACK)
      .text(interests.map(i => i.label).join(', '), { lineGap: 1.5 })
  }

  doc.end()
  const pdf = await done

  const safeName = profile.fullName.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="cv-${safeName}.pdf"`)
  return pdf
})
