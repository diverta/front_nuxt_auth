<template>
    <div fluid>
        <TopicsList :topics="topics" />
        <br>
        <div class="text-center mt-5 pt-5">
            <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1"
                          v-model="page"
                          :length="Math.ceil(totalCnt / perPage)"
                          class="c-navi_pagination"
                          @input="() => updateTopics()"
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
            page: 1,
            perPage: 20,
            totalCnt: 0
        };
    },
    methods: {
        async updateTopics() {
            try {
                const favouriteRes = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/favorite/list', {
                    params: {
                        member_id: this.$auth.user.member_id,
                        module_type: 'topics'
                    }
                });
                const topicsIds = favouriteRes.data.list.map((item) => item.module_id);
                if (topicsIds.length === 0) {
                    return;
                }

                const favouriteTopicsRes = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/content/list', {
                    params: {
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
