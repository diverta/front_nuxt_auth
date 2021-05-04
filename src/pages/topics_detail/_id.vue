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
            <v-col class="pt-0">
              <h1 class="mb-3 mt-0">
                {{ title }}
              </h1>
              <span class="c-btn c-btn_main c-btn_sm c-btn_disable">
                {{ label }}
              </span>
            </v-col>
          </v-row>
        </v-card>
        <v-card flat>
          {{ date }}
          <div class="text-right mt-2">
            <v-btn icon :color="color" @click="onClick()">
              <v-icon x-large left>mdi-heart</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-card>
      <v-row v-for="item in items" v-bind:key="item.id" class="p-article_content">
        <v-item
          :text="item.text"
          :image_url="item.image_url"
          :subtitle="item.subtitle"
          :pattern="item.pattern"
        >
        </v-item>
      </v-row>
    </v-col>
    <div class="text-center col mt-5">
      <button
        type="submit"
        class="c-btn c-btn_dark c-btn_icon"
        @click="back()"
      >
        Back to listing
        <v-icon class="icon c-text_white pr-2">mdi-undo-variant</v-icon>
      </button>
    </div>
    <!--
    <div v-for="n in response.list" :key="n.slug">
      <nuxt-link :to="'/topics_detail/'+ n.slug">{{n.ymd}} {{n.subject}}</nuxt-link>
    </div>
    -->
  </div>
</template>


<script>
import item from "../../components/topic_detail";
export default {
  auth: true,
  components: {
    "v-item": item,
  },
  /*
  async asyncData ({ route, $axios }) {
      // URLのクエリに、
      // preview_tokenが存在する場合は、previewエンドポイントへ、
      // preview_tokenが存在しない場合は、newsエンドポイントへ、
      // リクエストします。
      const previewToken = route.query.preview_token;
      let request = () => previewToken !== undefined ?
          $axios.$get(process.env.BASE_URL + '/rcms-api/1/topics_detail/preview' + '?preview_token=' + previewToken) :
          $axios.$get(process.env.BASE_URL + '/rcms-api/1/topics_detail');

      try {
          const response = await request()
          return { response }
      }catch (e) {
          console.log(e.message)
      }
  },
  */
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
          //text_size: "H2",
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
        //var text_size = response.data.details.ext_col_06;
        var texts = response.data.details.ext_col_07;
        var subtitle = response.data.details.ext_col_09;

        for (var i = 0; i < positions.length; i++) {
          var textSize = null;
          var imageUrl = null;
          /*
          if (
            text_size[i] != undefined &&
            text_size[i].hasOwnProperty("label")
          ) {
            textSize = text_size[i]["label"];
          }
          */
          if (
            image_urls[i] != undefined &&
            image_urls[i].hasOwnProperty("url")
          ) {
            imageUrl = image_urls[i]["url"] + "?width=800";
          }
          var pattern = 1;
          if (positions[i].key == "0") {
            pattern = "no image";
          } else if (positions[i].key == "1") {
            pattern = "top";
          } else if (positions[i].key == "2") {
            pattern = "left";
          } else if (positions[i].key == "3") {
            pattern = "bottom";
          } else if (positions[i].key == "4") {
            pattern = "right";
          }
          items.push({
            text: texts[i],
            pattern: pattern,
            image_url: imageUrl,
            //text_size: textSize,
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
