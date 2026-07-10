/**
 * Génère des images placeholder pour les projets de démonstration (seed/images/).
 * À remplacer par de vraies captures - voir seed/images/README.md.
 * Usage : node scripts/generate-seed-images.mjs
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'seed/images')
await mkdir(dir, { recursive: true })

const images = [
  ['homelab.jpg', 'homelab/', '#0e1510'],
  ['homelab-rack.jpg', 'homelab/rack', '#101a12'],
  ['homelab-grafana.jpg', 'homelab/grafana', '#0d1812'],
  ['netprobe.jpg', 'netprobe/', '#0f1614'],
  ['soc.jpg', 'soc-wazuh/', '#101418'],
  ['soc-dashboard.jpg', 'soc-wazuh/dashboard', '#0e1316'],
  ['soc-alertes.jpg', 'soc-wazuh/alertes', '#111419'],
  ['hardening.jpg', 'debian-hardening/', '#12160f'],
]

for (const [file, label, bg] of images) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
    <rect width="1200" height="675" fill="${bg}"/>
    <rect x="40" y="40" width="1120" height="595" rx="12" fill="none" stroke="#2a4030" stroke-width="3"/>
    <text x="80" y="330" font-family="monospace" font-size="44" fill="#00ff41">$ ls ~/projets/${label}</text>
    <text x="80" y="395" font-family="monospace" font-size="28" fill="#a9bfad">placeholder - remplacez ce fichier dans seed/images/</text>
    <rect x="80" y="440" width="24" height="40" fill="#00ff41"/>
  </svg>`
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(path.join(dir, file))
}

console.log(`${images.length} images générées dans seed/images/.`)
