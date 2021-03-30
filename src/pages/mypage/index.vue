<template>
  <div fluid>
    <h1>My page</h1>
    <br />
    <v-tabs
      background-color="indigo"
      dark
      height="70"
      class="rounded-xl"
      centered
    >
      <v-tab @click="go_page('/mypage/')"> My page </v-tab>
      <v-tab @click="go_page('/mypage/favorite_list/')"> Favorite List </v-tab>

      <v-tab @click="go_page('/mypage/profile/edit/')"> Profile Edit </v-tab>
      <v-tab @click="go_page('/mypage/posted_list')"> Posted list </v-tab>
    </v-tabs>

    <br />
    <h1 class="text-center">Favorite list</h1>
    <br />
    <v-topics :topics="topics"></v-topics>
    <br />
    <v-col class="text-right">
      <v-btn
        type="submit"
        block
        x-large
        color="success"
        class="white--text"
        @click="favorite_list()"
      >
        View more
      </v-btn>
    </v-col>
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
      items: [],
      topics: [],
      group_id: 13,
    };
  },
  methods: {
    go_page(path) {
      this.$router.push(path);
    },
    favorite_list() {
      this.$router.push("/mypage/favorite_list");
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
            "/rcms-api/1/topics?topics_group_id=" + self.group_id + "&cnt=5";

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
                    date: item["inst_ymdhi"].substring(0, 10),
                    label: item["contents_type_nm"],
                    link: item["subject"],
                    icon: "",
                    id: item["topics_id"],
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
