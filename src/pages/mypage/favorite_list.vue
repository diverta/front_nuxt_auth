<template>
    <div fluid>
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
            Favorite list
        </h1>
        <br>
        <v-topics :topics="topics" />
        <br>
        <div class="text-center">
            <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1"
                          v-model="page"
                          :length="Math.ceil(totalCnt / perPage)"
                          @input="next"
            />
        </div>
    </div>
</template>

<script>
import topicList from '../../components/topics';
export default {
    auth: true,
    components: {
        'v-topics': topicList
    },
    data() {
        return {
            active_tab: 1,
            topics: [],
            group_id: 13,
            page: 1,
            perPage: 10,
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
        updateTopics() {
            const self = this;
            const favoritesUrl =
        '/rcms-api/1/favorites?member_id=' +
        this.$auth.user.member_id +
        '&module_type=topics';
            this.$store.$auth.ctx.$axios
                .get(favoritesUrl)
                .then(function (response) {
                    const topicIds = [];
                    for (const key in response.data.list) {
                        const item = response.data.list[key];
                        if (item.hasOwnProperty('module_id')) {
                            topicIds.push(item.module_id);
                        }
                    }

                    let url =
            '/rcms-api/1/topics?topics_group_id=' +
            self.group_id +
            '&pageID=' +
            self.page +
            '&cnt=' +
            self.perPage;

                    if (topicIds.length > 0) {
                        for (let i = 0; i < topicIds.length; ++i) {
                            url += '&id[]=' + topicIds[i];
                        }

                        self.$store.$auth.ctx.$axios
                            .get(url)
                            .then(function (response) {
                                const topics = [];
                                self.totalCnt = response.data.pageInfo.totalCnt;
                                for (const key in response.data.list) {
                                    const item = response.data.list[key];
                                    topics.push({
                                        date: item.inst_ymdhi
                                            .substring(0, 10)
                                            .replaceAll('-', '/'),
                                        label: item.contents_type_nm,
                                        link: item.subject,
                                        icon: '',
                                        id: item.topics_id,
                                        edit: false
                                    });
                                }
                                self.topics = topics;
                            })
                            .catch(function (error) {
                                self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                                self.$store.dispatch('snackbar/snackOn');
                            });
                    }
                })
                .catch(function (error) {
                    self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                    self.$store.dispatch('snackbar/snackOn');
                });
        }
    },
    mounted() {
        this.updateTopics();
    }
};
</script>
