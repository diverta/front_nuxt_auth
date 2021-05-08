<template>
    <div>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />

        <div class="l-content_heading">
            <h3 class="slogan text-left">
                Please provide us your information, we will be in touch with you shortly. <br>
            </h3>
        </div>

        <div class="v-stepper mt-5 c-form_wrap">
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
                        class="c-btn c-btn_main"
                        :disabled="!disabled"
                        @click="submitF()"
                    >
                        Submit
                    </button>
                </div>
            </v-container>
        </div>
    </div>
</template>

<script>
import '../assets/form.css';
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import KurocoParser from '../plugins/parser.js';
import fieldUploadFile from '../components/vuetify_file_upload.vue';
import fieldVuetifyText from '../components/vuetify_text.vue';
import fieldVuetifyTextArea from '../components/vuetify_textarea.vue';
import fieldVuetifyDate from '../components/vuetify_date.vue';
import fieldVuetifyJson from '../components/vuetify_json.vue';
import fieldVuetifyPrefecture from '../components/vuetify_prefecture.vue';
import fieldVuetifyMultipleChoice from '../components/vuetify_multiple_choice.vue';
import fieldVuetifySingleChoice from '../components/vuetify_single_choice.vue';
import fieldVuetifySingleOption from '../components/vuetify_single_option.vue';

Vue.component('fieldUploadFile', fieldUploadFile);
Vue.component('fieldVuetifyDate', fieldVuetifyDate);
Vue.component('fieldVuetifyText', fieldVuetifyText);
Vue.component('fieldVuetifyTextArea', fieldVuetifyTextArea);
Vue.component('fieldVuetifyJson', fieldVuetifyJson);
Vue.component('fieldVuetifyPrefecture', fieldVuetifyPrefecture);
Vue.component('fieldVuetifySingleOption', fieldVuetifySingleOption);
Vue.component('fieldVuetifySingleChoice', fieldVuetifySingleChoice);
Vue.component('fieldVuetifyMultipleChoice', fieldVuetifyMultipleChoice);

Vue.use(VueFormGenerator);
Vue.use(KurocoParser);

export default {
    components: {
        'vue-form-generator': VueFormGenerator.component
    },
    mounted() {
        this.getSchema();
    },
    methods: {
        getModel() {
            const self = this;
            this.$store.$auth.ctx.$axios
                .get(this.inquirySchemaUrl)
                .then(function (response) {
                    const model = {};
                    const columns = response.data.details.cols;
                    for (const key in columns) {
                        if (columns.hasOwnProperty(key)) {
                            if (columns[key].hasOwnProperty('attribute')) {
                                if (columns[key].attribute.hasOwnProperty('placeholder')) {
                                    model[key] = columns[key].attribute.placeholder;
                                }
                            }
                        }
                    }
                    self.model = model;
                })
                .catch(function (error) {
                    self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                    self.$store.dispatch('snackbar/snackOn');
                });
        },
        getSchema() {
            const self = this;
            this.loading = true;
            this.$store.$auth.ctx.$axios
                .get(this.inquirySchemaUrl)
                .then(function (response) {
                    const schema = {};
                    schema.fields = [];
                    const columns = response.data.details.cols;
                    for (const key in columns) {
                        let result = {};
                        if (columns.hasOwnProperty(key)) {
                            result = self.$parse(columns[key], key);
                            if (
                                typeof result !== 'undefined' &&
                Object.keys(result).length !== 0
                            ) {
                                schema.fields.push(result);
                            }
                        }
                    }

                    self.schema = schema;
                    self.loading = false;
                })
                .catch(function (error) {
                    self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                    self.$store.dispatch('snackbar/snackOn');
                    self.loading = false;
                });
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
                sendModel.body = 'example message';
                self.$store.$auth.ctx.$axios
                    .post(this.inquirySubmitUrl, sendModel)
                    .then(function (response) {
                        if (response.data.errors.length === 0) {
                            self.$store.dispatch(
                                'snackbar/setMessage',
                                'Thanks! Your inquiry submitted.'
                            );
                            self.$store.dispatch('snackbar/snackOn');
                            // self.$router.push("/");
                        }
                    })
                    .catch(function (error) {
                        self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                        self.$store.dispatch('snackbar/snackOn');
                    });
            } else {
                self.$store.dispatch('snackbar/setError', 'Fill fields properly.');
                self.$store.dispatch('snackbar/snackOn');
            }
        }
    },
    title() {
        return 'Inquiry';
    },
    auth: true,
    data() {
        return {
            inquirySubmitUrl: '/rcms-api/1/inquiry/11',
            inquirySchemaUrl: '/rcms-api/1/inquiry/get/11',
            disabled: false,
            validForm: true,
            loading: true,
            model: {},
            schema: {}
        };
    }
};
</script>
