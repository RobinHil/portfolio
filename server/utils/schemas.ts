import { z } from 'zod'

// Chaîne vide → null (pour les champs optionnels des formulaires)
const emptyToNull = z
  .string()
  .trim()
  .max(5000)
  .optional()
  .nullable()
  .transform(v => (v ? v : null))

// Un seul administrateur : la connexion se fait au mot de passe seul,
// sans identifiant à saisir.
export const loginSchema = z.object({
  password: z.string().min(1).max(200),
})

// URL optionnelle : chaîne vide / null / absent → null
const optionalUrl = z
  .union([z.string().trim().url().max(300), z.literal(''), z.null()])
  .optional()
  .transform(v => (v ? v : null))

// Chemin d'image accepté : URL https (Unsplash…), fichier local /images/… ou upload /uploads/…
const imagePath = z.string().trim().min(1).max(500).refine(
  v => /^https:\/\//.test(v) || /^\/(images|uploads)\//.test(v),
  { message: 'Image invalide : URL https ou chemin /uploads/… attendu' },
)

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  tags: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  repoUrl: optionalUrl,
  demoUrl: optionalUrl,
  imageUrl: imagePath,
  gallery: z.array(imagePath).max(20).default([]),
  order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const educationSchema = z.object({
  title: z.string().trim().min(1).max(200),
  institution: z.string().trim().min(1).max(200),
  period: z.string().trim().min(1).max(100),
  description: emptyToNull,
  order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const experienceSchema = z.object({
  role: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  period: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(5000),
  order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: z.enum(['hard', 'soft', 'language']),
  category: emptyToNull,
  detail: emptyToNull,
  order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const interestSchema = z.object({
  label: z.string().trim().min(1).max(150),
  order: z.coerce.number().int().min(0).max(9999).default(0),
})

export const profileSchema = z.object({
  fullName: z.string().trim().min(1).max(150),
  title: z.string().trim().min(1).max(200),
  intro: z.string().trim().min(1).max(3000),
  email: z.string().trim().email().max(200),
  linkedin: z.string().trim().url().max(300),
  github: z.string().trim().url().max(300),
  location: z.string().trim().max(150).default(''),
  photoUrl: imagePath.default('/images/profile.jpg'),
})

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
})
