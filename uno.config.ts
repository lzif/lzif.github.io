// uno.config.ts
import { defineConfig,presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno({ dark:"media"}),
    presetIcons()
  ]
})
