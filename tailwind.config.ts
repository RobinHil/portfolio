import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      colors: {
        term: {
          // Fond de page (le plus sombre, gris neutre)
          bg: '#09090b',
          // Panneaux / fenêtres : nettement plus clairs que le fond pour détacher les blocs
          panel: '#131316',
          // Barres de titre, éléments surélevés, hover
          panel2: '#1c1c20',
          border: '#2c2c32',
          // Accent "matrix"
          green: '#00ff41',
          greendark: '#00c433',
          // Texte courant et texte secondaire (gris neutres, sans teinte verte)
          text: '#e8e8ea',
          dim: '#9c9ca3',
          amber: '#ffb454',
          red: '#ff6b6b',
          cyan: '#67e8f9',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
    },
  },
}
