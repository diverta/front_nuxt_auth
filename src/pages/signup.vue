<template>
    <div class="l-content_maxWidth-sm mb-5 pb-5">
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />
        <br>
        <br>

        <br>
        <div class="v-stepper c-form_wrap">
            <v-container fluid>
                <div class="l-content_heading">
                    <h1>Sign up</h1>
                    <h4 class="slogan">
                        Please complete the form below to sign up
                    </h4>
                </div>
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
                        class="c-btn c-btn_dark"
                        :disabled="!disabled"
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
import '../assets/form.css';
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import KurocoParser from '../plugins/parser.js';
import fieldUploadFile from '../components/vuetify_file_upload.vue';
import fieldUploadImage from '../components/vuetify_image_upload.vue';
import fieldVuetifyText from '../components/vuetify_text.vue';
import fieldVuetifyTextArea from '../components/vuetify_textarea.vue';
import fieldVuetifyDate from '../components/vuetify_date.vue';
import fieldVuetifyJson from '../components/vuetify_json.vue';
import fieldVuetifyPrefecture from '../components/vuetify_prefecture.vue';
import fieldVuetifyMultipleChoice from '../components/vuetify_multiple_choice.vue';
import fieldVuetifySingleChoice from '../components/vuetify_single_choice.vue';
import fieldVuetifySingleOption from '../components/vuetify_single_option.vue';
import fieldVuetifyPassword from '../components/vuetify_password.vue';

Vue.component('fieldUploadFile', fieldUploadFile);
Vue.component('fieldUploadImage', fieldUploadImage);
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
    components: {
        'vue-form-generator': VueFormGenerator.component
    },
    methods: {
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
                this.loading = true;
                this.$auth.ctx.$axios
                    .post('/rcms-api/1/member/regist', sendModel)
                    .then(function (response) {
                        if (response.data.errors.length === 0) {
                            self.$store.dispatch('snackbar/setMessage', 'Your registration is successful.');
                            self.$store.dispatch('snackbar/snackOn');
                        }
                        self.loading = false;
                        self.$router.push('/');
                    })
                    .catch(function (error) {
                        self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                        self.$store.dispatch('snackbar/snackOn');
                        self.loading = false;
                    });
            } else {
                self.$store.dispatch('snackbar/setError', 'Please fill the fields properly.');
                self.$store.dispatch('snackbar/snackOn');
                self.loading = false;
            }
        }
    },
    mounted() {},
    auth: false,
    data() {
        return {
            // form default values
            email: '',
            name1: '',
            name2: '',
            zip_code: '',
            tel: '',
            inquirySubmitUrl: '/rcms-api/1/inquiry/9',
            inquirySchemaUrl: '/rcms-api/1/inquiry/get/9',
            validForm: true,
            loading: false,
            disabled: false,
            model: {},
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
                        model: 'sex',
                        label: 'Gender',
                        contents: [
                            {
                                key: 1,
                                value: 'Male',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 2,
                                value: 'Female',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 3,
                                value: 'Other',
                                default: false,
                                attribute: { group: '1' }
                            }
                        ],
                        required: true,
                        type: 'vuetifySingleChoice'
                    },
                    {
                        type: 'vuetifyDate',
                        inputType: 'picker',
                        label: 'Hire Date',
                        model: 'hire_date',
                        required: true
                    },
                    {
                        type: 'vuetifyDate',
                        inputType: 'picker',
                        label: 'Birthday',
                        model: 'birth',
                        required: true,
                        visible: (model, field, form) => model.choice === 'Check a boolean value'
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: 'Department',
                        model: 'department',
                        required: false
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
