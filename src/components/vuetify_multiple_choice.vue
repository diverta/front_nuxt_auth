<template>
  <v-form v-model="formValid" ref="myForm">
    <v-checkbox
      v-for="item in schema.contents"
      v-bind:key="item.key"
      ref="mul"
      v-model="checkedCategories"
      :label="item.value"
      :value="item.key"
      :rules="rules"
      @change="check($event)"
      return-object
    ></v-checkbox>
  </v-form>
</template>

<script>
import { abstractField } from "vue-form-generator";

export default {
  data: function () {
    return {
      formValid: false,
      checkedCategories: [],
    };
  },
  computed: {
    rules() {
      return [
        this.schema.required == false ||
          (this.schema.required == true && this.checkedCategories.length > 0) ||
          "At least one item should be selected",
      ];
    },
  },
  methods: {
    check: function (e) {
      this.formValid = this.$refs.myForm.validate();
      var checkedJson = [];
      for (var key in this.checkedCategories) {
        checkedJson.push(
          this.checkedCategories[key].toString()
        );
      }
      if (this.formValid) {
        this.$emit("model-updated", checkedJson, this.schema.model);
      }
    },
  },
  mounted() {
    this.formValid = this.$refs.myForm.validate();
  },
  mixins: [abstractField],
};
</script>
