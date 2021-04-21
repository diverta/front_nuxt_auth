<template>
  <v-form v-model="formValid" ref="myForm">
    <v-text-field
      outlined
      dense
      v-model="login_pwd"
      :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.password_min, rules.password]"
      :type="password_show ? 'text' : 'password'"
      :label="schema.label"
      hint="The password must contain both alphabets and numbers at least 8 characters. You can also use these symbols '-_&=+%#@$*.!:'."
      persistent-hint
      counter
      @click:append="password_show = !password_show"
    ></v-text-field>
  </v-form>
</template>

<script>
import { abstractField } from "vue-form-generator";
import validator from "validator";

export default {
  mixins: [abstractField],
  data: function () {
    return {
      formValid: true,
      login_pwd: "",
      password_show: false,
      password: "",
      rules: {
        required: (value) => !!value || "required password",
        password_min: (v) =>
          v.length == 0 || v.length >= 8 || "Your password must be at least 8 characters",
        password: (v) =>
          v.length == 0 ||
          /^[a-zA-Z0-9\-_&=+%#@$*.!:]+$/.test(v) ||
          "The password must contain both alphabets. You can also use these symbols '-_&=+%#@$*.!:'.",
      },
    };
  },
  methods: {
    check: function (e) {
      this.formValid = this.$refs.myForm.validate();
      if (this.formValid) {
        this.$emit("model-updated", this.text, this.schema.model);
      }
    },
  },
  mounted() {
  },
};
</script>
