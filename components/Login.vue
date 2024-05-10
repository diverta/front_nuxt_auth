<template>
    <section class="p-login_content elevation-7">
        <v-row>
            <v-col class="pa-0 col-sm-6 col-12">
                <div class="p-login_intro">
                    <img src="~/assets/images/logo.png?width=150" class="p-login_logo" />
                    <div class="p-login_intro-text">
                        <h1 class="heading">
                            <span v-html="$t('login.welcomeback')" />
                        </h1>
                        <p>{{ $t('login.message') }}</p>
                        <p>
                            {{ $t('login.demoaccount') }}<br />
                            <strong>{{ $t('common.sitekey') }}：</strong>dev-nuxt-auth<br />
                            <strong>{{ $t('common.id') }}：</strong>demo@kuroco-mail.app<br />
                            <strong>{{ $t('common.password') }}：</strong>demo0512<br />
                        </p>
                    </div>
                </div>
            </v-col>
            <v-col class="pa-0 col-sm-6 col-12">
                <v-card outlined>
                    <div class="p-login_form">
                        <form @submit.prevent="handleLogin">
                            <div class="login-screen lgn-left">
                                <v-card-title>
                                    <h2 class="pb-4 c-text_blue">
                                        {{ $t('common.sign_in') }}
                                    </h2>
                                </v-card-title>
                                <v-card-text class="inner">
                                    <form @submit.prevent="handleLogin">
                                        <v-text-field v-model="sitekey" :label="$t('login.site_key')" type="text" outlined />
                                        <v-text-field v-model="formData.email" :label="$t('login.email')" type="email" outlined />
                                        <v-text-field
                                            v-model="formData.password"
                                            :label="$t('common.password')"
                                            :type="showsPassword ? 'text' : 'password'"
                                            :append-icon="showsPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                            outlined
                                            @click:append="() => (showsPassword = !showsPassword)"
                                        />
                                        <p class="pb-3">
                                            <NuxtLink :to="localePath('/reminder/')">
                                                {{ $t('login.forget_password') }}
                                            </NuxtLink>
                                        </p>
                                        <div class="text-center">
                                            <button type="submit" block x-large :loading="loading" class="c-btn_dark c-btn submit-btn text-white">
                                                {{ $t('common.sign_in') }}
                                            </button>
                                            <span v-html="$t('login.note')" />
                                        </div>
                                    </form>
                                </v-card-text>
                            </div>
                        </form>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </section>
</template>
<script setup>
const { t } = useI18n();
const snackbar = useSnackbar();
const { login } = useAuth();
const sitekey = ref(apiDomain.sitekey);
const formData = reactive({
    email: '',
    password: ''
});
const error = ref(null);

const loading = ref(false);
const showsPassword = ref(false);

const handleLogin = async () => {
    try {
        loading.value = true;
        setSitekey(sitekey.value);
        await login({ ...formData });
    } catch (e) {
        error.value = e?.data?.errors || [];
        snackbar.add({
            type: 'error',
            text: e?.response?._data?.errors?.[0]?.message || t('slackbar.login_fail')
        });
    }
    loading.value = false;
};
</script>
