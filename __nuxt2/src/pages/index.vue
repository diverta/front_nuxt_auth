<template>
    <client-only>
        <Login v-if="!$auth.loggedIn" />

        <div v-else class="mypage">
            <v-carousel class="p-dashboard_banner">
                <v-carousel-item
                    v-for="(url, i) in sliderImages"
                    :key="i"
                    :src="`${url}?height=500px`"
                    reverse-transition="fade-transition"
                    transition="fade-transition"
                />
            </v-carousel>

            <h1 class="text-left mt-5 pt-4">
                {{ $t('top.latest_articles') }}
            </h1>
            <TopicsGrid :topics="topics" />

            <div class="text-center py-5 mt-4 white--text">
                <a
                    type="submit"
                    block
                    x-large
                    color="success"
                    class="c-btn c-btn_main c-btn_md c-btn_icon"
                    @click="() => $router.push(localePath('/topics_list/'))"
                >
                    {{ $t('top.more_articles') }}
                    <v-icon dark right class="icon"> mdi-arrow-right-drop-circle </v-icon>
                </a>
            </div>

            <h1 class="text-left mt-5 pt-4">
                {{ $t('top.starred') }}
            </h1>
            <TopicsList :topics="favourite" />
            <div class="text-center py-5 white--text">
                <a
                    type="submit"
                    block
                    x-large
                    color="success"
                    class="c-btn c-btn_main c-btn_md c-btn_icon"
                    @click="() => $router.push(localePath('/favourite/'))"
                >
                    {{ $t('top.more_starred') }}
                    <v-icon dark right class="icon"> mdi-arrow-right-drop-circle </v-icon>
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
        topics: [],
        favourite: [],
        maxFavPerPage: 5 // This is fav list, for latest topic, go to below updateTopics() section, search for cnt=6
    }),
    computed: {
        sliderImages() {
            return this.topics
                .map((topic) => topic?.ext_8?.url)
                .filter((sliderImage) => sliderImage);
        }
    },
    methods: {
        async updateTopics() {
            try {
                this.topics = [];
                const response = await this.$store.$auth.ctx.$axios.get(
                    '/rcms-api/1/content/list?cnt=6'
                );
                this.topics = response.data.list;
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            }
        },
        async updateFavourite() {
            try {
                this.favourite = [];
                const favouriteRes = await this.$store.$auth.ctx.$axios.get(
                    '/rcms-api/1/favorite/list',
                    {
                        params: {
                            member_id: this.$auth.user.member_id,
                            module_type: 'topics'
                        }
                    }
                );
                const topicsIds = favouriteRes.data.list.map((item) => item.module_id);
                if (topicsIds.length === 0) {
                    return;
                }

                const favouriteTopicsRes = await this.$store.$auth.ctx.$axios.get(
                    '/rcms-api/1/content/list',
                    {
                        params: {
                            cnt: this.maxFavPerPage,
                            id: topicsIds
                        }
                    }
                );
                this.favourite = favouriteTopicsRes.data.list;
            } catch (e) {
                this.$snackbar.error(e?.response?.data.errors?.[0]?.message);
            }
        }
    },
    watch: {
        '$auth.loggedIn': {
            handler(to, from) {
                if (to) {
                    this.updateTopics();
                    this.updateFavourite();
                }
            },
            immediate: true
        }
    }
};
</script>
