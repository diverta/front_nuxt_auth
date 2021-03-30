<template>
  <div>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="orange white-4"
    ></v-progress-linear>
    <h1>Inquiry</h1>
    <br />
    <br />

    <h3>
      Please provide your <br />
      inquiry
    </h3>
    <br />
    <div class="theme--light v-stepper">
      <v-container fluid>
        <vue-form-generator
          ref="form"
          :schema="schema"
          :model="model"
          @model-updated="onInput"
        >
        </vue-form-generator>

        <v-checkbox v-model="disabled">
          <template v-slot:label>
            <div>I agree to the terms of Use.</div>
          </template>
        </v-checkbox>
        <v-btn
          type="submit"
          block
          x-large
          color="success"
          class="white--text"
          @click="submitF()"
          :disabled="!disabled"
          >Submit</v-btn
        >
      </v-container>
    </div>
  </div>
</template>

<script>
import "../assets/form.css";
import Vue from "vue";
import VueFormGenerator from "vue-form-generator";
import KurocoParser from "../plugins/parser.js";
import fieldUploadFile from "../components/vuetify_file_upload.vue";
import fieldVuetifyText from "../components/vuetify_text.vue";
import fieldVuetifyTextArea from "../components/vuetify_textarea.vue";
import fieldVuetifyDate from "../components/vuetify_date.vue";
import fieldVuetifyJson from "../components/vuetify_json.vue";
import fieldVuetifyPrefecture from "../components/vuetify_prefecture.vue";
import fieldVuetifyMultipleChoice from "../components/vuetify_multiple_choice.vue";
import fieldVuetifySingleChoice from "../components/vuetify_single_choice.vue";
import fieldVuetifySingleOption from "../components/vuetify_single_option.vue";

Vue.component("fieldUploadFile", fieldUploadFile);
Vue.component("fieldVuetifyDate", fieldVuetifyDate);
Vue.component("fieldVuetifyText", fieldVuetifyText);
Vue.component("fieldVuetifyTextArea", fieldVuetifyTextArea);
Vue.component("fieldVuetifyJson", fieldVuetifyJson);
Vue.component("fieldVuetifyPrefecture", fieldVuetifyPrefecture);
Vue.component("fieldVuetifySingleOption", fieldVuetifySingleOption);
Vue.component("fieldVuetifySingleChoice", fieldVuetifySingleChoice);
Vue.component("fieldVuetifyMultipleChoice", fieldVuetifyMultipleChoice);

Vue.use(VueFormGenerator);
Vue.use(KurocoParser);

export default {
  components: {
    "vue-form-generator": VueFormGenerator.component,
  },
  mounted() {
    this.getSchema();
  },
  methods: {
    getModel() {
      let self = this;
      this.$store.$auth.ctx.$axios
        .get(this.inquirySchemaUrl)
        .then(function (response) {
          var model = {};
          var columns = response.data.details.cols;
          for (var key in columns) {
            if (columns.hasOwnProperty(key)) {
              if (columns[key].hasOwnProperty("attribute")) {
                if (columns[key]["attribute"].hasOwnProperty("placeholder")) {
                  model[key] = columns[key]["attribute"]["placeholder"];
                }
              }
            }
          }
          self.model = model;
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
        });
    },
    getSchema() {
      let self = this;
      this.loading = true;
      this.$store.$auth.ctx.$axios
        .get(this.inquirySchemaUrl)
        .then(function (response) {
          var schema = {};
          schema["fields"] = [];
          var columns = response.data.details.cols;
          for (var key in columns) {
            var result = {};
            if (columns.hasOwnProperty(key)) {
              result = self.$parse(columns[key], key);
              if (
                typeof result != "undefined" &&
                Object.keys(result).length != 0
              ) {
                schema["fields"].push(result);
              }
            }
          }

          self.schema = schema;
          self.loading = false;
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
          self.loading = false;
        });
    },
    onInput: function (value, fieldName) {
      this.$set(this.model, fieldName, value);
    },
    submitF: function () {
      let self = this;

      this.validForm = true;
      for (var key in self.$children[1].$children) {
        self.$children[1].$children[key].$children[0].$refs.myForm.validate();
        if (self.$children[1].$children[key].$children[0].formValid == false) {
          this.validForm = false;
        }
      }

      if (this.validForm) {
        var send_model = JSON.parse(JSON.stringify(self.model));
        send_model["body"] = "example message";
        self.$store.$auth.ctx.$axios
          .post(this.inquirySubmitUrl, send_model)
          .then(function (response) {
            if (response.data.errors.length == 0) {
              self.$store.dispatch(
                "snackbar/setMessage",
                "Thanks! Your inquiry submitted."
              );
              self.$store.dispatch("snackbar/snackOn");
              self.$router.push("/");
            }
          })
          .catch(function (error) {
            self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
            self.$store.dispatch("snackbar/snackOn");
          });
      } else {
        self.$store.dispatch("snackbar/setError", "Fill fields properly.");
        self.$store.dispatch("snackbar/snackOn");
      }
    },
  },
  title() {
    return "Inquiry";
  },
  auth: true,
  data() {
    return {
      inquirySubmitUrl: "/rcms-api/1/inquiry/11",
      inquirySchemaUrl: "/rcms-api/1/inquiry/get/11",
      disabled: false,
      validForm: true,
      loading: true,
      model: {},
      schema: {},
    };
  },
};
</script>
