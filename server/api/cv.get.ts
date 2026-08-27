import PDFDocument from 'pdfkit'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getUploadsDir } from '../utils/uploads'

/**
 * Génération du CV en PDF à la volée, à partir des données de la base.
 *
 * Contraintes ATS respectées :
 *  - texte réel et sélectionnable (aucune rasterisation) ; la photo est un objet
 *    image indépendant, purement décoratif, qui ne perturbe pas l'extraction
 *  - une seule colonne, mise en page linéaire, pas de tableaux
 *  - titres de sections standards (Formation, Expérience professionnelle, Compétences, Langues)
 *  - police standard (Helvetica)
 *
 * Contrainte "une seule page" : le rendu est effectué avec un facteur d'échelle
 * appliqué aux tailles de police et aux espacements, réduit itérativement
 * jusqu'à ce que tout le contenu tienne sur une page A4.
 */

type CvData = {
  profile: NonNullable<Awaited<ReturnType<typeof loadData>>['profile']>
  education: Awaited<ReturnType<typeof loadData>>['education']
  experience: Awaited<ReturnType<typeof loadData>>['experience']
  skills: Awaited<ReturnType<typeof loadData>>['skills']
  interests: Awaited<ReturnType<typeof loadData>>['interests']
}

async function loadData() {
  const [profile, education, experience, skills, interests] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.education.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.interest.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
  ])
  return { profile, education, experience, skills, interests }
}

async function loadPhoto(photoUrl: string | null | undefined): Promise<Buffer | null> {
  // Profil sans photo : le CV se génère sans image plutôt que de renvoyer un 500.
  if (!photoUrl) return null

  if (/^https:\/\//.test(photoUrl)) {
    try {
      const res = await fetch(photoUrl)
      if (res.ok) return Buffer.from(await res.arrayBuffer())
    } catch {
      // photo distante inaccessible : pas de photo dans le CV
    }
    return null
  }

  if (photoUrl.startsWith('/uploads/')) {
    try {
      return await readFile(join(getUploadsDir(), photoUrl.slice('/uploads/'.length)))
    } catch {
      return null
    }
  }

  // /images/… : dev = public/ à la racine du projet - prod = copié dans .output/public/
  const candidates = [
    join(process.cwd(), 'public', photoUrl),
    join(process.cwd(), '.output/public', photoUrl),
  ]
  for (const path of candidates) {
    try {
      return await readFile(path)
    } catch {
      // essaie le chemin suivant
    }
  }
  return null
}

function renderCv(data: CvData, photo: Buffer | null, scale: number): Promise<{ pdf: Buffer, pages: number }> {
  const { profile, education, experience, skills, interests } = data

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 48, bottom: 44, left: 52, right: 52 },
    info: {
      Title: `CV - ${profile.fullName}`,
      Author: profile.fullName,
      Subject: profile.title,
    },
  })

  let pages = 1
  doc.on('pageAdded', () => pages++)

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  const BLACK = '#111111'
  const GRAY = '#444444'

  // Tailles et espacements proportionnels au facteur d'échelle
  const s = (n: number) => Math.max(5.5, n * scale)
  const gap = (n: number) => n * scale
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right

  const sectionTitle = (title: string) => {
    doc.moveDown(gap(1.1))
    doc.font('Helvetica-Bold').fontSize(s(12.5)).fillColor(BLACK).text(title.toUpperCase())
    doc.moveTo(doc.page.margins.left, doc.y + 2)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
      .lineWidth(0.8)
      .strokeColor('#999999')
      .stroke()
    doc.moveDown(gap(0.55))
  }

  // --- Photo (décorative, en haut à droite, découpe circulaire vectorielle) ---
  let headerWidth = contentWidth
  if (photo) {
    const size = 64 // constante : la photo ne grossit pas quand le texte rétrécit
    const x = doc.page.width - doc.page.margins.right - size
    const y = doc.page.margins.top - 4
    const r = size / 2
    doc.save()
    doc.circle(x + r, y + r, r).clip()
    doc.image(photo, x, y, { cover: [size, size], align: 'center', valign: 'center' })
    doc.restore()
    doc.circle(x + r, y + r, r).lineWidth(1).strokeColor('#cccccc').stroke()
    headerWidth = contentWidth - size - 14
  }

  // --- En-tête ---
  doc.font('Helvetica-Bold').fontSize(s(21)).fillColor(BLACK).text(profile.fullName, { width: headerWidth })
  doc.moveDown(gap(0.15))
  doc.font('Helvetica').fontSize(s(11.5)).fillColor(GRAY).text(profile.title, { width: headerWidth })
  doc.moveDown(gap(0.35))
  const contactLine = [profile.email, profile.location, profile.linkedin, profile.github]
    .filter(Boolean)
    .join('  ·  ')
  doc.fontSize(s(9)).fillColor(GRAY).text(contactLine, { width: headerWidth })

  // --- Profil ---
  sectionTitle('Profil')
  doc.font('Helvetica').fontSize(s(10)).fillColor(BLACK).text(profile.intro, { lineGap: gap(1.8) })

  // --- Expérience professionnelle ---
  sectionTitle('Expérience professionnelle')
  experience.forEach((exp, i) => {
    if (i > 0) doc.moveDown(gap(0.6))
    doc.font('Helvetica-Bold').fontSize(s(10.5)).fillColor(BLACK).text(`${exp.role} - ${exp.company}`)
    doc.font('Helvetica-Oblique').fontSize(s(9)).fillColor(GRAY).text(exp.period)
    doc.moveDown(gap(0.12))
    doc.font('Helvetica').fontSize(s(9.5)).fillColor(BLACK).text(exp.description, { lineGap: gap(1.3) })
  })

  // --- Formation ---
  sectionTitle('Formation')
  education.forEach((edu, i) => {
    if (i > 0) doc.moveDown(gap(0.6))
    doc.font('Helvetica-Bold').fontSize(s(10.5)).fillColor(BLACK).text(`${edu.title} - ${edu.institution}`)
    doc.font('Helvetica-Oblique').fontSize(s(9)).fillColor(GRAY).text(edu.period)
    if (edu.description) {
      doc.moveDown(gap(0.12))
      doc.font('Helvetica').fontSize(s(9.5)).fillColor(BLACK).text(edu.description, { lineGap: gap(1.3) })
    }
  })

  // --- Compétences ---
  sectionTitle('Compétences')
  const hard = skills.filter(sk => sk.type === 'hard')
  const categories = [...new Set(hard.map(sk => sk.category ?? 'Autres'))]
  categories.forEach((cat) => {
    const names = hard.filter(sk => (sk.category ?? 'Autres') === cat).map(sk => sk.name)
    doc.font('Helvetica-Bold').fontSize(s(9.5)).fillColor(BLACK).text(`${cat} : `, { continued: true })
    doc.font('Helvetica').text(names.join(', '), { lineGap: gap(1.3) })
    doc.moveDown(gap(0.18))
  })
  const soft = skills.filter(sk => sk.type === 'soft')
  if (soft.length > 0) {
    doc.font('Helvetica-Bold').fontSize(s(9.5)).fillColor(BLACK).text('Savoir-être : ', { continued: true })
    doc.font('Helvetica').text(soft.map(sk => sk.name).join(', '), { lineGap: gap(1.3) })
  }

  // --- Langues ---
  const languages = skills.filter(sk => sk.type === 'language')
  if (languages.length > 0) {
    sectionTitle('Langues')
    doc.font('Helvetica').fontSize(s(9.5)).fillColor(BLACK).text(
      languages.map(lang => lang.detail ? `${lang.name} - ${lang.detail}` : lang.name).join('  ·  '),
      { lineGap: gap(1.3) },
    )
  }

  // --- Centres d'intérêt ---
  if (interests.length > 0) {
    sectionTitle("Centres d'intérêt")
    doc.font('Helvetica').fontSize(s(9.5)).fillColor(BLACK)
      .text(interests.map(i => i.label).join(', '), { lineGap: gap(1.3) })
  }

  doc.end()
  return done.then(pdf => ({ pdf, pages }))
}

export default defineEventHandler(async (event) => {
  const data = await loadData()
  if (!data.profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profil non initialisé' })
  }

  const photo = await loadPhoto(data.profile.photoUrl)

  // Réduit l'échelle jusqu'à tenir sur une seule page A4
  const scales = [1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58, 0.52, 0.46]
  let result = await renderCv(data as CvData, photo, scales[0]!)
  for (const scale of scales.slice(1)) {
    if (result.pages === 1) break
    result = await renderCv(data as CvData, photo, scale)
  }

  const safeName = data.profile.fullName.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="cv-${safeName}.pdf"`)
  return result.pdf
})
