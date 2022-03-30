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
                        <div>{{$t('common.agree')}}</div>
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
                        {{$t('common.submit')}}
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
                this.$snackbar.error(this.$i18n.t('verify.fille_property'));
                return;
            }

            try {
                const sendModel = JSON.parse(JSON.stringify(this.model));
                const response = await this.$store.$auth.ctx.$axios.post('/rcms-api/1/member/update', sendModel);
                if (response.data.errors.length === 0) {
                    this.$store.dispatch(
                        'snackbar/setMessage',
                        this.$i18n.t('mypage.profile_changed')
                    );
                    this.$router.push('/');
                }
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            }
        }
    },
    async mounted() {
        try {
            const response = await this.$auth.ctx.$axios.get(`/rcms-api/1/members/${this.$auth.user.member_id}`)
            const d = response.data.details;
            this.schema.fields[0].text = d?.name1 || '';
            this.schema.fields[1].text = d?.name2 || '';
            this.schema.fields[3].text = d?.birth || '';
            this.schema.fields[4].text = d?.department || '';
            this.schema.fields[5].text = d?.position || '';
            this.schema.fields[6].text = d?.tel || '';
            this.schema.fields[7].text = d?.email || '';
            this.schema.fields[13].text = d?.notes || '';
            this.schema.fields[9].text = d?.address1 || '';
            this.schema.fields[13].contents[2].default = true;
        } catch (e) {
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        };

        this.loading = false;
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
            model: {
                sex: 'Male',
                pull_down: ['Pulldown 1'],
                multiple_check: ['Check 1']
            },
            schema: {
                fields: [
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        min: 0,
                        max: 100,
                        label: this.$i18n.t('label.first_name'),
                        model: 'name1',
                        text: '',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        min: 0,
                        max: 100,
                        label: this.$i18n.t('label.last_name'),
                        text: '',
                        model: 'name2',
                        required: true
                    },
                    {
                        model: 'sex',
                        label: this.$i18n.t('label.sex'),
                        contents: [
                            {
                                key: 1,
                                value: 'Male'
                            },
                            {
                                key: 2,
                                value: 'Female'
                            }
                        ],
                        required: true,
                        type: 'vuetifySingleChoice'
                    },
                    {
                        type: 'vuetifyDate',
                        inputType: 'picker',
                        label: this.$i18n.t('label.birthday'),
                        model: 'birth',
                        required: false,
                        visible: (model, field, form) => model.choice === 'Check a boolean value'
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: this.$i18n.t('label.department'),
                        model: 'department',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: this.$i18n.t('label.position'),
                        model: 'position',
                        required: false
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: this.$i18n.t('label.phone'),
                        model: 'tel',
                        texttype: 'tel',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        min: 0,
                        max: 100,
                        label: this.$i18n.t('label.email'),
                        model: 'email',
                        text: '',
                        texttype: 'email',
                        required: true
                    },
                    {
                        type: 'vuetifyPassword',
                        inputType: 'text',
                        label: this.$i18n.t('label.password'),
                        text: '',
                        model: 'login_pwd',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: this.$i18n.t('label.address'),
                        model: 'address1',
                        required: true
                    },
                    {
                        type: 'UploadFile',
                        label: this.$i18n.t('label.avatar'),
                        model: 'profileimage',
                        required: false,
                        visible: (model, field, form) => model.choice === 'Check a boolean value'
                    },
                    {
                        model: 'pull_down',
                        label: this.$i18n.t('label.pull_down'),
                        contents: [
                            {
                                key: 0,
                                value: ' ',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 1,
                                value: 'Pulldown 1',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 2,
                                value: 'Pulldown 2',
                                default: false,
                                attribute: { group: '2' }
                            },
                            {
                                key: 3,
                                value: 'Pulldown 3',
                                default: false,
                                attribute: { group: '2' }
                            }
                        ],
                        required: false,
                        type: 'VuetifySingleOption'
                    },
                    {
                        model: 'radio_button_2',
                        label: this.$i18n.t('label.radio'),
                        contents: [
                            {
                                key: 1,
                                value: 'Radio 1',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 2,
                                value: 'Radio 2',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 3,
                                value: 'Radio 3',
                                default: false,
                                attribute: { group: '1' }
                            }
                        ],
                        required: false,
                        type: 'vuetifySingleChoice'
                    },
                    {
                        model: 'multiple_check',
                        label: this.$i18n.t('label.multiple'),
                        contents: [
                            {
                                key: 1,
                                value: 'Check 1',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 2,
                                value: 'Check 2',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 3,
                                value: 'Check 3',
                                default: false,
                                attribute: { group: '1' }
                            }
                        ],
                        required: false,
                        type: 'vuetifyMultipleChoice'
                    },
                    {
                        model: 'notes',
                        type: 'vuetifyTextArea',
                        inputType: 'text',
                        label: this.$i18n.t('label.notes'),
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
