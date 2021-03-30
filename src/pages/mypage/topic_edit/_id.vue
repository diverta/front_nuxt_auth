<template>
  <div fluid>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="orange white-4"
    ></v-progress-linear>
    <v-card>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title
          >Select type of the Topic #{{ topic_id }}
        </v-toolbar-title>
        <v-col class="text-right">
          <v-btn class="ma-2" color="green" dark @click="submit()">
            Save
            <v-icon dark right> mdi-checkbox-marked-circle </v-icon>
          </v-btn>
        </v-col>
      </v-toolbar>
      <v-tabs v-model="tab_id">
        <v-tab @click="change_tab(0)">
          <v-icon left> mdi-file-excel </v-icon>
          File document
        </v-tab>
        <v-tab @click="change_tab(1)">
          <v-icon left> mdi-launch </v-icon>
          Url link
        </v-tab>
        <v-tab @click="change_tab(2)">
          <v-icon left> mdi-details </v-icon>
          Detail page
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-container>
              <vue-form-generator
                ref="form"
                :schema="schemaFile"
                :model="model"
                @model-updated="onInput"
              >
              </vue-form-generator>
            </v-container>
            <br />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-container>
              <vue-form-generator
                ref="form"
                :schema="schemaUrl"
                :model="model"
                @model-updated="onInput"
              >
              </vue-form-generator>
            </v-container>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-row v-for="item in schemaDetailList" v-bind:key="item.id">
            <v-col>
              <v-card outlined>
                <v-container>
                  <vue-form-generator
                    ref="form"
                    :schema="item"
                    :model="model"
                    @model-updated="onInput"
                  >
                  </vue-form-generator>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import "~/assets/form.css";
import Vue from "vue";
import VueFormGenerator from "vue-form-generator";
import KurocoParser from "~/plugins/parser.js";
import fieldVuetifyUploadFile from "~/components/vuetify_file_upload.vue";
import fieldVuetifyUploadImage from "~/components/vuetify_image_upload.vue";
import fieldVuetifyText from "~/components/vuetify_text.vue";
import fieldVuetifyTextArea from "~/components/vuetify_textarea.vue";
import fieldVuetifyDate from "~/components/vuetify_date.vue";
import fieldVuetifyJson from "~/components/vuetify_json.vue";
import fieldVuetifyPrefecture from "~/components/vuetify_prefecture.vue";
import fieldVuetifyMultipleChoice from "~/components/vuetify_multiple_choice.vue";
import fieldVuetifySingleChoice from "~/components/vuetify_single_choice.vue";
import fieldVuetifySingleOption from "~/components/vuetify_single_option.vue";
import fieldVuetifyPassword from "~/components/vuetify_password.vue";

Vue.component("fieldVuetifyUploadFile", fieldVuetifyUploadFile);
Vue.component("fieldVuetifyUploadImage", fieldVuetifyUploadImage);
Vue.component("fieldVuetifyDate", fieldVuetifyDate);
Vue.component("fieldVuetifyText", fieldVuetifyText);
Vue.component("fieldVuetifyTextArea", fieldVuetifyTextArea);
Vue.component("fieldVuetifyJson", fieldVuetifyJson);
Vue.component("fieldVuetifyPrefecture", fieldVuetifyPrefecture);
Vue.component("fieldVuetifySingleOption", fieldVuetifySingleOption);
Vue.component("fieldVuetifySingleChoice", fieldVuetifySingleChoice);
Vue.component("fieldVuetifyMultipleChoice", fieldVuetifyMultipleChoice);
Vue.component("fieldVuetifyPassword", fieldVuetifyPassword);

Vue.use(VueFormGenerator);
Vue.use(KurocoParser);

export default {
  auth: true,
  methods: {
    onInput: function (value, fieldName) {
      this.$set(this.model, fieldName, value);
    },
    submit() {
      let self = this;
      var send_model = {};
      if (this.tab_id == 0) {
        var file_type = this.schemaFile.fields[0].radioGroup;
        var file = this.model.file;
        send_model = {
          ext_col_01: {
            key: file_type.key,
            value: file_type.value,
          },
          ext_col_02: file,
        };
        if (file_type == null || file == null) {
          this.$store.dispatch(
            "snackbar/setError",
            "Choose file type/ upload file."
          );
          this.$store.dispatch("snackbar/snackOn");
        } else {
          send_model = {
            ext_col_01: {
              key: file_type.key,
              label: file_type.value,
            },
            ext_col_02: file,
          };
        }
      } else if (this.tab_id == 1) {
        var url = this.model.url;
        var to_display = this.model.to_display;

        if (typeof url == "string" || typeof to_display == "string") {
          if (typeof url != "string") {
            url = this.schemaUrl.fields[0].text;
          }
          if (typeof to_display != "string") {
            to_display = this.schemaUrl.fields[1].text;
          }
          send_model = {
            ext_col_01: {
              key: "url",
              label: "url",
            },
            ext_col_03: {
              title: to_display,
              url: url,
            },
          };
        }
      } else if (this.tab_id == 2) {
        send_model = {
          ext_col_01: {
            key: "data",
            label: "data",
          },
        };
        send_model["ext_col_04"] = this.json.ext_col_04;
        send_model["ext_col_06"] = this.json.ext_col_06;
        send_model["ext_col_07"] = this.json.ext_col_07;
        send_model["ext_col_09"] = this.json.ext_col_09;
        send_model["ext_col_05"] = new Array(30).fill({});
        for (var i = 0; i < this.json.ext_col_05.length; ++i) {
          send_model["ext_col_05"][i] = {
            id: this.json.ext_col_05[i].id,
          };
        }
        for (var key in this.model) {
          if (this.model.hasOwnProperty(key)) {
            if (
              key.startsWith("ext_col_04") ||
              key.startsWith("ext_col_05") ||
              key.startsWith("ext_col_06") ||
              key.startsWith("ext_col_07") ||
              key.startsWith("ext_col_09")
            ) {
              var arr = key.split("_");
              var index_json = arr[0] + "_" + arr[1] + "_" + arr[2];
              var index_arr = parseInt(arr[3]);
              send_model[index_json][index_arr] = this.model[key];
            }
          }
        }
      }

      self.$store.$auth.ctx.$axios
        .post(this.update_url, send_model)
        .then(function (response) {
          if (response.data.errors.length == 0) {
            self.$store.dispatch(
              "snackbar/setMessage",
              "Thanks! Your topic is updated."
            );
            self.$store.dispatch("snackbar/snackOn");
            self.$router.push("/mypage/posted_list");
          }
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
        });
    },
    change_tab(id) {
      this.tab_id = id;
    },
  },
  data() {
    return {
      topic_id: null,
      update_url: "",
      text: "",
      loading: true,
      tab_id: null,
      json: "",
      model: {},
      schemaDetailList: [],
      schemaFile: {
        fields: [
          {
            model: "type",
            label: "File type",
            radioGroup: null,
            contents: [
              {
                key: "pdf",
                value: "pdf",
                default: false,
                attribute: { group: "1" },
              },
              {
                key: "word",
                value: "word",
                default: false,
                attribute: { group: "1" },
              },
              {
                key: "excel",
                value: "excel",
                default: false,
                attribute: { group: "1" },
              },
            ],
            required: true,
            type: "vuetifySingleChoice",
          },
          {
            model: "file",
            type: "vuetifyUploadFile",
            file: null,
            required: true,
          },
        ],
      },
      schemaUrl: {
        fields: [
          {
            type: "vuetifyText",
            inputType: "text",
            text: "",
            min: 0,
            max: 100,
            label: "Link URL",
            model: "url",
            texttype: "url",
            required: true,
          },
          {
            type: "vuetifyText",
            inputType: "text",
            text: "",
            min: 0,
            max: 100,
            label: "Text to display",
            model: "to_display",
            required: true,
          },
        ],
      },
    };
  },
  mounted() {
    this.topic_id = this.$route.params.id;
    this.update_url = "/rcms-api/1/topics/update/" + this.topic_id;
    var url = "/rcms-api/1/topic/detail/" + this.topic_id;
    let self = this;

    this.loading = true;
    this.$store.$auth.ctx.$axios
      .get(url)
      .then(function (response) {
        var json = response.data.details;
        self.json = json;

        if (json.ext_col_01.key == "url") {
          self.schemaUrl.fields[0].text = json.ext_col_03.url;
          self.schemaUrl.fields[1].text = json.ext_col_03.title;
          self.tab_id = 1;
        } else if (
          json.ext_col_01.key == "pdf" ||
          json.ext_col_01.key == "word" ||
          json.ext_col_01.key == "excel"
        ) {
          var file_format = {};
          for (var i = 0; i < 3; ++i) {
            if (
              self.schemaFile.fields[0].contents[i].key == json.ext_col_01.key
            ) {
              file_format = self.schemaFile.fields[0].contents[i];
            }
          }
          self.schemaFile.fields[0].radioGroup = file_format;
          self.schemaFile.fields[1].file = new File([""], json.ext_col_02.url);
          self.tab_id = 0;
        } else {
          self.tab_id = 2;
        }

        for (var i = 0; i < 30; ++i) {
          var schemaDetail = {
            fields: [],
          };
          var label_text = "";
          var textarea = "";
          var url = null;
          var image_pos = {};
          var text_size = {};

          if (json.ext_col_01.key == "data") {
            if (typeof json.ext_col_09[i] == "string") {
              label_text = json.ext_col_09[i];
            }
            if (typeof json.ext_col_07[i] == "string") {
              textarea = json.ext_col_07[i];
            }
            if (
              json.ext_col_05[i] != undefined &&
              typeof json.ext_col_05[i].url == "string"
            ) {
              url = json.ext_col_05[i].url;
            }
            image_pos = json.ext_col_04[i];
            text_size = json.ext_col_06[i];
          }
          schemaDetail.fields.push({
            type: "vuetifyText",
            inputType: "text",
            text: label_text,
            min: 0,
            max: 100,
            label: "subtitle_" + i.toString(),
            model: "ext_col_09_" + i.toString(),
            required: false,
          });
          schemaDetail.fields.push({
            model: "ext_col_07_" + i.toString(),
            type: "vuetifyTextArea",
            inputType: "text",
            label: "text_" + i.toString(),
            placeholder: "",
            text: textarea,
            required: false,
            counter: 1000,
            max: 1000,
            min: 0,
          });
          schemaDetail.fields.push({
            model: "ext_col_06_" + i.toString(),
            type: "vuetifySingleOption",
            label: "text_size_" + i.toString(),
            option: text_size,
            contents: [
              { key: "1", value: "H2" },
              { key: "2", value: "H3" },
              { key: "3", value: "H4" },
              { key: "4", value: "H5" },
              { key: "5", value: "No level" },
            ],
            required: true,
            edit: true,
          });
          schemaDetail.fields.push({
            model: "ext_col_04_" + i.toString(),
            type: "vuetifySingleOption",
            label: "image_position_" + i.toString(),
            option: image_pos,
            contents: [
              { key: "1", value: "Top" },
              { key: "2", value: "Left" },
              { key: "4", value: "Right" },
              { key: "3", value: "Bottom" },
              { key: "5", value: "No image" },
            ],
            required: true,
            edit: true,
          });
          schemaDetail.fields.push({
            model: "ext_col_05_" + i.toString(),
            type: "vuetifyUploadImage",
            url: url,
          });
          self.schemaDetailList.push(schemaDetail);
        }
        self.loading = false;
      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
        self.loading = false;
      });
  },
};
</script>
