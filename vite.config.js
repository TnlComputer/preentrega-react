import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'
import catalogoApi from './server/catalogoApi.js'

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  // '' carga también las variables sin VITE_
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Base de GitHub Pages en build y preview
    base: command === 'build' || isPreview ? '/preentrega-react/' : '/',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      catalogoApi({ email: env.ADMIN_EMAIL, contrasenia: env.ADMIN_PASSWORD, claveImgbb: env.IMGBB_KEY })
    ],
    css: {
      modules: {
        // .team-card se usa como styles.teamCard
        localsConvention: 'camelCase'
      }
    },
  }
})
