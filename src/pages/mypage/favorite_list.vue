<template>
    <div fluid>
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
            {{ $t('mypage.favoire_list') }}
        </h1>
        <br>
        <TopicsList :topics="topics" />
        <br>
        <div class="text-center">
            <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1"
                          v-model="page"
                          :length="Math.ceil(totalCnt / perPage)"
                          @input="updateTopics"
            />
        </div>
    </div>
</template>

<script>
export default {
    auth: true,
    data() {
        return {
            active_tab: 1,
            topics: [],
            group_id: 1,
            page: 1,
            perPage: 10,
            totalCnt: 0
        };
    },
    methods: {
        async updateTopics() {
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
                        topics_group_id: this.group_id,
                        pageID: this.page,
                        cnt: this.perPage,
                        id: topicsIds
                    }
                });

                this.totalCnt = favouriteTopicsRes.data.pageInfo.totalCnt;
                this.topics = favouriteTopicsRes.data.list;
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            };
        }
    },
    mounted() {
        this.updateTopics();
    }
};
</script>
