<template>
  <v-layout>
    <v-flex>
      <header>
        <h2 class="form-ttl">
          パスワードの再設定
        </h2>
      </header>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            メールアドレス送信
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 2" step="2">
            パスワード変更
          </v-stepper-step>

          <v-divider />
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
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
                      ご登録いただいたメールアドレスを入力して送信をしてください。
                    </p>
                    <p>
                      <v-text-field
                        v-model="email"
                        label="メールアドレス"
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
                      送信する
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-form
              ref="form2"
              v-model="valid"
              lazy-validation
              @submit.prevent="set_password"
            >
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <p>
                      仮パスワードを入力してください。
                    </p>
                    <p>
                      <v-text-field
                        v-model="temp_pwd"
                        :type="text"
                        label="仮パスワード"
                      />
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <p>
                      新しいパスワードを入力してください。
                    </p>
                    <p>
                      <v-text-field
                        v-model="login_pwd"
                        :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.password_min]"
                        :type="password_show ? 'text' : 'password'"
                        label="新しいパスワード"
                        hint="最低8文字以上の英数混合のパスワードを設定ください。"
                        counter
                        @click:append="password_show = !password_show"
                      />
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <p>
                      <v-text-field
                        v-model="login_pwd2"
                        :append-icon="
                          password_show2 ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        :rules="[
                          rules.required,
                          rules.password_min,
                          rules.password2,
                        ]"
                        :type="password_show2 ? 'text' : 'password'"
                        label="新しいパスワード(確認用)"
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
                      登録する
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
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
      text: "text",
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
    }
  },
  created() {
    this.token = this.$route.query.token
    if (this.token) {
      this.$store.dispatch(
        "snackbar/setMessage",
        "新しいパスワードを入力してください。"
      )
      this.$store.dispatch("snackbar/snackOn")
      this.e1 = 2
    }
  },
  methods: {
    async reminder() {
      this.loading1 = true
      let self = this
      this.$store.$auth.ctx.$axios
        .post("/rcms-api/1/reminder", {
          email: this.email,
        })
        .then(function (response) {
          if (response.data.errors.length == 0) {
            self.$store.dispatch(
              "snackbar/setMessage",
              "パスワード再設定メールを送信しました。メールのリンクから新しいパスワードを設定してください。"
            )
            self.$store.dispatch("snackbar/snackOn")
          }
          self.loading1 = false
        })
        .catch(function (error) {
          self.$store.dispatch(
            "snackbar/setError",
            error.response.data.errors?.[0].message
          )
          self.$store.dispatch("snackbar/snackOn")
          self.loading1 = false
        })
    },
    async set_password() {
      if (this.$refs.form2.validate() && this.token) {
        this.loading2 = true
        let self = this
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
            )
            self.$store.dispatch("snackbar/snackOn")
            self.$router.push("/")
            self.loading2 = false
          })
          .catch(function (error) {
            self.$store.dispatch(
              "snackbar/setError",
              error.response.data.errors?.[0].message
            )
            self.$store.dispatch("snackbar/snackOn")
            self.loading2 = false
          })
      }
    },
  },
}
</script>
