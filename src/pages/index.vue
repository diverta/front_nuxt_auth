<template>
    <client-only>
        <Login v-if="!$auth.loggedIn" />

        <div v-else class="mypage">
            <v-carousel class="p-dashboard_banner">
                <v-carousel-item
                    v-for="(item, i) in items"
                    :key="i"
                    :src="item.src"
                    reverse-transition="fade-transition"
                    transition="fade-transition"
                />
            </v-carousel>

            <h1 class="text-left mt-5 pt-4">
                {{ $t('top.latest_articles') }}
            </h1>
            <TopicsGrid :topics="topics" />

            <div class="text-center py-5 mt-4">
                <a
                    type="submit"
                    block
                    x-large
                    color="success"
                    class="c-btn c-btn_main c-btn_md c-btn_icon"
                    @click="back()"
                >
                    {{ $t('top.more_articles') }}
                    <v-icon
                        dark
                        right
                        class="icon"
                    >
                        mdi-arrow-right-drop-circle
                    </v-icon>

                </a>
            </div>

            <h1 class="text-left mt-5 pt-4">
                {{ $t('top.starred') }}
            </h1>
            <TopicsList :topics="favourite" />
            <div class="text-center py-5">
                <a
                    type="submit"
                    block
                    x-large
                    color="success"
                    class="c-btn c-btn_main c-btn_md c-btn_icon"
                    @click="linkFav()"
                >
                    {{ $t('top.more_starred') }}
                    <v-icon
                        dark
                        right
                        class="icon"
                    >
                        mdi-arrow-right-drop-circle
                    </v-icon>

                </a>
            </div>
        </div>
    </client-only>
</template>

<script>
export default {
    middleware: 'auth',
    auth: false,
    data: () => ({
        items: [],
        thumbnail: [],
        topics: [],
        favourite: [],
        maxFavPerPage: 5 // This is fav list, for latest topic, go to below updateTopics() section, search for cnt=6
    }),
    mounted() {
        this.topics = [];
        this.favourite = [];
        if (this.$auth.loggedIn) {
            this.updateTopics();
            this.updateFavourite();
        }
    },
    methods: {
        back() {
            this.$router.push(this.localePath('/topics_list/'));
        },
        linkFav() {
            this.$router.push(this.localePath('/favourite/'));
        },
        async updateTopics() {
            try {
                const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/topics?cnt=6');

                this.topics = response.data.list.map((item) => ({
                    date: item.ymd.substring(0, 10).replaceAll('-', '/'),
                    label: item.contents_type_nm,
                    link: item.subject,
                    id: item.topics_id,
                    icon: item.ext_col_01.key,
                    fileurl: item?.ext_col_02?.url || '',
                    linkurl: item?.ext_col_03?.url || '',
                    thumbnail: item?.ext_col_08 || '',
                    edit: false
                }));
                this.items = response.data.list.map((item) => (
                    item?.ext_col_08?.url ? { src: item.ext_col_08.url + '?height=500px' } : null
                )).filter((item) => item);
            } catch (e) {
                this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
                this.$store.dispatch('snackbar/snackOn');
            };
        },
        async updateFavourite() {
            try {
                const favouriteRes = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/favorites', {
                    params: {
                        member_id: this.$auth.user.member_id,
                        module_type: 'topics'
                    }
                });
                const topicsIds = favouriteRes.data.list.map((item) => item.module_id);
                if (topicsIds === 0) {
                    return;
                }

                const favouriteTopicsRes = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/topics', {
                    params: {
                        cnt: this.maxFavPerPage,
                        id: topicsIds
                    }
                });
                this.totalCnt = favouriteTopicsRes.data.pageInfo.totalCnt;
                this.favourite = favouriteTopicsRes.data.list.map(item => ({
                    date: item.inst_ymdhi
                        .substring(0, 10)
                        .replaceAll('-', '/'),
                    label: item.contents_type_nm,
                    link: item.subject,
                    icon: '',
                    id: item.topics_id,
                    edit: false
                }));
            } catch (e) {
                this.$store.dispatch('snackbar/setError', e?.response?.data.errors?.[0]?.message);
                this.$store.dispatch('snackbar/snackOn');
            };
        }
    }
};
</script>
