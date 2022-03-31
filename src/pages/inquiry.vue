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
                {{ $t('inquiry.message') }}<br>
            </h3>
        </div>

        <div class="v-stepper mt-5 c-form_wrap">
            <v-container fluid>
                <FormulateForm
                    v-if="formulateScheme"
                    #default="{ isValid }"
                    v-model="formValues"
                    class="c-form"
                    :schema="formulateScheme"
                >
                    <v-checkbox v-model="agreementChecked" class="c-form_tnc">
                        <template v-slot:label>
                            <div>{{ $t('common.agree') }}</div>
                        </template>
                    </v-checkbox>

                    <div class="text-center mb-5">
                        <button
                            type="submit"
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
import '../assets/form.css';

export default {
    title() {
        return 'Inquiry';
    },
    auth: true,
    data() {
        return {
            inquiryID: 1,

            loading: true,
            agreementChecked: false,

            formulateScheme: null,
            formValues: {}
        };
    },
    mounted() {
        this.getSchema();
    },
    methods: {
        async getSchema() {
            this.loading = true;
            try {
                const response = await this.$store.$auth.ctx.$axios.get(`/rcms-api/1/inquiry/get/${this.inquiryID}`);
                this.formulateScheme = this.$parseFormulateScheme(response.data.details.cols)
                    .filter(({ name }) => {
                        // we skip some items in this form.
                        return !['body', 'ext_03'].includes(name);
                    });
            } catch (e) {
                this.$snackbar.error(e?.response?.data.errors?.[0]?.message);
            }
            this.loading = false;
        },
        async submitF () {
            try {
                const sendModel = {
                    ...this.formValues,
                    body: 'example message'
                };
                const response = await this.$store.$auth.ctx.$axios.post(`/rcms-api/1/inquiry/${this.inquiryID}`, sendModel);
                if (response.data.errors.length === 0) {
                    this.$store.dispatch(
                        'snackbar/setMessage', this.$i18n.t('inquiry.thanks')
                    );
                }
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            };
        }
    }
};
</script>
