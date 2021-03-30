<template>
  <div>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="orange white-4"
    ></v-progress-linear>
    <br />
    <br />

    <h1 align="center">Sign up</h1>
    <br />
    <div class="theme--light v-stepper">
      <v-container fluid>
        <br /><br />
        <h4 style="font-weight: normal">
          Please complete the form below to sign up
        </h4>
        <br /><br />
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
          >SUBMIT</v-btn
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
import fieldVuetifyPassword from "../components/vuetify_password.vue";

Vue.component("fieldUploadFile", fieldUploadFile);
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
  components: {
    "vue-form-generator": VueFormGenerator.component,
  },
  methods: {
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
        this.loading = true;
        this.$auth.ctx.$axios
          .post("/rcms-api/1/member/regist", send_model)
          .then(function (response) {
            if (response.data.errors.length === 0) {
              self.$store.dispatch("snackbar/setMessage", "会員登録しました");
              self.$store.dispatch("snackbar/snackOn");
            }
            self.loading = false;
            self.$router.push("/");
          })
          .catch(function (error) {
            self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
            self.$store.dispatch("snackbar/snackOn");
            self.loading = false;
          });
      } else {
        self.$store.dispatch("snackbar/setError", "Fill fields properly.");
        self.$store.dispatch("snackbar/snackOn");
        self.loading = false;
      }
    },
  },
  mounted() {},
  auth: false,
  data() {
    return {
      // form default values
      email: "",
      name1: "",
      name2: "",
      zip_code: "",
      tel: "",
      inquirySubmitUrl: "/rcms-api/1/inquiry/9",
      inquirySchemaUrl: "/rcms-api/1/inquiry/get/9",
      validForm: true,
      loading: false,
      disabled: false,
      model: {},
      schema: {
        fields: [
          {
            type: "vuetifyText",
            inputType: "text",
            min: 0,
            max: 100,
            label: "First Name",
            model: "name1",
            text: "",
            required: true,
          },
          {
            type: "vuetifyText",
            inputType: "text",
            min: 0,
            max: 100,
            label: "Last Name",
            text: "",
            model: "name2",
            required: true,
          },
          {
            type: "vuetifyText",
            inputType: "text",
            min: 0,
            max: 100,
            label: "Email address",
            model: "email",
            text: "",
            texttype: "email",
            required: true,
          },
          {
            type: "vuetifyPassword",
            inputType: "text",
            label: "Password",
            text: "",
            model: "login_pwd",
            required: true,
          },
          {
            type: "vuetifyText",
            inputType: "text",
            label: "Zip Code",
            texttype: "zip",
            text: "",
            min: 0,
            max: 100,
            model: "zip_code",
            required: true,
          },
          {
            type: "vuetifyPrefecture",
            inputType: "text",
            label: "Prefecture",
            model: "tdfk_cd",
            options: [
              { value: "01", text: "北海道" },
              { value: "02", text: "青森県" },
              { value: "03", text: "岩手県" },
              { value: "04", text: "宮城県" },
              { value: "05", text: "秋田県" },
              { value: "06", text: "山形県" },
              { value: "07", text: "福島県" },
              { value: "08", text: "茨城県" },
              { value: "09", text: "栃木県" },
              { value: "10", text: "群馬県" },
              { value: "11", text: "埼玉県" },
              { value: "12", text: "千葉県" },
              { value: "13", text: "東京都" },
              { value: "14", text: "神奈川県" },
              { value: "15", text: "新潟県" },
              { value: "16", text: "富山県" },
              { value: "17", text: "石川県" },
              { value: "18", text: "福井県" },
              { value: "19", text: "山梨県" },
              { value: "20", text: "長野県" },
              { value: "21", text: "岐阜県" },
              { value: "22", text: "静岡県" },
              { value: "23", text: "愛知県" },
              { value: "24", text: "三重県" },
              { value: "25", text: "滋賀県" },
              { value: "26", text: "京都府" },
              { value: "27", text: "大阪府" },
              { value: "28", text: "兵庫県" },
              { value: "29", text: "奈良県" },
              { value: "30", text: "和歌山県" },
              { value: "31", text: "鳥取県" },
              { value: "32", text: "島根県" },
              { value: "33", text: "岡山県" },
              { value: "34", text: "広島県" },
              { value: "35", text: "山口県" },
              { value: "36", text: "徳島県" },
              { value: "37", text: "香川県" },
              { value: "38", text: "愛媛県" },
              { value: "39", text: "高知県" },
              { value: "40", text: "福岡県" },
              { value: "41", text: "佐賀県" },
              { value: "42", text: "長崎県" },
              { value: "43", text: "熊本県" },
              { value: "44", text: "大分県" },
              { value: "45", text: "宮崎県" },
              { value: "46", text: "鹿児島県" },
              { value: "47", text: "沖縄県" },
            ],
            required: true,
          },
          {
            type: "vuetifyText",
            inputType: "text",
            text: "",
            min: 0,
            max: 100,
            label: "Address",
            model: "address1",
            required: true,
          },
          {
            type: "vuetifyText",
            inputType: "text",
            text: "",
            min: 0,
            max: 100,
            label: "Phone",
            model: "tel",
            texttype: "tel",
            required: true,
          },
          {
            type: "vuetifyText",
            inputType: "text",
            text: "",
            min: 0,
            max: 100,
            label: "Department",
            model: "department",
            required: false,
          },
          {
            model: "ext_01",
            label: "Label",
            contents: [
              {
                key: 1,
                value: "Radio1",
                default: false,
                attribute: { group: "1" },
              },
              {
                key: 2,
                value: "Radio2",
                default: false,
                attribute: { group: "1" },
              },
              {
                key: 3,
                value: "Radio3",
                default: false,
                attribute: { group: "1" },
              },
            ],
            required: false,
            type: "vuetifySingleChoice",
          },
          {
            model: "ext_02",
            label: "Label",
            contents: [
              {
                key: 1,
                value: "Check1",
                default: false,
                attribute: { group: "1" },
              },
              {
                key: 2,
                value: "Check2",
                default: false,
                attribute: { group: "1" },
              },
              {
                key: 3,
                value: "Check3",
                default: false,
                attribute: { group: "1" },
              },
            ],
            required: false,
            type: "vuetifyMultipleChoice",
          },
          {
            model: "notes",
            type: "vuetifyTextArea",
            inputType: "text",
            label: "Notes",
            placeholder: "",
            text: "",
            required: false,
            counter: 400,
            max: 400,
            min: 0,
          },
        ],
      },
    };
  },
};
</script>
