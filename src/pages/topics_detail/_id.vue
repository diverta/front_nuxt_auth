<template>
    <div>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />
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
                            <v-icon x-large left>
                                mdi-star
                            </v-icon>
                        </v-btn>
                    </div>
                </v-card>
            </v-card>
            <v-row v-for="item in items" :key="item.id" class="p-article_content">
                <v-item
                    :text="item.text"
                    :image_url="item.image_url"
                    :subtitle="item.subtitle"
                    :pattern="item.pattern"
                />
            </v-row>
        </v-col>
        <v-col>
            <div v-if="file_url || file_download" class="p-article_footer-content">
                <h3 class="heading">Files:</h3>
                <a v-if="file_url" :href="file_url" target="_blank" class="c-btn c-btn_dark p-article_file">
                    View
                    <v-icon v-if="file_type == 'pdf'">mdi-pdf-box</v-icon>
                    <v-icon v-else-if="file_type == 'excel'">mdi-microsoft-excel</v-icon>
                    <v-icon v-else-if="file_type == 'word'">mdi-file-word</v-icon>
                    <v-icon v-else-if="file_type == 'url'">mdi-launch</v-icon>
                    <v-icon v-else-if="file_type == 'data'">mdi-file-document</v-icon>
                </a>
                <a v-if="file_download" :href="file_download" target="_blank" class="c-btn c-btn_main p-article_file">
                    Download
                    <v-icon v-if="file_type == 'pdf'">mdi-pdf-box</v-icon>
                    <v-icon v-else-if="file_type == 'excel'">mdi-microsoft-excel</v-icon>
                    <v-icon v-else-if="file_type == 'word'">mdi-file-word</v-icon>
                    <v-icon v-else-if="file_type == 'url'">mdi-launch</v-icon>
                    <v-icon v-else-if="file_type == 'data'">mdi-file-document</v-icon>
                </a>
            </div>
            <div v-if="link_url" class="p-article_footer-content">
                <h3 class="heading">Links:</h3> 
                <a v-if="link_url" :href="link_url" target="_blank" class="c-link">
                    <v-icon v-if="file_type == 'pdf'">mdi-open-in-new</v-icon> 
                    <span v-if="link_title">{{ link_title }}</span>
                    <span v-else>{{ link_url }}</span>
                </a>
            </div>
        </v-col>
        <div class="text-center col mt-5">
            <button
                type="submit"
                class="c-btn c-btn_dark c-btn_icon"
                @click="back()"
            >
                Back to listing
                <v-icon class="icon c-text_white pr-2">
                    mdi-undo-variant
                </v-icon>
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
import item from '../../components/topic_detail';
export default {
    auth: true,
    components: {
        'v-item': item
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
            const self = this;
            if (this.color === 'gray') {
                this.$store.$auth.ctx.$axios
                    .post('/rcms-api/1/favorites', {
                        module_type: 'topics',
                        module_id: parseInt(this.topic_id)
                    })
                    .then(function (response) {
                        self.color = 'red';
                    })
                    .catch(function () {});
            } else {
                this.$store.$auth.ctx.$axios
                    .post('/rcms-api/1/favorites/delete', {
                        module_type: 'topics',
                        module_id: parseInt(this.topic_id)
                    })
                    .then(function (response) {
                        self.color = 'gray';
                    })
                    .catch(function (error) {
                        self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                        self.$store.dispatch('snackbar/snackOn');
                    });
            }
        }
    },
    data() {
        return {
            label: '',
            date: '',
            title: '',
            color: 'white',
            items: [
                {
                    text: '',
                    pattern: '1',
                    image_url: '',
                    // text_size: "H2",
                    subtitle: 'type 1'
                }
            ],
            loading: true,
            topic_id: 957,
            file_type: '',
            file_url: '',
            link_url: '',
            link_title: '',
        };
    },
    mounted() {
        this.topic_id = this.$route.params.id;
        this.loading = true;
        const url =
      '/rcms-api/1/topic/detail/' +
      this.topic_id;
        const self = this;
        this.$store.$auth.ctx.$axios
            .get(url)
            .then(function (response) {
                const items = [];
                self.label = response.data.details.contents_type_nm;
                self.title = response.data.details.subject;
                self.date = response.data.details.inst_ymdhi
                    .substring(0, 10)
                    .replaceAll('-', '/');
                const positions = response.data.details.ext_col_04;
                const imageUrls = response.data.details.ext_col_05;
                // var text_size = response.data.details.ext_col_06;
                const texts = response.data.details.ext_col_07;
                const subtitle = response.data.details.ext_col_09;
                self.file_type = response.data.details.ext_col_01.key;
                self.file_url = response.data.details.ext_col_02.url;
                self.file_download = response.data.details.ext_col_02.dl_link;
                self.link_url = response.data.details.ext_col_03.url;
                self.link_title = response.data.details.ext_col_03.title;

                for (let i = 0; i < positions.length; i++) {
                    let imageUrl = null;
                    if (
                        imageUrls[i] !== undefined && imageUrls[i].hasOwnProperty('url')
                    ) {
                        imageUrl = imageUrls[i].url + '?width=800';
                    }
                    let pattern = '1';
                    if (positions[i].key === '0') {
                        pattern = 'no image';
                    } else if (positions[i].key === '1') {
                        pattern = 'top';
                    } else if (positions[i].key === '2') {
                        pattern = 'left';
                    } else if (positions[i].key === '3') {
                        pattern = 'bottom';
                    } else if (positions[i].key === '4') {
                        pattern = 'right';
                    }
                    items.push({
                        text: texts[i],
                        pattern,
                        image_url: imageUrl,
                        // text_size: textSize,
                        subtitle: subtitle[i]
                    });
                }
                self.items = items;
                self.loading = false;
            })
            .catch(function (error) {
                self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                self.$store.dispatch('snackbar/snackOn');
            });

      const favoritesUrl =
      '/rcms-api/1/favorites?member_id=' +
      this.$auth.user.member_id +
      '&module_type=topics&module_id=' +
      this.topic_id;
        this.$store.$auth.ctx.$axios
            .get(favoritesUrl)
            .then(function (response) {
                if (response.data.pageInfo.totalCnt > 0) {
                    self.color = 'red';
                } else {
                    self.color = 'gray';
                }
            })
            .catch(function (error) {
                self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                self.$store.dispatch('snackbar/snackOn');
                self.color = 'gray';
            });
    }
};
</script>
