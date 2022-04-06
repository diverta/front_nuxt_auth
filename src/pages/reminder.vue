<template>
    <div class="p-login_content elevation-7">
        <v-row>
            <v-col class="pa-0 col-sm-6 col-12">
                <div class="p-login_intro">
                    <img src="~/assets/images/logo.png?width=150px" class="p-login_logo">
                    <div class="p-login_intro-text">
                        <h1 class="heading">
                            <span v-html="$t('reminder.back_to_login')" />
                            <v-icon
                                dark
                                right
                                large
                                class="icon"
                            >
                                mdi-undo-variant
                            </v-icon>
                        </h1>
                        <p v-html="$t('reminder.sign_up')" />
                    </div>
                </div>
            </v-col>
            <v-col class="pa-0 col-sm-6 col-12">
                <v-card v-if="e1 == 1" class="p-login_form" outlined>
                    <v-form
                        ref="form1"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="reminder"
                    >
                        <v-card-title>
                            <h2 align="center" class="pb-4 c-text_blue">
                                {{ $t('reminder.password_reset') }}
                            </h2>
                        </v-card-title>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12">
                                    <p>{{ $t('reminder.send_email') }}</p>
                                    <v-text-field
                                        v-model="email"
                                        label="Email address"
                                        type="email"
                                        autocomplete="off"
                                        outlined
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" class="text-center white--text">
                                    <button
                                        type="submit"
                                        :loading="loading1"
                                        class="c-btn c-btn_dark"
                                    >
                                        {{ $t('reminder.reset') }}
                                    </button>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
                <v-card v-else-if="e1 == 2" class="p-login_form">
                    <v-form
                        ref="form2"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="set_password"
                    >
                        <v-card-title>
                            <h2 align="center" class="pb-4 c-text_blue">
                                <p>{{ $t('reminder.set_password') }}</p>
                            </h2>
                        </v-card-title>
                        <v-container fluid class="p-login_content-inner">
                            <v-row>
                                <v-col cols="12 py-0">
                                    <p>{{ $t('reminder.temp_password') }}</p>
                                    <v-text-field v-model="temp_pwd" :type="text" label="" outlined />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12 py-0">
                                    <p>{{ $t('reminder.new_password') }}</p>
                                    <v-text-field
                                        v-model="login_pwd"
                                        :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                                        :rules="[rules.required, rules.password_min]"
                                        :type="password_show ? 'text' : 'password'"
                                        label=""
                                        :hint="$t('reminder.rule')"
                                        counter
                                        outlined
                                        @click:append="password_show = !password_show"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12 pt-0">
                                    <p>{{ $t('reminder.conf_password') }}</p>
                                    <v-text-field
                                        v-model="login_pwd2"
                                        :append-icon="password_show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                        :rules="[
                                            rules.required,
                                            rules.password_min,
                                            rules.password2,
                                        ]"
                                        :type="password_show2 ? 'text' : 'password'"
                                        label=""
                                        :hint="$t('reminder.rule')"
                                        counter
                                        outlined
                                        @click:append="password_show2 = !password_show2"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-btn
                                        type="submit"
                                        block
                                        x-large
                                        color="success"
                                        dark
                                        :loading="loading2"
                                    >
                                        {{ $t('reminder.submit') }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
                <v-card v-else-if="e1 == 4">
                    <v-form
                        ref="form1"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="reminder"
                    >
                        <v-container fluid class="p-login_content-inner">
                            <v-row>
                                <v-col cols="12">
                                    <p align="center">
                                        {{ $t('reminder.update_ok') }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-btn
                                        type="submit"
                                        block
                                        x-large
                                        color="success"
                                        class="white--text"
                                        @click="login()"
                                    >
                                        {{ $t('reminder.login') }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
                <v-card v-else-if="e1 == 3">
                    <v-form
                        ref="form1"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="reminder"
                    >
                        <v-container fluid>
                            <v-row class="p-login_content-inner">
                                <v-col cols="12" class="align-self-center">
                                    <p align="center" v-html="$t('reminder.send_emailed')" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    auth: false,
    data() {
        return {
            token: '',
            e1: 1,
            valid: true,
            email: '',
            password_show: false,
            login_pwd: '',
            password_show2: false,
            login_pwd2: '',
            temp_pwd: '',
            loading1: false,
            loading2: false,
            rules: {
                required: (value) => !!value || this.$i18n.t('reminder.required'),
                password_min: (v) => v.length >= 8 || this.$i18n.t('reminder.word_count'),
                password2: (v) => v === this.login_pwd || this.$i18n.t('reminder.conf_error')
            }
        };
    },
    created() {
        this.token = this.$route.query.token;
        if (this.token) {
            this.$snackbar.info(this.$i18n.t('reminder.not_entered'));
            this.e1 = 2;
        }
    },
    methods: {
        login() {
            this.$router.push(this.localePath('/'));
        },
        async reminder() {
            this.loading1 = true;
            try {
                const response = await this.$store.$auth.ctx.$axios.post('/rcms-api/1/reminder', { email: this.email });
                this.e1 = 3;
                if (response.data.errors.length > 0) {
                    throw new Error(response.data.errors.join('\t'));
                }
                this.$snackbar.info(this.$i18n.t('reminder.password_sent'));
            } catch (e) {
                this.$snackbar.error(this.$i18n.t('reminder.invalid_email'));
            };
            this.loading1 = false;
        },
        async set_password() {
            if (!this.$refs.form2.validate() || !this.token) {
                return;
            }

            this.loading2 = true;
            try {
                await this.$auth.ctx.$axios
                    .post('/rcms-api/1/reminder', {
                        token: this.token,
                        login_pwd: this.login_pwd,
                        temp_pwd: this.temp_pwd
                    });
                this.$snackbar.info(this.$i18n.t('reminder.already_updated'));
                this.$router.push('/');
                this.e1 = 4;
            } catch (e) {
                this.$snackbar.error(e.response.data.errors?.[0].message);
            }
            this.loading2 = false;
        }
    }
};
</script>
