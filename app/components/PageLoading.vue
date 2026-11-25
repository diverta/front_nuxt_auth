<template>
    <div :aria-busy="loading">
        <div v-if="loading" class="page-loading" role="status" aria-live="polite">
            <v-progress-circular indeterminate color="#1777ca" :size="48" :width="4" aria-hidden="true" />
            <span>{{ $t('common.loading') }}</span>
        </div>
        <slot v-else />
    </div>
</template>

<script setup>
defineProps({
    loading: { type: Boolean, default: false }
});
</script>

<style scoped>
.page-loading {
    display: flex;
    min-height: 50vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: #1f3952;
}

@media (prefers-reduced-motion: reduce) {
    .page-loading :deep(.v-progress-circular__overlay),
    .page-loading :deep(svg) {
        animation: none;
    }
}
</style>
