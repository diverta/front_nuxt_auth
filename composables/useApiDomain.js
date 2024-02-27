import { ref, computed, watch, onMounted } from 'vue';

export const useApiDomain = () => {
  const sitekey = ref('dev-nuxt-auth');
  const apiDomain = computed(() => {
    if (!sitekey.value || sitekey.value === 'dev-nuxt-auth') {
      return 'https://dev-nuxt-auth.a.kuroco.app';
    }
    return `https://${sitekey.value}.g.kuroco.app`;
  });

  // Watch for changes in sitekey and update localStorage accordingly
  watch(sitekey, (newValue) => {
    if (process.client) {
      localStorage.setItem('sitekey', newValue);
    }
  });

  // Initialize sitekey from localStorage on client side
  onMounted(() => {
    if (process.client) {
      const storedSitekey = localStorage.getItem('sitekey');
      if (storedSitekey) {
        sitekey.value = storedSitekey;
      }
    }
  });

  return { apiDomain, sitekey };
};
