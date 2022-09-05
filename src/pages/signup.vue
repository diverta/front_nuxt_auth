<template>
    <div class="l-content_maxWidth-sm mb-5 pb-5">
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />

        <div class="v-stepper c-form_wrap white">
            <v-container fluid>
                <div class="l-content_heading">
                    <h1>{{ $t('signup.title') }}</h1>
                    <h4 class="slogan">
                        {{ $t('signup.text') }}
                    </h4>
                </div>

                <v-text-field
                    v-model="sitekey"
                    :label="$t('login.site_key')"
                    type="text"
                    outlined
                />

                <FormulateForm
                    v-if="sitekey && formulateSchema"
                    v-slot="{ isValid }"
                    v-model="formValues"
                    class="c-form"
                    :schema="formulateSchema"
                >
                    <v-checkbox v-model="agreementChecked" class="c-form_tnc">
                        <template #label>
                            <div>{{ $t('common.agree') }}</div>
                        </template>
                    </v-checkbox>

                    <div class="text-center mb-5 white--text">
                        <button
                            type="submit"
                            block
                            x-large
                            class="c-btn c-btn_dark"
                            :disabled="!agreementChecked || !isValid"
                            @click="submitF"
                        >
                            {{ $t('common.submit') }}
                        </button>
                    </div>
                </FormulateForm>
            </v-container>
        </div>
    </div>
</template>

<script>
export default {
    auth: false,
    methods: {
        async submitF () {
            this.loading = true;

            localStorage.setItem('sitekey', this.sitekey); // save sitekey

            this.$store.$auth.ctx.$axios.defaults.baseURL = this.sitekey === 'dev-nuxt-auth'
                ? 'https://dev-nuxt-auth.a.kuroco.app'
                : `https://${this.sitekey}.g.kuroco.app`;

            try {
                const response = await this.$auth.ctx.$axios.post('/rcms-api/1/member/register', this.formValues);

                if (response.data.errors.length !== 0) {
                    throw new Error(response.data.errors.join('\n'));
                }

                this.$snackbar.info(this.$i18n.t('signup.success'));
                await this.$auth.loginWith('local', { data: { email: this.formValues.email, password: this.formValues.login_pwd } });
                this.$router.push('/');
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message || e);
            };
            this.loading = false;
        }
    },
    data() {
        return {
            loading: false,
            agreementChecked: false,
            sitekey: '',

            formulateSchema: [
                {
                    name: 'name1',
                    label: this.$i18n.t('label.first_name'),
                    type: 'FormText',
                    'label-class': ['required'],
                    validation: 'required|min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'name2',
                    label: this.$i18n.t('label.last_name'),
                    type: 'FormText',
                    'label-class': ['required'],
                    validation: 'required|min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'hire_date',
                    label: this.$i18n.t('label.hire_date'),
                    type: 'FormDate',
                    'label-class': ['required'],
                    validation: 'required',
                    disableErrors: true
                },
                {
                    name: 'department',
                    label: this.$i18n.t('label.department'),
                    type: 'FormText',
                    validation: 'min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'position',
                    label: this.$i18n.t('label.position'),
                    type: 'FormText',
                    validation: 'min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'tel',
                    label: this.$i18n.t('label.phone'),
                    type: 'FormText',
                    validation: 'required|tel',
                    'label-class': ['required'],
                    disableErrors: true
                },
                {
                    name: 'email',
                    label: this.$i18n.t('label.email'),
                    type: 'FormText',
                    validation: 'required|email|min:0,length|max:100,length',
                    'label-class': ['required'],
                    disableErrors: true
                },
                {
                    name: 'login_pwd',
                    type: 'FormPassword',
                    label: this.$i18n.t('label.password'),
                    validation: 'required|min:8,length|password',
                    'label-class': ['required'],
                    disableErrors: true
                },
                {
                    name: 'pull_down',
                    label: this.$i18n.t('label.office'),
                    type: 'FormSingleOption',
                    options: [
                        {
                            key: '0',
                            value: ' ',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '1',
                            value: 'Tokyo',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '2',
                            value: 'Osaka',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '3',
                            value: 'Malaysia',
                            default: false,
                            attribute: { group: '2' }
                        }
                    ]
                },
                {
                    name: 'multiple_check',
                    label: this.$i18n.t('label.hobby'),
                    type: 'FormMultipleChoice',
                    options: [
                        {
                            key: '1',
                            value: 'Reading',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '2',
                            value: 'Watching TV',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '3',
                            value: 'Family Time',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '4',
                            value: 'Going to Movies',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '5',
                            value: 'Fishing',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '6',
                            value: 'Computer',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '7',
                            value: 'Gardening',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '8',
                            value: 'Renting Movies',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '9',
                            value: 'Walking',
                            default: false,
                            attribute: { group: '2' }
                        },
                        {
                            key: '10',
                            value: 'Exercise',
                            default: false,
                            attribute: { group: '2' }
                        }
                    ]
                },
                {
                    name: 'notes',
                    label: this.$i18n.t('label.notes'),
                    type: 'FormTextarea',
                    validation: 'min:0,length|max:400,length'
                }
            ],
            formValues: {}
        };
    },
    mounted() {
        this.sitekey = localStorage.getItem('sitekey') || 'dev-nuxt-auth';
    }
};
</script>
