<template>
    <section class="">
        <div>
            <v-btn-toggle v-model="text" class="c-navi_filter" group>
                <v-btn value="0" @change="changeCategoryAll">
                    ALL
                </v-btn>
                <v-btn
                    v-for="item in categories"
                    :key="item.key"
                    :value="item.key"
                    @change="() => changeCategory(item)"
                >
                    {{ item.value }}
                </v-btn>
            </v-btn-toggle>
        </div>
        <div class="mt-4">
            <TopicsGrid :topics="topics" />
        </div>
        <div class="text-center mt-5 pt-5">
            <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1"
                          v-model="page"
                          :length="Math.ceil(totalCnt / perPage)"
                          class="c-navi_pagination"
                          @input="updateTopics"
            />
        </div>
    </section>
</template>

<script>
export default {
    auth: true,
    data() {
        return {
            text: '0',
            categories: [],
            topics: [],
            page: 1,
            perPage: 12,
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
                const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/content/list', {
                    params: {
                        pageID: this.page,
                        cnt: this.perPage,
                        contents_type: this.category_key !== null ? this.category_key : undefined
                    }
                });

                this.totalCnt = response.data.pageInfo.totalCnt;
                this.topics = response.data.list;
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            };
        }
    },
    async mounted() {
        this.category_key = null;
        try {
            const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/content/category');
            this.categories = response.data.list.map((item) => ({
                key: item.topics_category_id,
                value: item.category_nm
            }));
        } catch (e) {
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        };

        this.updateTopics();
    }
};
</script>
