<template>
    <section>
        <div class="l-content_heading">
            <h1>My page</h1>
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
            <v-tab @click="go_page('/mypage/')">
                My page
            </v-tab>
            <v-tab @click="go_page('/mypage/favorite_list/')">
                Favorite List
            </v-tab>
            <v-tab v-model="selectedTab" @click="go_page('/mypage/profile/edit/')">
                Profile Edit
            </v-tab>
            <v-tab @click="go_page('/mypage/posted_list')">
                Posted list
            </v-tab>
        </v-tabs>

        <h1 class="mt-5 pt-5">
            My topics
        </h1>
        <br>
        <div>
            <v-btn-toggle v-model="text" class="c-navi_filter" tile color="deep-purple accent-3" group>
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
            <v-topics :topics="topics" />
        </div>
        <div class="text-center mt-5 pt-5">
            <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1"
                          v-model="page"
                          :length="Math.ceil(totalCnt / perPage)"
                          @input="next"
            />
        </div>
    </section>
</template>

<script>
import topicList from '~/components/topics';
export default {
    auth: true,
    components: {
        'v-topics': topicList
    },
    data() {
        return {
            active_tab: 3,
            text: '0',
            group_id: 13,
            categories: [],
            topics: [],
            page: 1,
            perPage: 10,
            category_key: null,
            totalCnt: 0
        };
    },
    methods: {
        go_page(path) {
            this.$router.push(path);
        },
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
        updateTopics() {
            let url =
        '/rcms-api/1/topics?topics_group_id=' +
        this.group_id +
        '&pageID=' +
        this.page +
        '&cnt=' +
        this.perPage +
        '&filter=member_id eq ' +
        this.$auth.user.member_id;

            if (this.category_key != null) {
                url += '&contents_type=' + this.category_key;
            }
            const self = this;
            this.$store.$auth.ctx.$axios
                .get(url)
                .then(function (response) {
                    const topics = [];
                    for (const key in response.data.list) {
                        const item = response.data.list[key];
                        let fileurl = '';
                        let linkurl = '';
                        if (
                            item.hasOwnProperty('ext_col_02') &&
              item.ext_col_02.hasOwnProperty('url')
                        ) {
                            fileurl = item.ext_col_02.url;
                        }
                        if (
                            item.hasOwnProperty('ext_col_03') &&
              item.ext_col_03.hasOwnProperty('url')
                        ) {
                            linkurl = item.ext_col_03.url;
                        }
                        if (item.hasOwnProperty('member_id')) {
                            topics.push({
                                date: item.inst_ymdhi.substring(0, 10).replaceAll('-', '/'),
                                label: item.contents_type_nm,
                                link: item.subject,
                                id: item.topics_id,
                                icon: item.ext_col_01.key,
                                fileurl,
                                linkurl,
                                edit: true
                            });
                        }
                    }
                    self.topics = topics;
                    self.totalCnt = topics.length;
                })
                .catch(function (error) {
                    self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                    self.$store.dispatch('snackbar/snackOn');
                });
        }
    },
    mounted() {
        const self = this;
        this.category_key = null;
        this.$store.$auth.ctx.$axios
            .get('/rcms-api/1/topic/category?topics_group_id=' + this.group_id)
            .then(function (response) {
                const categories = [];
                for (const key in response.data.list) {
                    const item = response.data.list[key];
                    categories.push({
                        key: item.topics_category_id,
                        value: item.category_nm
                    });
                    self.categories = categories;
                }
            })
            .catch(function (error) {
                self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                self.$store.dispatch('snackbar/snackOn');
            });

        this.updateTopics();
    }
};
</script>
