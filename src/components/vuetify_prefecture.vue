<template>
  <v-form v-model="formValid" ref="myForm">
    <v-select
      v-model="schema.option"
      :items="schema.options"
      append-outer-icon="mdi-map"
      menu-props="auto"
      item-text="text"
      item-value="value"
      :rules="[
        (v) =>
          schema.required == false ||
          (schema.required == true && !!v) ||
          'required field',
      ]"
      @change="check($event)"
      return-object
    ></v-select>
  </v-form>
</template>

<script>
import { abstractField } from "vue-form-generator";

export default {
  mixins: [abstractField],
  data: function () {
    return {
      formValid: false,
      option: {},
    };
  },
  methods: {
    check: function (e, value) {
      this.formValid = this.$refs.myForm.validate();
      if (this.formValid) {
        this.$emit(
          "model-updated",
          /*{
            "tdfk_cd": this.schema.option.value,
            "tdfk_nm": this.schema.option.text
         }*/ this
            .schema.option.value,
          this.schema.model
        );
      }
    },
  },
  mounted() {
    // this.formValid = this.$refs.myForm.validate()
  },
};
</script>
