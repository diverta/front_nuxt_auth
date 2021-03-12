<template>
  <div class="form-page">
    <header>
      <h2 class="form-ttl">
        会員登録
      </h2>
    </header>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          メールアドレス登録
        </v-stepper-step>

        <v-divider />

        <v-stepper-step :complete="e1 > 2" step="2">
          メールアドレス確認
        </v-stepper-step>

        <v-divider />

        <v-stepper-step :complete="e1 > 3" step="3">
          情報登録
        </v-stepper-step>

      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <p class="mt-1 max-w-4xl text-sm leading-5 text-gray-500">
            会員登録をされる際は、以下の規約にご同意いただく必要がございます。ご一読の上、ご同意いただける場合は【同意して送信する】ボタンをクリックしてください。
          </p>

          <v-container
            id="scroll-target"
            style="max-height: 300px; border: 1px solid #000000de;"
            class="overflow-y-auto"
            outlined
          >
            <v-row>
            </v-row>
          </v-container>
          <div class="row-none">
            <v-container>
              <v-row>
                <v-form
                  ref="form1"
                  v-model="valid"
                  lazy-validation
                  @submit.prevent="send_email"
                >
                  <p>
                    ご登録いただくメールアドレスを入力して「同意して送信する」をクリックして送信してください。
                  </p>
                  <p>
                    <v-text-field
                      v-model="email"
                      label="メールアドレス"
                      type="email"
                      :rules="[rules.required]"
                      outlined
                    />
                  </p>
                  <v-btn
                    type="submit"
                    block
                    x-large
                    color="success"
                    dark
                    :loading="loading1"
                  >
                    同意して送信する
                  </v-btn>
                </v-form>
              </v-row>
            </v-container>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <p class="mt-1 max-w-4xl text-sm leading-5 text-gray-500">
            メールボックスに届いたメールに記載されているリンクからアクセスをしてください。
          </p>
          <v-container />
        </v-stepper-content>

        <v-stepper-content step="3">
          <header>
            <h2>
              情報登録
            </h2>
          </header>
          <v-form
            ref="form2"
            v-model="valid"
            lazy-validation
            @submit.prevent="regist"
          >
            <v-container fluid>
              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>お名前
                  </v-subheader>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="name1"
                    label="姓"
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="name2"
                    label="名"
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>郵便番号
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="zip_code"
                    label="郵便番号"
                    type="number"
                    :rules="[rules.required, rules.zip_length]"
                    hint="ハイフンなしの半角数字7桁をご入力ください"
                    counter
                    outlined
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>都道府県
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="tdfk_cd"
                    :items="arrTdfk_cd"
                    :rules="[rules.required]"
                    item-text="name"
                    item-value="code"
                    menu-props="auto"
                    label="都道府県を選択してください"
                    hide-details
                    single-line
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>市区町村
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="address1"
                    label="市区町村"
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>番地
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="address2"
                    label="番地"
                    :rules="[rules.required]"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-subheader>建物名／部屋番号</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="address3"
                    label="建物名／部屋番号"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>電話番号
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="tel"
                    label="電話番号"
                    type="tel"
                    :rules="[rules.required, rules.tel]"
                    hint="ハイフンなしの半角数字をご入力ください"
                    counter
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    メールアドレス(ログイン時のIDになります)
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <p v-html="email" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>パスワード
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="login_pwd"
                    :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      rules.required,
                      rules.password_min,
                      rules.password,
                    ]"
                    :type="password_show ? 'text' : 'password'"
                    label="パスワード"
                    hint="8文字以上の半角英数字混在でご入力ください。記号を利用する場合は -_&=+%#@$*.!: が利用可能です。"
                    persistent-hint
                    counter
                    @click:append="password_show = !password_show"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-subheader>
                    <span style="color: red;">*</span>メールマガジン配信
                  </v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-checkbox
                    v-model="mailmaga_flg"
                    class="mx-2"
                    label="希望する"
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
                    登録する
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import axios from "axios"

export default {
  auth: false,
  data() {
    return {
      valid: true,
      e1: 1,
      text: "text",
      password_show: false,
      login_pwd: "",
      email: "",
      tel: "",
      name1: "",
      name2: "",
      zip_code: "",
      tdfk_cd: "",
      address1: "",
      address2: "",
      address3: "",
      mailmaga_flg: false,
      menu: false,
      arrTdfk_cd: [
        { code: "01", name: "北海道" },
        { code: "02", name: "青森県" },
        { code: "03", name: "岩手県" },
        { code: "04", name: "宮城県" },
        { code: "05", name: "秋田県" },
        { code: "06", name: "山形県" },
        { code: "07", name: "福島県" },
        { code: "08", name: "茨城県" },
        { code: "09", name: "栃木県" },
        { code: "10", name: "群馬県" },
        { code: "11", name: "埼玉県" },
        { code: "12", name: "千葉県" },
        { code: "13", name: "東京都" },
        { code: "14", name: "神奈川県" },
        { code: "15", name: "新潟県" },
        { code: "16", name: "富山県" },
        { code: "17", name: "石川県" },
        { code: "18", name: "福井県" },
        { code: "19", name: "山梨県" },
        { code: "20", name: "長野県" },
        { code: "21", name: "岐阜県" },
        { code: "22", name: "静岡県" },
        { code: "23", name: "愛知県" },
        { code: "24", name: "三重県" },
        { code: "25", name: "滋賀県" },
        { code: "26", name: "京都府" },
        { code: "27", name: "大阪府" },
        { code: "28", name: "兵庫県" },
        { code: "29", name: "奈良県" },
        { code: "30", name: "和歌山県" },
        { code: "31", name: "鳥取県" },
        { code: "32", name: "島根県" },
        { code: "33", name: "岡山県" },
        { code: "34", name: "広島県" },
        { code: "35", name: "山口県" },
        { code: "36", name: "徳島県" },
        { code: "37", name: "香川県" },
        { code: "38", name: "愛媛県" },
        { code: "39", name: "高知県" },
        { code: "40", name: "福岡県" },
        { code: "41", name: "佐賀県" },
        { code: "42", name: "長崎県" },
        { code: "43", name: "熊本県" },
        { code: "44", name: "大分県" },
        { code: "45", name: "宮崎県" },
        { code: "46", name: "鹿児島県" },
        { code: "47", name: "沖縄県" },
      ],
      ec_payment_id: "58",
      product_id: "123",
      cardName: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
      cardCvv: "",
      loading1: false,
      loading2: false,
      loading3: false,
      rules: {
        required: (value) => !!value || "この項目は必須入力です",
        password_min: (v) => v.length >= 8 || "最低8文字以上を入力してください",
        password: (v) =>
          v.length == 0 ||
          /^[a-zA-Z0-9\-_&=+%#@$*.!:]+$/.test(v) ||
          "半角英数字と記号(-_&=+%#@$*.!:)でご入力ください",
        zip_length: (v) => v.length == 7 || "7文字の半角数字で入力してください",
        tel: (v) =>
          v.length == 0 ||
          /^0[0-9]{9,10}$/.test(v) ||
          "ハイフンなしの半角数字をご入力ください",
      },
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"))
    },
  },
  created() {
    if (this.$route.query.key) {
      this.email_hash = this.$route.query.key
      let self = this
      self.$auth.ctx.$axios
        .post("/rcms-api/1/member/invite", {
          email_hash: this.email_hash,
        })
        .then(function (response) {
          self.email = response.data.data.email
          self.$store.dispatch(
            "snackbar/setMessage",
            "メールアドレスを確認しました"
          )
          self.$store.dispatch("snackbar/snackOn")
          self.e1 = 3
        })
        .catch(function (error) {
          console.log(error)
          self.e1 = 2
        })
    }
  },
  methods: {
    send_email() {
      this.loading1 = true
      if (this.$refs.form1.validate()) {
        let self = this

        this.$auth.ctx.$axios
          .post("/rcms-api/1/member/invite", {
            email: self.email,
          })
          .then(function (response) {
            if (response.data.errors.length === 0) {
              self.$store.dispatch("snackbar/setMessage", "メール送信しました")
              self.$store.dispatch("snackbar/snackOn")
              self.e1 = 2
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
      } else {
        this.loading1 = false
      }
    },
    regist() {
      this.loading2 = true
      if (this.$refs.form2.validate()) {
        let self = this
        this.$auth.ctx.$axios
          .post("/rcms-api/1/member/regist", {
            name1: this.name1,
            name2: this.name2,
            zip_code: this.zip_code,
            tdfk_cd: this.tdfk_cd,
            address1: this.address1,
            address2: this.address2,
            address3: this.address3,
            tel: this.tel,
            email: this.email,
            email_send_ng_flg: this.mailmaga_flg ? 0 : 1,
            login_pwd: this.login_pwd,
          })
          .then(function (response) {
            if (response.data.errors.length === 0) {
                self.$store.dispatch(
                  "snackbar/setMessage",
                  "会員登録が完了しました"
                )
                self.$store.dispatch("snackbar/snackOn")
                self.$router.push("/")
            }
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
      } else {
        this.loading2 = false
      }
    },
    save(birth) {
      this.$refs.menu.save(birth)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
