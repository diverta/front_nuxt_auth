<template>
    <div>
        <v-progress-linear :active="loading" :indeterminate="loading" absolute top color="orange white-4" />
        <template v-if="topicsDetail">
            <!-- <v-row> -->
            <v-col>
                <div class="d-flex justify-space-between mb-6" flat tile>
                    <div flat>
                        <v-row>
                            <v-col class="pt-0">
                                <h1 class="mt-3 mb-3">
                                    {{ topicsDetail.subject }}
                                </h1>
                                <span class="c-btn c-btn_main c-btn_sm c-btn_disable white--text">
                                    {{ topicsDetail.contents_type_nm }}
                                </span>
                            </v-col>
                        </v-row>
                    </div>
                </div>

                <!-- Wysiwyg contents -->
                <v-row v-if="topicsDetail && topicsDetail.contents" class="p-article_content">
                    <v-container fluid>
                        <v-card v-for="(subtitle, index) in topicsDetail.subtitles" :key="index" class="mx-auto" max-width="7000">
                            <v-card-title class="c-heading_h2">{{ subtitle }}</v-card-title>
                            <v-card-text>
                                <div class="text--primary" v-html="topicsDetail.contents"></div>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-row>

                <!-- extension contents -->
                <v-row v-for="(item, idx) in items" :key="idx" class="p-article_content">
                    <TopicsDetail v-if="item" v-bind="item" />
                </v-row>
            </v-col>
            <v-col></v-col>
        </template>
    </div>
</template>
<script setup>
definePageMeta({
    layout: 'preview'
});

const { t } = useI18n();
const route = useRoute();
const preview_token = route.query.preview_token;
const topicsDetail = ref(null);
const loading = ref(true);
const snackbar = useSnackbar();

const items = computed(() => {
    if (!topicsDetail.value) {
        return [];
    }

    const { texts, positionPatterns, imageUrls, subtitles } = topicsDetail.value;
    return positionPatterns.map(({ key }, i) => ({
        text: texts?.[i],
        positionPatternKey: key,
        imageUrl: imageUrls?.[i]?.url ? `${imageUrls?.[i]?.url}?width=800` : null,
        subtitle: subtitles?.[i]
    }));
});

try {
    const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/content/preview`, {
        credentials: 'include',
        params: {
            preview_token
        },
        server: false
    });
    const d = response.details;
    topicsDetail.value = {
        ...d,
        fileType: d?.ext_1?.key,
        fileUrl: d?.ext_2?.url,
        fileDownload: d?.ext_2?.dl_link,
        linkUrl: d?.ext_3?.url,
        linkTitle: d?.ext_3?.title,

        // for TopicsDetail
        positionPatterns: d?.ext_4,
        texts: d?.ext_7,
        imageUrls: d?.ext_5,
        subtitles: d?.ext_9
    };
    loading.value = false;
} catch (error) {
    snackbar.add({
        type: 'error',
        text: error?.response?._data?.errors?.[0]?.message || t('common.error')
    });
}
</script>
