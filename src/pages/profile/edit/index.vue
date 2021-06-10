<template>
    <div>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />

        <div class="v-stepper c-form_wrap">
            <v-container fluid>
                <vue-form-generator
                    ref="form"
                    :schema="schema"
                    :model="model"
                    class="c-form"
                    @model-updated="onInput"
                />

                <v-checkbox v-model="disabled" class="c-form_tnc">
                    <template v-slot:label>
                        <div>I agree to the terms of Use.</div>
                    </template>
                </v-checkbox>
                <div class="text-center mb-5">
                    <button
                        type="submit"
                        block
                        x-large
                        :disabled="!disabled"
                        class="c-btn c-btn_main"
                        @click="submitF()"
                    >
                        SUBMIT
                    </button
                    >
                </div>
            </v-container>
        </div>
    </div>
</template>

<script>
import '~/assets/form.css';
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import KurocoParser from '~/plugins/parser.js';
import fieldUploadFile from '~/components/vuetify_file_upload.vue';
import fieldVuetifyText from '~/components/vuetify_text.vue';
import fieldVuetifyTextArea from '~/components/vuetify_textarea.vue';
import fieldVuetifyDate from '~/components/vuetify_date.vue';
import fieldVuetifyJson from '~/components/vuetify_json.vue';
import fieldVuetifyPrefecture from '~/components/vuetify_prefecture.vue';
import fieldVuetifyMultipleChoice from '~/components/vuetify_multiple_choice.vue';
import fieldVuetifySingleChoice from '~/components/vuetify_single_choice.vue';
import fieldVuetifySingleOption from '~/components/vuetify_single_option.vue';
import fieldVuetifyPassword from '~/components/vuetify_password.vue';

Vue.component('fieldUploadFile', fieldUploadFile);
Vue.component('fieldVuetifyDate', fieldVuetifyDate);
Vue.component('fieldVuetifyText', fieldVuetifyText);
Vue.component('fieldVuetifyTextArea', fieldVuetifyTextArea);
Vue.component('fieldVuetifyJson', fieldVuetifyJson);
Vue.component('fieldVuetifyPrefecture', fieldVuetifyPrefecture);
Vue.component('fieldVuetifySingleOption', fieldVuetifySingleOption);
Vue.component('fieldVuetifySingleChoice', fieldVuetifySingleChoice);
Vue.component('fieldVuetifyMultipleChoice', fieldVuetifyMultipleChoice);
Vue.component('fieldVuetifyPassword', fieldVuetifyPassword);

Vue.use(VueFormGenerator);
Vue.use(KurocoParser);

export default {
    auth: true,
    components: {
        'vue-form-generator': VueFormGenerator.component
    },
    methods: {
        go_page(path) {
            this.$router.push(path);
        },
        onInput (value, fieldName) {
            this.$set(this.model, fieldName, value);
        },
        submitF () {
            const self = this;
            this.validForm = true;
            for (const key in self.$children[1].$children) {
                self.$children[1].$children[key].$children[0].$refs.myForm.validate();
                if (self.$children[1].$children[key].$children[0].formValid === false) {
                    this.validForm = false;
                }
            }

            if (this.validForm) {
                const sendModel = JSON.parse(JSON.stringify(self.model));
                self.$store.$auth.ctx.$axios
                    .post('/rcms-api/1/member/update', sendModel)
                    .then(function (response) {
                        if (response.data.errors.length === 0) {
                            self.$store.dispatch(
                                'snackbar/setMessage',
                                'Your profile is changed.'
                            );
                            self.$store.dispatch('snackbar/snackOn');
                            self.$router.push('/');
                        }
                    }).catch(function (error) {
                        self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                        self.$store.dispatch('snackbar/snackOn');
                    }); ;
            } else {
                self.$store.dispatch('snackbar/setError', 'Please fill the fields properly.');
                self.$store.dispatch('snackbar/snackOn');
            }
        }
    },
    mounted() {
        if (this.$auth.loggedIn) {
            const self = this;
            this.$auth.ctx.$axios
                .get('/rcms-api/1/members/' + this.$auth.user.member_id)
                .then(function (response) {
                    for (let i = 0; i < self.schema.fields.length; i++) {
                        if (self.schema.fields[i].model === 'name1' && response.data.details.name1) {
                            self.schema.fields[i].text = response.data.details.name1;
                        } else if (self.schema.fields[i].model === 'name2' && response.data.details.name2) {
                            self.schema.fields[i].text = response.data.details.name2;
                        } else if (self.schema.fields[i].model === 'hire_date' && response.data.details.hire_date) {
                            self.schema.fields[i].time = response.data.details.hire_date;
                        } else if (self.schema.fields[i].model === 'department' && response.data.details.department) {
                            self.schema.fields[i].text = response.data.details.department;
                        } else if (self.schema.fields[i].model === 'position' && response.data.details.position) {
                            self.schema.fields[i].text = response.data.details.position;
                        } else if (self.schema.fields[i].model === 'tel' && response.data.details.tel) {
                            self.schema.fields[i].text = response.data.details.tel;
                        } else if (self.schema.fields[i].model === 'email' && response.data.details.email) {
                            self.schema.fields[i].text = response.data.details.email;
                        } else if (self.schema.fields[i].model === 'notes' && response.data.details.notes) {
                            self.schema.fields[i].text = response.data.details.notes;
                        }
                    }
                    /*
          for (var i = 0; i < self.schema.fields[10].options.length; ++i) {
            if (
              self.schema.fields[10].options[i].value ==
              response.data.details.tdfk_cd
            ) {
              self.schema.fields[10].option = self.schema.fields[10].options[i];
            }
          }
          for (var i = 0; i < self.schema.fields[10].contents.length; ++i) {
            d
            if (
              self.schema.fields[10].contents[i].key ==
              response.data.details.pull_down.key
            ) {
              //self.schema.fields[13].contents.value = self.schema.fields[13].cotnent[i];
              console.log(self.schema.fields[10].contents.value);
            }
          }
          */
                    self.loading = false;
                })
                .catch(function (error) {
                    self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                    self.$store.dispatch('snackbar/snackOn');
                    self.loading = false;
                });
        }
    },
    data() {
        return {
            // form default values
            active_tab: 2,
            email: '',
            name1: '',
            name2: '',
            zip_code: '',
            tel: '',
            multiple_check: '',
            inquirySubmitUrl: '/rcms-api/1/inquiry/9',
            inquirySchemaUrl: '/rcms-api/1/inquiry/get/9',
            auth: false,
            validForm: true,
            loading: true,
            disabled: false,
            schema: {
                fields: [
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        min: 0,
                        max: 100,
                        label: 'First Name',
                        model: 'name1',
                        text: '',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        min: 0,
                        max: 100,
                        label: 'Last Name',
                        text: '',
                        model: 'name2',
                        required: true
                    },
                    {
                        type: 'vuetifyDate',
                        // inputType: "picker",
                        label: 'Hire Date',
                        model: 'hire_date',
                        required: true,
                        time: '1988-10-09'
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: 'Department',
                        model: 'department',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: 'Position',
                        model: 'position',
                        required: false
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: 'Phone',
                        model: 'tel',
                        texttype: 'tel',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        min: 0,
                        max: 100,
                        label: 'Email address',
                        model: 'email',
                        text: '',
                        texttype: 'email',
                        required: true
                    },
                    {
                        type: 'vuetifyPassword',
                        inputType: 'text',
                        label: 'Password',
                        text: '',
                        model: 'login_pwd',
                        required: false
                    },
                    /*
          {
            type: "vuetifyPrefecture",
            inputType: "text",
            label: "Prefecture",
            model: "tdfk_cd",
            option: {
              value: "01",
              text: "北海道",
            },
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
          */
                    {
                        type: 'UploadFile',
                        label: 'Avatar',
                        model: 'profileimage',
                        required: false,
                        visible: (model, field, form) => model.choice === 'Check a boolean value'
                    },
                    {
                        model: 'pull_down',
                        label: 'Office',
                        contents: [
                            {
                                key: 0,
                                value: ' ',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 1,
                                value: 'Tokyo',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 2,
                                value: 'Osaka',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 3,
                                value: 'Malaysia',
                                default: false,
                                attribute: { group: '2' }
                            }
                        ],
                        required: false,
                        type: 'VuetifySingleOption'
                    },
                    {
                        model: 'multiple_check',
                        label: 'Hobby',
                        contents: [
                            {
                                key: 1,
                                value: 'Reading',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 2,
                                value: 'Watching TV',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 3,
                                value: 'Family Time',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 4,
                                value: 'Going to Movies',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 5,
                                value: 'Fishing',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 6,
                                value: 'Computer',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 7,
                                value: 'Gardening',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 8,
                                value: 'Renting Movies',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 9,
                                value: 'Walking',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 10,
                                value: 'Exercise',
                                default: false,
                                attribute: { group: '2' }
                            }
                        ],
                        required: false,
                        type: 'vuetifyMultipleChoice'
                    },
                    {
                        model: 'notes',
                        type: 'vuetifyTextArea',
                        inputType: 'text',
                        label: 'Notes',
                        placeholder: '',
                        text: '',
                        required: false,
                        counter: 400,
                        max: 400,
                        min: 0
                    }
                ]
            }
        };
    }
};
</script>
