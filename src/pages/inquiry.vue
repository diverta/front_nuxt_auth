<template>
  <div class="form-page">
    <header>
      <h2 class="form-ttl">
        お問い合わせ
      </h2>
    </header>

    <div class="theme--light v-stepper">
      <form class="v-stepper__content" @submit.prevent="inquiry">
        <v-container fluid>
          <v-row>
            <v-col cols="4">
              <v-subheader>お名前</v-subheader>
            </v-col>
            <v-col cols="8">
              <v-text-field v-model="name" label="お名前" outlined />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-subheader>メールアドレス</v-subheader>
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="from_mail"
                label="メールアドレス"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-subheader>問い合わせ内容</v-subheader>
            </v-col>
            <v-col cols="8">
              <v-textarea v-model="body" label="お問い合わせ内容" outlined />
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
                :loading="loading"
              >
                送信する
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      access_token: "",
      from_mail: "",
      name: "",
      body: "",
      member_no: "",
      loading: false,
    }
  },
  methods: {
    inquiry() {
      this.loading = true
      let self = this
      this.$store.$auth.ctx.$axios
        .post("/rcms-api/1/inquiry/6", {
          from_mail: this.from_mail,
          name: this.name,
          body: this.body,
          ext_01: this.member_no,
        })
        .then(function (response) {
          if (response.data.errors.length == 0) {
            self.$store.dispatch(
              "snackbar/setMessage",
              "お問い合わせを送信しました。"
            )
            self.$store.dispatch("snackbar/snackOn")
            self.$router.push("/")
          }
          self.loading = false
        })
        .catch(function (error) {
          self.$store.dispatch(
            "snackbar/setError",
            error.response.data.errors?.[0].message
          )
          self.$store.dispatch("snackbar/snackOn")
          self.loading = false
        })
    },
  },
}
</script>
