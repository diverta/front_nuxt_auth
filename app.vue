<template>
  <NuxtLayout>
    <div>
      <NuxtPage />
      <!-- <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1> -->
    </div>
  </NuxtLayout>
</template>

<script setup>
await useAuth().profile();
</script>
