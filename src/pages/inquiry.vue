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
                {{$t('inquiry.message')}}<br>
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
                        <div>{{$t('common.agree')}}</div>
                    </template>
                </v-checkbox>

                <div class="text-center mb-5">
                    <button
                        type="submit"
                        class="c-btn c-btn_main"
                        :disabled="!disabled"
                        @click="submitF()"
                    >
                        {{$t('common.submit')}}
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
    title() {
        return 'Inquiry';
    },
    auth: true,
    data() {
        return {
            inquirySubmitUrl: '/rcms-api/1/inquiry/1',
            inquirySchemaUrl: '/rcms-api/1/inquiry/get/1',
            disabled: false,
            validForm: true,
            loading: true,
            model: {},
            schema: {}
        };
    },
    components: {
        'vue-form-generator': VueFormGenerator.component
    },
    mounted() {
        this.getSchema();
    },
    methods: {
        async getSchema() {
            this.loading = true;
            let response;
            try {
                response = await this.$store.$auth.ctx.$axios.get(this.inquirySchemaUrl)
                this.schema = {
                    fields: Object.entries(response.data.details.cols)
                        .map(([key, val]) => this.$parse(val, key))
                        .filter(res => res)
                }
            } catch (e) {
                this.$store.dispatch('snackbar/popupError', e?.response?.data.errors?.[0]?.message);
            }
            this.loading = false;
        },
        onInput (value, fieldName) {
            this.$set(this.model, fieldName, value);
        },
        async submitF () {
            this.validForm = true;
            for (const key in this.$children[1].$children) {
                this.$children[1].$children[key].$children[0].$refs.myForm.validate();
                if (this.$children[1].$children[key].$children[0].formValid === false) {
                    this.validForm = false;
                }
            }

            if (!this.validForm) {
                this.$store.dispatch('snackbar/popupError', this.$i18n.t('verify.fille_property'));
                return;
            }

            try {
                const sendModel = JSON.parse(JSON.stringify(this.model));
                sendModel.body = 'example message';
                const response = await this.$store.$auth.ctx.$axios.post(this.inquirySubmitUrl, sendModel);
                if (response.data.errors.length === 0) {
                    this.$store.dispatch(
                        'snackbar/setMessage', this.$i18n.t('inquiry.thanks')
                    );
                }
            } catch (e) {
                this.$store.dispatch('snackbar/popupError', e?.response?.data?.errors?.[0]?.message);
            };
        }
    },
};
</script>
