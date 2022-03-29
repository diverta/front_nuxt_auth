<template>
    <section class="">
        <!--
    <div class="l-content_heading">
      <h1>Topics</h1>
    </div>
    -->
        <div>
            <v-btn-toggle v-model="text" class="c-navi_filter" group>
                <!--<v-btn @change="changeCategoryAll()" class="v-item--active js-allBtn"> ALL </v-btn>-->
                <v-btn value="0" @change="changeCategoryAll()">
                    ALL
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
            <TopicsGrid :topics="topics" />
        </div>
        <div class="text-center mt-5 pt-5">
            <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1"
                          v-model="page"
                          :length="Math.ceil(totalCnt / perPage)"
                          class="c-navi_pagination"
                          @input="next"
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
        next(page) {
            this.updateTopics();
        },
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
                        pageID: this.page,
                        cnt: this.perPage,
                        contents_type: this.category_key !== null ? this.category_key : undefined
                    }
                });

                this.totalCnt = response.data.pageInfo.totalCnt;
                this.topics = response.data.list.map((item) => ({
                    date: item.ymd.substring(0, 10).replaceAll('-', '/'),
                    label: item.contents_type_nm,
                    link: item.subject,
                    id: item.topics_id,
                    icon: item.ext_col_01.key,
                    fileurl: item?.ext_col_02?.url,
                    thumbnail: item?.ext_col_08?.url,
                    linkurl: item?.ext_col_03?.url,
                    edit: false
                }));
            } catch (e) {
                this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
                this.$store.dispatch('snackbar/snackOn');
            };
        }
    },
    async mounted() {
        this.category_key = null;
        try {
            const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/topic/category')
            const categories = [];
            for (const key in response.data.list) {
                const item = response.data.list[key];
                categories.push({
                    key: item.topics_category_id,
                    value: item.category_nm
                });
                this.categories = categories;
            }
        } catch (e) {
            this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
            this.$store.dispatch('snackbar/snackOn');
        };

        this.updateTopics();
    }
};
</script>
