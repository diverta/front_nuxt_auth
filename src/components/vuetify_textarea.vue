<template>
  <v-form v-model="formValid" ref="myForm">
    <v-textarea
      outlined
      dense
      v-model="schema.text"
      ref="schema.model"
      :required="schema.required"
      :readonly="schema.readonly"
      :disabled="schema.disabled"
      :rules="[
        (v) =>
          schema.required == false ||
          (schema.required == true && !!v) ||
          'required field',
        (v) =>
          v.length >= schema.min || 'minimum ' + schema.min + ' characters',
        (v) =>
          v.length <= schema.max || 'maximum ' + schema.max + ' characters',
        (v) => isValid(schema, v),
      ]"
      :placeholder="schema.placeholder"
      :counter="schema.counter"
      :hint="schema.hint"
      @change="check($event)"
    ></v-textarea>
  </v-form>
</template>

<script>
import { abstractField } from "vue-form-generator";
import validator from "validator";

export default {
  mixins: [abstractField],
  data: function () {
    return {
      formValid: false,
    };
  },
  methods: {
    isValid: function (schema, value) {
      if (schema.texttype == "regex") {
        var regex = new RegExp(schema.regex);
        if (!regex.test(value)) {
          return "Wrong regex format. " + regex;
        }
      }

      return true;
    },
    check: function (e) {
      this.formValid = this.$refs.myForm.validate();
      if (this.formValid) {
        this.$emit("model-updated", this.schema.text, this.schema.model);
      }
    },
  },
  mounted() {
    this.formValid = this.$refs.myForm.validate();
  },
};
</script>
