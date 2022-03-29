<template>
    <div>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />
        <template>
            <v-col>
                <v-card class="d-flex justify-space-between mb-6" flat tile>
                    <v-card flat>
                        <v-row>
                            <v-col class="pt-0">
                                <h1 class="mb-3 mt-0">
                                    {{ attrs.title }}
                                </h1>
                                <span class="c-btn c-btn_main c-btn_sm c-btn_disable">
                                    {{ attrs.label }}
                                </span>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card flat>
                        {{ attrs.date }}
                        <div class="text-right mt-2">
                            <v-btn icon :color="favoriteColor" @click="onClickToggleFavorite()">
                                <v-icon x-large left>
                                    mdi-star
                                </v-icon>
                            </v-btn>
                        </div>
                    </v-card>
                </v-card>
                <v-row v-for="(item, idx) in items" :key="idx" class="p-article_content">
                    <TopicsDetail
                        :text="item.text"
                        :image_url="item.image_url"
                        :subtitle="item.subtitle"
                        :pattern="item.pattern"
                    />
                </v-row>
            </v-col>
            <v-col>
                <div v-if="attrs.file_url || attrs.file_download" class="p-article_footer-content">
                    <h3 class="heading">{{ $t('detail.files') }}</h3>
                    <a v-if="attrs.file_url" :href="attrs.file_url" target="_blank" class="c-btn c-btn_dark p-article_file">
                        {{ $t('detail.view') }}
                        <FileTypeIcon :file-type="attrs.file_type" />
                    </a>
                    <a v-if="attrs.file_download" :href="attrs.file_download" target="_blank" class="c-btn c-btn_main p-article_file">
                        {{ $t('detail.download') }}
                        <FileTypeIcon :file-type="attrs.file_type" />
                    </a>
                </div>
                <div v-if="attrs.link_url" class="p-article_footer-content">
                    <h3 class="heading">{{ $t('detail.links') }}</h3>
                    <a v-if="attrs.link_url" :href="attrs.link_url" target="_blank" class="c-link">
                        <v-icon v-if="attrs.file_type == 'pdf'">mdi-open-in-new</v-icon>
                        <span v-if="attrs.link_title">{{ attrs.link_title }}</span>
                        <span v-else>{{ attrs.link_url }}</span>
                    </a>
                </div>
            </v-col>
            <div class="text-center col mt-5">
                <button
                    type="submit"
                    class="c-btn c-btn_dark c-btn_icon"
                    @click="() => $router.go(-1)"
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
        attrs() {
            const attrs = {};
            attrs.label = this.topicsDetailResponse?.data?.details?.contents_type_nm;
            attrs.title = this.topicsDetailResponse?.data?.details?.subject;
            attrs.date = this.topicsDetailResponse?.data?.details?.inst_ymdhi
                ?.substring(0, 10)
                ?.replaceAll('-', '/');
            attrs.file_type = this.topicsDetailResponse?.data?.details?.ext_col_01?.key;
            attrs.file_url = this.topicsDetailResponse?.data?.details?.ext_col_02?.url;
            attrs.file_download = this.topicsDetailResponse?.data?.details?.ext_col_02?.dl_link;
            attrs.link_url = this.topicsDetailResponse?.data?.details?.ext_col_03?.url;
            attrs.link_title = this.topicsDetailResponse?.data?.details?.ext_col_03?.title;
            return attrs;
        },
        items() {
            if (!this.topicsDetailResponse) {
                return [];
            }

            const positions = this.topicsDetailResponse.data.details.ext_col_04;
            const imageUrls = this.topicsDetailResponse.data.details.ext_col_05;
            const texts = this.topicsDetailResponse.data.details.ext_col_07;
            const subtitles = this.topicsDetailResponse.data.details.ext_col_09;

            const getPattern = (key) => {
                switch (key) {
                case '0':
                    return 'no image';
                case '1':
                    return 'top';
                case '2':
                    return 'left';
                case '3':
                    return 'bottom';
                case '4':
                    return 'right';
                default:
                    return null;
                }
            };
            return positions.map(({ key }, i) => ({
                text: texts[i],
                pattern: getPattern(key),
                image_url: imageUrls[i]?.hasOwnProperty('url') ? `${imageUrls[i].url}?width=800` : null,
                subtitle: subtitles[i]
            }));
        }
    },
    methods: {
        async onClickToggleFavorite() {
            const requestOption = {
                module_type: 'topics',
                module_id: parseInt(this.topic_id)
            };
            const request = this.favoriteColor === 'gray'
                ? this.$store.$auth.ctx.$axios.post('/rcms-api/1/favorites', requestOption)
                : this.$store.$auth.ctx.$axios.post('/rcms-api/1/favorites/delete', requestOption);

            try {
                await request;
                this.favoriteColor = this.favoriteColor === 'gray' ? 'red' : 'gray';
            } catch (error) {
                this.$store.dispatch('snackbar/setError', error?.response?.data?.errors?.[0]?.message);
                this.$store.dispatch('snackbar/snackOn');
            }
        }
    },
    data() {
        return {
            topicsDetailResponse: null,
            favoriteResponse: null,
            favoriteColor: 'grey',
            loading: true,
            topic_id: null,
        };
    },
    async mounted() {
        this.topic_id = this.$route.params.id;

        try {
            this.topicsDetailResponse = await this.$store.$auth.ctx.$axios.get(`/rcms-api/1/topic/detail/${this.topic_id}`);
            this.favoriteResponse = await this.$store.$auth.ctx.$axios
                .get('/rcms-api/1/favorites', {
                    params: {
                        member_id: this.$auth.user.member_id,
                        module_type: 'topics',
                        module_id: this.topic_id
                    }
                });
        } catch (e) {
            this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
            this.$store.dispatch('snackbar/snackOn');
        }

        this.favoriteColor = this.favoriteResponse?.data?.pageInfo?.totalCnt > 0 ? 'red' : 'grey';
        this.loading = false;
    }
};
</script>
