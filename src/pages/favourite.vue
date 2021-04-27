<template>
  <div fluid>

    <v-topics :topics="topics"></v-topics>
    <br />
    <div class="text-center mt-5 pt-5">
      <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1"
        v-model="page"
        :length="Math.ceil(totalCnt / perPage)"
        @input="next"
        class="c-navi_pagination"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import topicList from "../components/topics";
export default {
  auth: true,
  components: {
    "v-topics": topicList,
  },
  data() {
    return {
      active_tab: 1,
      topics: [],
      group_id: 13,
      page: 1,
      perPage: 20,
      totalCnt: 0,
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
      let self = this;
      var favoritesUrl =
        "/rcms-api/1/favorites?member_id=" +
        this.$auth.user.member_id +
        "&module_type=topics";
      this.$store.$auth.ctx.$axios
        .get(favoritesUrl)
        .then(function (response) {
          var topic_ids = [];
          for (var key in response.data.list) {
            var item = response.data.list[key];
            if (item.hasOwnProperty("module_id")) {
              topic_ids.push(item["module_id"]);
            }
          }

          var url =
            "/rcms-api/1/topics?topics_group_id=" +
            self.group_id +
            "&pageID=" +
            self.page +
            "&cnt=" +
            self.perPage;

          if (topic_ids.length > 0) {
            for (var i = 0; i < topic_ids.length; ++i) {
              url += "&id[]=" + topic_ids[i];
            }

            self.$store.$auth.ctx.$axios
              .get(url)
              .then(function (response) {
                var topics = [];
                self.totalCnt = response.data.pageInfo.totalCnt;
                for (var key in response.data.list) {
                  var item = response.data.list[key];
                  topics.push({
                    date: item["inst_ymdhi"]
                      .substring(0, 10)
                      .replaceAll("-", "/"),
                    label: item["contents_type_nm"],
                    link: item["subject"],
                    icon: "",
                    id: item["topics_id"],
                    edit: false,
                  });
                }
                self.topics = topics;
              })
              .catch(function (error) {
                self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
                self.$store.dispatch("snackbar/snackOn");
              });
          }
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
        });
    },
  },
  mounted() {
    this.updateTopics();
  },
};
</script>
