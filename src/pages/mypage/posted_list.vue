<template>
  <v-container fluid>
    <h1>Topics</h1>
    <br />
    <v-col cols="12" class="py-2">
      <v-btn-toggle v-model="text" tile color="deep-purple accent-3" group>
        <v-btn @change="changeCategoryAll()"> ALL </v-btn>
        <v-btn
          v-for="item in categories"
          :value="item.key"
          @change="changeCategory(item)"
          v-bind:key="item.key"
        >
          {{ item.value }}
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col>
      <v-topics :topics="topics"></v-topics>
    </v-col>
    <br />
    <br />
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalCnt / perPage)"
        @input="next"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import topicList from "~/components/topics";
export default {
  auth: true,
  components: {
    "v-topics": topicList,
  },
  data() {
    return {
      text: "",
      group_id: 13,
      categories: [],
      topics: [],
      page: 1,
      perPage: 10,
      category_key: null,
      totalCnt: 0,
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
    updateTopics() {
      var url =
        "/rcms-api/1/topics?topics_group_id=" +
        this.group_id +
        "&pageID=" +
        this.page +
        "&cnt=" +
        this.perPage +
        "&filter=member_id eq " +
        this.$auth.user.member_id

      if (this.category_key != null) {
        url += "&contents_type=" + this.category_key;
      }
      let self = this;
      this.$store.$auth.ctx.$axios
        .get(url)
        .then(function (response) {
          var topics = [];
          for (var key in response.data.list) {
            var item = response.data.list[key];
            var fileurl = "";
            var linkurl = "";
            if (
              item.hasOwnProperty("ext_col_02") &&
              item["ext_col_02"].hasOwnProperty("url")
            ) {
              fileurl = item["ext_col_02"]["url"];
            }
            if (
              item.hasOwnProperty("ext_col_03") &&
              item["ext_col_03"].hasOwnProperty("url")
            ) {
              linkurl = item["ext_col_03"]["url"];
            }
            if (item.hasOwnProperty("member_id")) {
              topics.push({
                date: item["inst_ymdhi"].substring(0, 10).replaceAll("-", "/"),
                label: item["contents_type_nm"],
                link: item["subject"],
                id: item["topics_id"],
                icon: item["ext_col_01"]["key"],
                fileurl: fileurl,
                linkurl: linkurl,
                edit: true,
              });
            }
          }
          self.topics = topics;
          self.totalCnt = topics.length;
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
        });
    },
  },
  mounted() {
    let self = this;
    this.category_key = null;
    this.$store.$auth.ctx.$axios
      .get("/rcms-api/1/topic/category?topics_group_id=" + this.group_id)
      .then(function (response) {
        var categories = [];
        for (var key in response.data.list) {
          var item = response.data.list[key];
          categories.push({
            key: item["topics_category_id"],
            value: item["category_nm"],
          });
          self.categories = categories;
        }
      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
      });

    this.updateTopics();
  },
};
</script>
