<template>
  <div fluid>
    <h1 class="text-center">Favorite list</h1>
    <br />
    <v-topics :topics="topics"></v-topics>
    <br />
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalCnt / perPage)"
        @input="next"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import topicList from "../../components/topics";
export default {
  auth: true,
  components: {
    "v-topics": topicList,
  },
  data() {
    return {
      topics: [],
      group_id: 13,
      page: 1,
      perPage: 10,
      totalCnt: 0,
    };
  },
  methods: {
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
