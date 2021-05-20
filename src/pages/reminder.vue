<template>
    <div class="p-login_content elevation-7">
        <v-row>
            <v-col class="pa-0 col-sm-6 col-12">
                <div class="p-login_intro">
                    <img src="~/assets/images/logo.png?width=150px" class="p-login_logo">
                    <div class="p-login_intro-text">
                        <h1 class="heading">
                            Back to <a href="/">login</a>
                            <v-icon
                                dark
                                right
                                large
                                class="icon"
                            >
                                mdi-undo-variant
                            </v-icon>
                        </h1>
                        <p>Don't have an account? <a href="/signup/">Sign up here</a></p>
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
                                Password reset
                            </h2>
                        </v-card-title>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12">
                                    <p>
                                        A password reset URL will be sent to the email address you
                                        provided.
                                    </p>
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
                                <v-col cols="12" class="text-center">
                                    <button
                                        type="submit"
                                        :loading="loading1"
                                        class="c-btn c-btn_dark"
                                    >
                                        Reset my password
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
                                Set New Password
                            </h2>
                        </v-card-title>
                        <v-container fluid class="p-login_content-inner">
                            <v-row>
                                <v-col cols="12 py-0">
                                    <p>Temporary password</p>
                                    <v-text-field v-model="temp_pwd" :type="text" label="" outlined />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12 py-0">
                                    <p>New password</p>
                                    <v-text-field
                                        v-model="login_pwd"
                                        :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                                        :rules="[rules.required, rules.password_min]"
                                        :type="password_show ? 'text' : 'password'"
                                        label=""
                                        hint="Please set a mixture of alphanumeric characters and at least 8 characters."
                                        counter
                                        outlined
                                        @click:append="password_show = !password_show"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12 pt-0">
                                    <p>Confirmation password</p>
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
                                        hint="Please set a mixture of alphanumeric characters and at least 8 characters."
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
                                        Submit
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
                                        Your password has been updated
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
                                        Login
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
                                    <p align="center">
                                        A password reset URL has been sent to <br>
                                        the email address you provided.
                                    </p>
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
                required: (value) => !!value || 'This filed is required.',
                password_min: (v) => v.length >= 8 || 'Please input at least 8 characters.',
                password2: (v) => v === this.login_pwd || 'The confirmation password is incorrect.'
            }
        };
    },
    created() {
        this.token = this.$route.query.token;
        if (this.token) {
            this.$store.dispatch(
                'snackbar/setMessage',
                'please input a new password.'
            );
            this.$store.dispatch('snackbar/snackOn');
            this.e1 = 2;
        }
    },
    methods: {
        login() {
            this.$router.push('/');
        },
        reminder() {
            this.loading1 = true;
            const self = this;
            this.$store.$auth.ctx.$axios
                .post('/rcms-api/1/reminder', {
                    email: this.email
                })
                .then(function (response) {
                    if (response.data.errors.length === 0) {
                        self.$store.dispatch(
                            'snackbar/setMessage',
                            'A password reset email has been sent. Please set a new password from the link in the email.'
                        );
                        self.$store.dispatch('snackbar/snackOn');
                    }
                    self.e1 = 3;
                    self.loading1 = false;
                })
                .catch(function () {
                    self.$store.dispatch('snackbar/setError', 'Invalid email address.');
                    self.$store.dispatch('snackbar/snackOn');
                    self.loading1 = false;
                });
        },
        set_password() {
            if (this.$refs.form2.validate() && this.token) {
                console.log('reset');
                this.loading2 = true;
                const self = this;
                self.$auth.ctx.$axios
                    .post('/rcms-api/1/reminder', {
                        token: this.token,
                        login_pwd: this.login_pwd,
                        temp_pwd: this.temp_pwd
                    })
                    .then(() => {
                        self.$store.dispatch(
                            'snackbar/setMessage',
                            'Your password has been updated.'
                        );
                        self.$store.dispatch('snackbar/snackOn');
                        self.$router.push('/');
                        self.loading2 = false;
                        self.e1 = 4;
                    })
                    .catch(function (error) {
                        self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                        self.$store.dispatch('snackbar/snackOn');
                        self.loading2 = false;
                    });
            }
        }
    }
};
</script>
