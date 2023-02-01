<template>
    <div>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />
        <template v-if="topicsDetail">
            <v-col>
                <v-card class="d-flex justify-space-between mb-6" flat tile>
                    <v-card flat>
                        <v-row>
                            <v-col class="pt-0">
                                <h1 class="mb-3 mt-0">
                                    {{ topicsDetail.subject }}
                                </h1>
                                <span
                                    class="c-btn c-btn_main c-btn_sm c-btn_disable white--text"
                                >
                                    {{ topicsDetail.contents_type_nm }}
                                </span>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card flat>
                        {{ $dateFns.format(topicsDetail.inst_ymdhi, 'yyyy/MM/dd') }}
                        <div class="text-right mt-2">
                            <v-btn icon :color="favoriteColor" @click="onClickToggleFavorite">
                                <v-icon x-large left>
                                    mdi-star
                                </v-icon>
                            </v-btn>
                        </div>
                    </v-card>
                </v-card>

                <!-- Wysiwyg contents -->
                <v-row
                    v-if="topicsDetail && topicsDetail.contents"
                    class="p-article_content"
                >
                    <v-container fluid>
                        <v-card class="mx-auto" max-width="7000">
                            <v-card-title class="c-heading_h2" v-text="subtitle" />
                            <v-card-text>
                                <div class="text--primary" v-html="topicsDetail.contents" />
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-row>

                <!-- extension contents -->
                <v-row
                    v-for="(item, idx) in items"
                    :key="idx"
                    class="p-article_content"
                >
                    <TopicsDetail v-if="item" v-bind="{ ...item }" />
                </v-row>
            </v-col>
            <v-col>
                <div
                    v-if="topicsDetail.fileUrl || topicsDetail.fileDownload"
                    class="p-article_footer-content"
                >
                    <h3 class="heading">
                        {{ $t('detail.files') }}
                    </h3>
                    <div v-if="topicsDetail.fileUrl" class="white--text">
                        <a
                            :href="topicsDetail.fileUrl"
                            target="_blank"
                            class="c-btn c-btn_dark p-article_file"
                        >
                            {{ $t('detail.view') }}
                            <FileTypeIcon :file-type="topicsDetail.fileType" />
                        </a>
                    </div>
                    <div v-if="topicsDetail.fileDownload" class="white--text">
                        <a target="_blank" class="c-btn c-btn_main p-article_file">
                            {{ $t('detail.download') }}
                            <FileTypeIcon :file-type="topicsDetail.fileType" />
                        </a>
                    </div>
                </div>
                <div v-if="topicsDetail.linkUrl" class="p-article_footer-content">
                    <h3 class="heading">
                        {{ $t('detail.links') }}
                    </h3>
                    <a
                        v-if="topicsDetail.linkUrl"
                        :href="topicsDetail.linkUrl"
                        target="_blank"
                        class="c-link"
                    >
                        <v-icon v-if="topicsDetail.fileType == 'pdf'"
                        >mdi-open-in-new</v-icon
                        >
                        <span v-if="topicsDetail.linkTitle">{{
                            topicsDetail.linkTitle
                        }}</span>
                        <span v-else>{{ topicsDetail.linkUrl }}</span>
                    </a>
                </div>
            </v-col>
            <div class="text-center col mt-5">
                <button
                    type="submit"
                    class="c-btn c-btn_dark c-btn_icon white--text"
                    @click="() => $router.push('/topics_list')"
                >
                    {{ $t('common.back_to_listing') }}
                    <v-icon class="icon c-text_white pr-2">
                        mdi-undo-variant
                    </v-icon>
                </button>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    auth: true,
    computed: {
        items() {
            if (!this.topicsDetail) {
                return [];
            }
            const { texts, positionPatterns, imageUrls, subtitles } =
        this.topicsDetail;
            return positionPatterns.map(({ key }, i) => ({
                text: texts?.[i],
                positionPatternKey: key,
                imageUrl: imageUrls?.[i]?.url
                    ? `${imageUrls?.[i]?.url}?width=800`
                    : null,
                subtitle: subtitles?.[i]
            }));
        }
    },
    methods: {
        async onClickToggleFavorite() {
            const requestOption = {
                module_type: 'topics',
                module_id: parseInt(this.topic_id)
            };
            const request =
        this.favoriteColor === 'grey'
            ? this.$store.$auth.ctx.$axios.post(
                '/rcms-api/1/favorite/register',
                requestOption
            )
            : this.$store.$auth.ctx.$axios.post(
                '/rcms-api/1/favorite/delete',
                requestOption
            );

            try {
                await request;
                this.favoriteColor = this.favoriteColor === 'grey' ? 'red' : 'grey';
            } catch (error) {
                this.$snackbar.error(error?.response?.data?.errors?.[0]?.message);
            }
        }
    },
    data() {
        return {
            topicsDetail: null,
            favoriteResponse: null,
            favoriteColor: 'grey',
            loading: true,
            topic_id: null
        };
    },
    async mounted() {
        this.topic_id = this.$route.params.id;

        try {
            const topicsDetailResponse = this.$route.params.id === 'preview'
                ? await this.$store.$auth.ctx.$axios.get(`/rcms-api/1/content/preview?preview_token=${this.$route.query.preview_token}`)
                : await this.$store.$auth.ctx.$axios.get(`/rcms-api/1/content/details/${this.topic_id}`);

            const d = topicsDetailResponse.data.details;
            this.topicsDetail = {
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
            this.favoriteResponse = await this.$store.$auth.ctx.$axios.get(
                '/rcms-api/1/favorite/list',
                {
                    params: {
                        member_id: this.$auth.user.member_id,
                        module_type: 'topics',
                        module_id: this.topic_id
                    }
                }
            );
        } catch (e) {
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        }

        this.favoriteColor =
      this.favoriteResponse?.data?.pageInfo?.totalCnt > 0 ? 'red' : 'grey';
        this.loading = false;
    }
};
</script>
