<template>
    <ClientOnly>
        <div class="l-content_maxWidth-sm mb-5 pb-5">
            <v-progress-linear :active="loading" :indeterminate="loading" absolute top color="orange white-4" />
            <div class="v-stepper c-form_wrap bg-white">
                <v-container fluid>
                    <div class="l-content_heading">
                        <h1>{{ $t('signup.title') }}</h1>
                        <h4 class="slogan">
                            {{ $t('signup.text') }}
                        </h4>
                    </div>

                    <ProfileForm @submit="handleSubmit">
                        <template #headInput>
                            <FormKit
                                v-model="sitekey"
                                name="sitekey"
                                :label="$t('login.site_key')"
                                type="text"
                                :classes="{ outer: 'signup-form_elm-sitekey' }"
                                validation="required|length:0,100"
                                :validation-messages="{
                                    required: $t('verify.required_field'),
                                    length: $t('verify.text_maximum')
                                }"
                            />
                        </template>
                    </ProfileForm>
                </v-container>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup>
const { t } = useI18n();
const snackbar = useSnackbar();
const { register } = useAuth();
const loading = ref(false);
const sitekey = ref(apiDomain.sitekey);

const handleSubmit = async (formValues) => {
    loading.value = true;
    setSitekey(sitekey.value);
    try {
        await register({
            ...formValues,
            // remove unnecessary fields
            sitekey: undefined,
            term: undefined
        });
    } catch (error) {
        snackbar.add({
            type: 'error',
            text: error?.response?._data?.errors?.[0]?.message || t('common.error')
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style lang="scss">
.signup-form {
    @media screen and (min-width: 769px) {
        &_elm {
            &-sitekey {
                grid-row: 1;
                grid-column: 1 / 3;
            }
        }
    }
}
</style>
