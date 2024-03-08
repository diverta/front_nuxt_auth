<template>
    <div class="p-login_content elevation-7">
        <v-row>
            <v-col class="pa-0 col-sm-6 col-12">
                <div class="p-login_intro">
                    <img src="~/assets/images/logo.png?width=150" class="p-login_logo">
                    <div class="p-login_intro-text">
                        <h1 class="heading">
                            <span v-html="$t('login.welcomeback')" />
                        </h1>
                        <p>{{ $t('login.message') }}</p>
                        <p>
                            {{ $t('login.demoaccount') }}<br>
                            <strong>{{ $t('common.sitekey') }}：</strong>dev-nuxt-auth<br>
                            <strong>{{ $t('common.id') }}：</strong>demo@kuroco-mail.app<br>
                            <strong>{{ $t('common.password') }}：</strong>demo0512<br>
                        </p>
                    </div>
                </div>
            </v-col>
            <v-col class="pa-0 col-sm-6 col-12">
                <v-card class="p-login_form" outlined>
                    <form @submit.prevent="login">
                        <div class="login-screen lgn-left">
                            <v-card-title>
                                <h2 align="center" class="pb-4 c-text_blue">
                                    {{ $t('common.sign_in') }}
                                </h2>
                            </v-card-title>
                            <v-card-text class="inner">
                                <form @submit.prevent="login">
                                    <v-text-field
                                        v-model="sitekey"
                                        :label="$t('login.site_key')"
                                        type="text"
                                        outlined
                                    />
                                    <v-text-field
                                        v-model="form.email"
                                        :label="$t('login.email')"
                                        type="email"
                                        outlined
                                    />
                                    <v-text-field
                                        v-model="form.password"
                                        :label="$t('common.password')"
                                        :type="showsPassword ? 'text' : 'password'"
                                        :append-icon="showsPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                        outlined
                                        @click:append="() => showsPassword = !showsPassword"
                                    />
                                    <p>
                                        <NuxtLink :to="localePath('/reminder')">
                                            {{ $t('login.forget_password') }}
                                        </NuxtLink>
                                    </p>
                                    <div class="text-center">
                                        <button
                                            type="submit"
                                            block
                                            x-large
                                            :loading="loading"
                                            class="c-btn_dark c-btn submit-btn white--text"
                                        >
                                            {{ $t('common.sign_in') }}
                                        </button>
                                        <span v-html="$t('login.note')" />
                                    </div>
                                </form>
                            </v-card-text>
                        </div>
                    </form>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data: () => ({
        sitekey: '',
        showsPassword: false,
        form: {
            email: '',
            password: ''
        },
        loading: false
    }),
    mounted() {
        this.sitekey = localStorage.getItem('sitekey') || 'dev-nuxt-auth';
    },
    methods: {
        async login() {
            this.loading = true;
            localStorage.setItem('sitekey', this.sitekey); // save sitekey

            this.$store.$auth.ctx.$axios.defaults.baseURL = this.sitekey === 'dev-nuxt-auth'
                ? 'https://dev-nuxt-auth.a.kuroco.app'
                : `https://${this.sitekey}.g.kuroco.app`;

            try {
                await this.$auth.loginWith('local', { data: this.form });
                this.$snackbar.info(this.$i18n.t('slackbar.logged_in'));
            } catch (e) {
                this.$snackbar.error(this.$i18n.t('slackbar.login_fail'));
            }
            this.loading = false;
        }
    }
};
</script>
