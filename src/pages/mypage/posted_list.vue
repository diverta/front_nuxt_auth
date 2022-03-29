<template>
    <section>
        <div class="l-content_heading">
            <h1>{{ $t('mypage.title') }}</h1>
        </div>
        <v-tabs
            v-model="active_tab"
            background-color="transparent"
            light
            height="70"
            class="rounded-xl"
            centered
            show-arrows
        >
            <v-tab @click="() => $router.push(localePath('/mypage/'))">
                {{ $t('mypage.my_page') }}
            </v-tab>
            <v-tab @click="() => $router.push(localePath('/mypage/favorite_list/'))">
                {{ $t('mypage.favoire_list') }}
            </v-tab>
            <v-tab v-model="selectedTab" @click="() => $router.push(localePath('/mypage/profile/edit/'))">
                {{ $t('mypage.profile_edit') }}
            </v-tab>
            <v-tab @click="() => $router.push(localePath('/mypage/posted_list'))">
                {{ $t('mypage.posted_list') }}
            </v-tab>
        </v-tabs>

        <h1 class="mt-5 pt-5">
            {{$t('mypage.my_topics')}}
        </h1>
        <br>
        <div>
            <v-btn-toggle v-model="text" class="c-navi_filter" tile color="deep-purple accent-3" group>
                <v-btn value="0" @change="changeCategoryAll()">
                    {{$t('mypage.all')}}
                </v-btn>
                <v-btn
                    v-for="item in categories"
                    :key="item.key"
                    :value="item.key"
                    @change="changeCategory(item)"
                >
                    {{ item.value }}
                </v-btn>
            </v-btn-toggle>
        </div>
        <div class="mt-4">
            <TopicsList :topics="topics" />
        </div>
        <div class="text-center mt-5 pt-5">
            <v-pagination
                v-if="Math.ceil(totalCnt / perPage) > 1"
                v-model="page"
                :length="Math.ceil(totalCnt / perPage)"
                @input="() => updateTopics()"
            />
        </div>
    </section>
</template>

<script>
export default {
    auth: true,
    data() {
        return {
            active_tab: 3,
            text: '0',
            group_id: 1,
            categories: [],
            topics: [],
            page: 1,
            perPage: 10,
            category_key: null,
            totalCnt: 0
        };
    },
    methods: {
        changeCategoryAll() {
            this.category_key = null;
            this.page = 1;
            this.updateTopics();
        },
        changeCategory(item) {
            this.category_key = item.key;
            this.page = 1;
            this.updateTopics();
        },
        async updateTopics() {
            try {
                const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/topics', {
                    params: {
                        topics_group_id: this.group_id,
                        pageID: this.page,
                        cnt: this.perPage,
                        filter: `&filter=member_id eq ${this.$auth.user.member_id}`,
                        contents_type: this.category_key !== null ? this.category_key : undefined
                    }
                });

                this.topics = response.data.list
                    .filter((item) => item?.member_id !== null && item?.member_id !== undefined)
                    .map((item) => ({
                        ...item,
                        icon: item.ext_col_01.key,
                        fileurl: item?.ext_col_02?.url,
                        linkurl: item?.ext_col_03?.url,
                        edit: true
                    }));
                this.totalCnt = this.topics.length;
            } catch (e) {
                this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
                this.$store.dispatch('snackbar/snackOn');
            };
        }
    },
    async mounted() {
        this.category_key = null;
        try {
            const response = await this.$store.$auth.ctx.$axios.get(`/rcms-api/1/topic/category?topics_group_id=${this.group_id}`)
            this.categories = response.data.list.map((item) => ({
                key: item.topics_category_id,
                value: item.category_nm
            }));
        } catch (e) {
            this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
            this.$store.dispatch('snackbar/snackOn');
        };

        this.updateTopics();
    }
};
</script>
