import { en, ja } from '@formkit/i18n'
import { defineFormKitConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

export default defineFormKitConfig({
  locales: { en, ja },
  locale: 'en',
})