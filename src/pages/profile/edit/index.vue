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
                <FormulateForm
                    v-if="formulateSchema"
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
    auth: true,
    methods: {
        async submitF () {
            const sendModel = JSON.parse(JSON.stringify(this.formValues));
            try {
                const response = await this.$store.$auth.ctx.$axios.post('/rcms-api/1/member/update', sendModel);

                if (response.data.errors.length !== 0) {
                    throw new Error(response.data.errors.join('\n'));
                }

                this.$snackbar.info(this.$i18n.t('mypage.profile_changed'));
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message || e);
            }
        }
    },
    async mounted() {
        try {
            const response = await this.$auth.ctx.$axios.get('/rcms-api/1/member/me');
            const d = response.data.details;

            this.formValues = {
                ...this.formValues,
                name1: d?.name1,
                name2: d?.name2,
                department: d?.department,
                position: d?.position,
                tel: d?.tel,
                email: d?.email,
                notes: d?.notes,
                hire_date: d?.hire_date,
                multiple_check: d?.multiple_check?.map(({ key }) => `${key}`) || ''
            };
        } catch (e) {
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        };

        this.loading = false;
    },
    data() {
        return {
            loading: true,
            agreementChecked: false,

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
                    name: 'profileimage',
                    type: 'FormFileUpload',
                    label: this.$i18n.t('label.avatar')
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
    }
};
</script>
