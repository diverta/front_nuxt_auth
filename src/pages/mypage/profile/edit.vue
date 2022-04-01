<template>
    <div>
        <div class="l-content_heading">
            <h1>{{ $t('mypage.title') }}</h1>
        </div>

        <v-tabs
            v-model="active_tab"
            background-color="transparent"
            light
            height="70"
            class="rounded-xl"
            centered
        >
            <v-tab @click="() => $router.push(localePath('/mypage/'))">
                {{ $t('mypage.my_page') }}
            </v-tab>
            <v-tab @click="() => $router.push(localePath('/mypage/favorite_list/'))">
                {{ $t('mypage.favoire_list') }}
            </v-tab>
            <v-tab @click="() => $router.push(localePath('/mypage/profile/edit/'))">
                {{ $t('mypage.profile_edit') }}
            </v-tab>
            <v-tab @click="() => $router.push(localePath('/mypage/posted_list'))">
                {{ $t('mypage.posted_list') }}
            </v-tab>
        </v-tabs>

        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />

        <h1 class="mt-5 pt-5">
            {{ $t('mypage.profile_editing') }}
        </h1>
        <br>
        <div class="v-stepper c-form_wrap">
            <v-container fluid>
                <FormulateForm
                    v-if="formulateSchema"
                    #default="{ isValid }"
                    v-model="formValues"
                    class="c-form"
                    :schema="formulateSchema"
                >
                    <v-checkbox v-model="agreementChecked" class="c-form_tnc">
                        <template v-slot:label>
                            <div>{{ $t('common.agree') }}</div>
                        </template>
                    </v-checkbox>

                    <div class="text-center mb-5">
                        <button
                            type="submit"
                            block
                            x-large
                            class="c-btn c-btn_main"
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
            try {
                const sendModel = JSON.parse(JSON.stringify(this.model));
                const response = await this.$store.$auth.ctx.$axios.post('/rcms-api/1/member/update', sendModel);
                if (response.data.errors.length === 0) {
                    this.$snackbar.info(this.$i18n.t('mypage.profile_changed'));
                    this.$router.push('/');
                }
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            }
        }
    },
    async mounted() {
        try {
            const response = await this.$auth.ctx.$axios.get(`/rcms-api/1/members/${this.$auth.user.member_id}`);
            const d = response.data.details;
            this.formValues = {
                name1: d?.name1,
                name2: d?.name2,
                birth: d?.birth,
                department: d?.department,
                position: d?.position,
                tel: d?.tel,
                email: d?.email,
                notes: d?.notes,
                address1: d?.address1
            };
            this.schema.fields[13].contents[2].default = true;
        } catch (e) {
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        };

        this.loading = false;
    },
    data() {
        return {
            active_tab: 2,

            loading: true,
            agreementChecked: false,

            model: {
                pull_down: ['Pulldown 1'],
                multiple_check: ['Check 1']
            },
            formulateSchema: [
                {
                    name: 'name1',
                    label: this.$i18n.t('label.first_name'),
                    type: 'VuetifyText',
                    'label-class': ['required'],
                    validation: 'required|min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'name2',
                    label: this.$i18n.t('label.last_name'),
                    type: 'VuetifyText',
                    'label-class': ['required'],
                    validation: 'required|min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'department',
                    label: this.$i18n.t('label.department'),
                    type: 'VuetifyText',
                    validation: 'min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'position',
                    label: this.$i18n.t('label.position'),
                    type: 'VuetifyText',
                    validation: 'min:0,length|max:100,length',
                    disableErrors: true
                },
                {
                    name: 'tel',
                    label: this.$i18n.t('label.phone'),
                    type: 'VuetifyText',
                    validation: 'required|tel',
                    'label-class': ['required'],
                    disableErrors: true
                },
                {
                    name: 'email',
                    label: this.$i18n.t('label.email'),
                    type: 'VuetifyText',
                    validation: 'required|email|min:0,length|max:100,length',
                    'label-class': ['required'],
                    disableErrors: true
                },
                {
                    name: 'login_pwd',
                    label: this.$i18n.t('label.password'),
                    type: 'VuetifyPassword',
                    validation: 'required|min:8,length|password',
                    'label-class': ['required'],
                    disableErrors: true
                },
                {
                    name: 'address1',
                    label: this.$i18n.t('label.address'),
                    type: 'VuetifyText',
                    validation: 'required|min:0,length|max:100,length',
                    'label-class': ['required'],
                    disableErrors: true
                },
                {
                    name: 'profileimage',
                    label: this.$i18n.t('label.avatar'),
                    type: 'VuetifyFileUpload',
                    disableErrors: true
                },
                {
                    name: 'pull_down',
                    label: this.$i18n.t('label.office'),
                    type: 'VuetifySingleOption',
                    options: [
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
                    model: 'multiple_check',
                    label: this.$i18n.t('label.multiple'),
                    type: 'VuetifyMultipleChoice',
                    options: [
                        {
                            key: '1',
                            value: 'Check 1',
                            default: false,
                            attribute: { group: '1' }
                        },
                        {
                            key: '2',
                            value: 'Check 2',
                            default: false,
                            attribute: { group: '1' }
                        },
                        {
                            key: '3',
                            value: 'Check 3',
                            default: false,
                            attribute: { group: '1' }
                        }
                    ]
                },
                {
                    name: 'notes',
                    label: this.$i18n.t('label.notes'),
                    type: 'VuetifyTextarea',
                    validation: 'min:0,length|max:400,length'
                }
            ],
            formValues: {}
        };
    }
};
</script>
