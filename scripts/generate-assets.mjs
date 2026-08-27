/**
 * Génère les assets statiques (favicons, image Open Graph, photo de profil placeholder).
 * Usage : node scripts/generate-assets.mjs
 */
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = p => path.join(root, 'public', p)

await mkdir(pub('images'), { recursive: true })

// --- Favicon SVG (source vectorielle) ---
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0a0f0b"/>
  <rect x="2" y="2" width="60" height="60" rx="10" fill="none" stroke="#1d2b20" stroke-width="2"/>
  <path d="M14 22 L26 32 L14 42" fill="none" stroke="#00ff41" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="32" y="38" width="18" height="6" rx="2" fill="#00ff41"/>
</svg>`
await writeFile(pub('favicon.svg'), faviconSvg)

for (const [size, name] of [[16, 'favicon-16x16.png'], [32, 'favicon-32x32.png'], [180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  await sharp(Buffer.from(faviconSvg)).resize(size, size).png().toFile(pub(name))
}

// --- Image Open Graph 1200×630 ---
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0f0b"/>
  <rect x="80" y="90" width="1040" height="450" rx="14" fill="#0e1510" stroke="#1d2b20" stroke-width="2"/>
  <rect x="80" y="90" width="1040" height="54" rx="14" fill="#050807"/>
  <circle cx="118" cy="117" r="9" fill="#ff6b6b"/>
  <circle cx="148" cy="117" r="9" fill="#ffb454"/>
  <circle cx="178" cy="117" r="9" fill="#00ff41"/>
  <text x="130" y="230" font-family="monospace" font-size="34" fill="#94ab98">visiteur@portfolio:~$ whoami</text>
  <text x="130" y="310" font-family="monospace" font-size="52" font-weight="bold" fill="#00ff41">Robin HILAIRE</text>
  <text x="130" y="375" font-family="monospace" font-size="32" fill="#d7e6d9">Ingénieur cybersécurité</text>
  <text x="130" y="425" font-family="monospace" font-size="32" fill="#d7e6d9">en alternance</text>
  <text x="130" y="495" font-family="monospace" font-size="26" fill="#94ab98">projets · compétences · contact</text>
  <rect x="620" y="470" width="26" height="38" fill="#00ff41"/>
</svg>`
await sharp(Buffer.from(ogSvg)).png().toFile(pub('images/og.png'))

// --- Photo de profil ---
// public/images/profile.jpg est une vraie photo, versionnée : ce script ne la
// régénère pas, sinon chaque exécution l'écraserait par un placeholder.

// --- Web manifest ---
await writeFile(pub('site.webmanifest'), JSON.stringify({
  name: 'Portfolio - Robin HILAIRE',
  short_name: 'rh@portfolio',
  description: 'Portfolio de Robin HILAIRE, élève ingénieur en cybersécurité.',
  lang: 'fr',
  start_url: '/',
  display: 'browser',
  background_color: '#0a0f0b',
  theme_color: '#0a0f0b',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2))

console.log('Assets générés dans public/.')
