import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      colors: {
        term: {
          // Fond quasi noir légèrement teinté de vert
          bg: '#0a0f0b',
          panel: '#0e1510',
          border: '#1d2b20',
          // Accent "matrix"
          green: '#00ff41',
          greendark: '#00c433',
          // Texte courant (contraste AA sur fond sombre)
          text: '#d7e6d9',
          dim: '#94ab98',
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
