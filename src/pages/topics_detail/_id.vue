<template>
  <div>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="orange white-4"
    ></v-progress-linear>
    <v-col>
      <v-card class="d-flex justify-space-between mb-6" flat tile>
        <v-card flat>
          <v-row>
            <v-col>
              <v-btn disable>
                {{ label }}
              </v-btn>
            </v-col>
            <v-col>
              <h3>
                {{ title }}
              </h3>
            </v-col>
          </v-row>
        </v-card>
        <v-card flat>
          {{ date }}
        </v-card>
      </v-card>
      <v-row v-for="item in items" v-bind:key="item.id">
        <v-item
          :text="item.text"
          :image_url="item.image_url"
          :subtitle="item.subtitle"
          :pattern="item.pattern"
          :text_size="item.text_size"
        >
        </v-item>
      </v-row>
    </v-col>
    <v-row class="text-right">
      <v-col>
        <v-btn icon :color="color" @click="onClick()">
          <v-icon x-large left>mdi-heart</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-btn
      type="submit"
      block
      x-large
      color="success"
      class="white--text"
      @click="back()"
    >
      Back to List
    </v-btn>
  </div>
</template>

<script>
import item from "../../components/topic_detail";
export default {
  auth: true,
  components: {
    "v-item": item,
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    onClick() {
      let self = this
      if (this.color == "gray") {
        this.$store.$auth.ctx.$axios
          .post("/rcms-api/1/favorites", {
            module_type: "topics",
            module_id: parseInt(this.topic_id),
          })
          .then(function (response) {
            self.color = "red";
          })
          .catch(function (error) {
          });
      } else {
        this.$store.$auth.ctx.$axios
          .post("/rcms-api/1/favorites/delete", {
            module_type: "topics",
            module_id: parseInt(this.topic_id),
          })
          .then(function (response) {
            self.color = "gray";
          })
          .catch(function (error) {
            self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
            self.$store.dispatch("snackbar/snackOn");
          });
      }
    },
  },

  data() {
    return {
      label: "",
      date: "",
      title: "",
      color: "white",
      items: [
        {
          text: "",
          pattern: 1,
          image_url: "",
          text_size: "H2",
          subtitle: "type 1",
        },
      ],
      loading: true,
      topic_id: 957,
    };
  },
  mounted() {
    this.topic_id = this.$route.params.id;
    this.loading = true;
    var url =
      "https://dev-nuxt-auth.a.kuroco.app/rcms-api/1/topic/detail/" +
      this.topic_id;
    let self = this;
    this.$store.$auth.ctx.$axios
      .get(url)
      .then(function (response) {
        var items = [];
        self.label = response.data.details.contents_type_nm;
        self.title = response.data.details.subject;
        self.date = response.data.details["inst_ymdhi"]
          .substring(0, 10)
          .replaceAll("-", "/");
        var positions = response.data.details.ext_col_04;
        var image_urls = response.data.details.ext_col_05;
        var text_size = response.data.details.ext_col_06;
        var texts = response.data.details.ext_col_07;
        var subtitle = response.data.details.ext_col_09;

        for (var i = 0; i < text_size.length; i++) {
          var textSize = null;
          var imageUrl = null;
          if (
            text_size[i] != undefined &&
            text_size[i].hasOwnProperty("label")
          ) {
            textSize = text_size[i]["label"];
          }
          if (
            image_urls[i] != undefined &&
            image_urls[i].hasOwnProperty("url")
          ) {
            imageUrl = image_urls[i]["url"] + "?width=400&height=400";
          }
          var pattern = 1;
          if (textSize == "H2") {
            pattern = 1;
          } else if (positions[i].label == "Top" && textSize == "H3") {
            pattern = 2;
          } else if (positions[i].label == "Bottom" && textSize == "No level") {
            pattern = 3;
          } else if (positions[i].label == "Left" && textSize == "H4") {
            pattern = 4;
          } else if (positions[i].label == "Right" && textSize == "H5") {
            pattern = 5;
          } else if (positions[i].label == "Top" && textSize == "No level") {
            pattern = 6;
          }
          items.push({
            text: texts[i],
            pattern: pattern,
            image_url: imageUrl,
            text_size: textSize,
            subtitle: subtitle[i],
          });
        }
        self.items = items;
        self.loading = false;
      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
      });

    var favoritesUrl =
      "/rcms-api/1/favorites?member_id=" +
      this.$auth.user.member_id +
      "&module_type=topics&module_id=" +
      this.topic_id;
    this.$store.$auth.ctx.$axios
      .get(favoritesUrl)
      .then(function (response) {
        if (response.data.pageInfo.totalCnt > 0) {
          self.color = "red";
        } else {
          self.color = "gray";
        }
      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
        self.color = "gray";
      });
  },
};
</script>
