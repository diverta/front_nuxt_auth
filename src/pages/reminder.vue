<template>
  <v-layout>
    <v-flex>
      <h2 align="center">Reset your password</h2>
      <br />

      <h3 v-if="e1 == 2" align="center" style="font-weight: normal">
        Input your password
      </h3>
      <br />
      <v-card v-if="e1 == 1">
        <v-form
          ref="form1"
          v-model="valid"
          lazy-validation
          @submit.prevent="reminder"
        >
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <p>
                  A password reset URL will be sent to the email address you
                  provided.
                </p>
                <p>
                  <v-text-field
                    v-model="email"
                    label="Email address"
                    type="email"
                    autocomplete="off"
                    outlined
                  />
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
                  dark
                  :loading="loading1"
                >
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
      <v-card v-else-if="e1 == 2">
        <br />
        <v-form
          ref="form2"
          v-model="valid"
          lazy-validation
          @submit.prevent="set_password"
        >
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <p>Temporary password</p>
                <p>
                  <v-text-field v-model="temp_pwd" :type="text" label="" />
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p>New password</p>
                <p>
                  <v-text-field
                    v-model="login_pwd"
                    :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.password_min]"
                    :type="password_show ? 'text' : 'password'"
                    label=""
                    hint="最低8文字以上の英数混合のパスワードを設定ください。"
                    counter
                    @click:append="password_show = !password_show"
                  />
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p>Confirmation password</p>
                <p>
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
                    hint="最低8文字以上の英数混合のパスワードを設定ください。"
                    counter
                    @click:append="password_show2 = !password_show2"
                  />
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
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <p align="center">Your password has been updated</p>
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
            <v-row>
              <v-col cols="12">
                <p align="center">
                  A password reset URL has been sent to <br />
                  the email address you provided.
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      token: "",
      e1: 1,
      valid: true,
      email: "",
      password_show: false,
      login_pwd: "",
      password_show2: false,
      login_pwd2: "",
      temp_pwd: "",
      loading1: false,
      loading2: false,
      rules: {
        required: (value) => !!value || "この項目は必須入力です",
        password_min: (v) => v.length >= 8 || "最低8文字以上を入力してください",
        password2: (v) => v == this.login_pwd || "確認用パスワードが違います",
      },
    };
  },
  created() {
    this.token = this.$route.query.token;
    if (this.token) {
      this.$store.dispatch(
        "snackbar/setMessage",
        "新しいパスワードを入力してください。"
      );
      this.$store.dispatch("snackbar/snackOn");
      this.e1 = 2;
    }
  },
  methods: {
    login() {
      this.$router.push("/");
    },
    async reminder() {
      this.loading1 = true;
      let self = this;
      this.$store.$auth.ctx.$axios
        .post("/rcms-api/1/reminder", {
          email: this.email,
        })
        .then(function (response) {
          if (response.data.errors.length == 0) {
            self.$store.dispatch(
              "snackbar/setMessage",
              "パスワード再設定メールを送信しました。メールのリンクから新しいパスワードを設定してください。"
            );
            self.$store.dispatch("snackbar/snackOn");
          }
          self.e1 = 3;
          self.loading1 = false;
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", "Invalid email address.");
          self.$store.dispatch("snackbar/snackOn");
          self.loading1 = false;
        });
    },
    async set_password() {
      if (this.$refs.form2.validate() && this.token) {
        this.loading2 = true;
        let self = this;
        self.$auth.ctx.$axios
          .post("/rcms-api/1/reminder", {
            token: this.token,
            login_pwd: this.login_pwd,
            temp_pwd: this.temp_pwd,
          })
          .then(() => {
            self.$store.dispatch(
              "snackbar/setMessage",
              "パスワードを更新しました。"
            );
            self.$store.dispatch("snackbar/snackOn");
            self.$router.push("/");
            self.loading2 = false;
            self.e1 = 4;
          })
          .catch(function (error) {
            self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
            self.$store.dispatch("snackbar/snackOn");
            self.loading2 = false;
          });
      }
    },
  },
};
</script>
