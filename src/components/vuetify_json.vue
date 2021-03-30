<template>
  <v-form v-model="formValid" ref="myForm">
    <v-textarea
      v-model="jsonstr"
      outlined
      auto-grow
      filled
      label="Json"
      id="jsonText"
      :rules="[
        (v) =>
          schema.required == false ||
          (schema.required == true && !!v) ||
          'required field',
        (v) => v.length == 0 || !jsonerror || 'invalid JSON',
      ]"
      placeholder="paste or type JSON here..."
      @change="check($event)"
    >
    </v-textarea>
    <div class="text-danger" v-if="jsonstr && jsonerror">{{ jsonerror }}</div>
    <div class="text-success" v-if="!jsonerror">Valid JSON ✔</div>
    <v-card-text>{{ prettyFormat }}</v-card-text>
  </v-form>
</template>

<script>
import { abstractField } from "vue-form-generator";

export default {
  mixins: [abstractField],
  data: function () {
    return {
      formValid: true,
      jsonstr: "",
      jsonerror: "",
    };
  },
  methods: {
    check: function (e) {
      this.formValid = this.$refs.myForm.validate();
      console.log(this.jsonstr);
      if (this.formValid) {
        this.$emit("model-updated", this.jsonstr, this.schema.model);
      }
    },
  },
  computed: {
    prettyFormat: function () {
      // reset error
      this.jsonerror = "";
      let jsonValue = "";
      try {
        // try to parse
        jsonValue = JSON.parse(this.jsonstr);
      } catch (e) {
        this.jsonerror = JSON.stringify(e.message);
        var textarea = document.getElementById("jsonText");
        if (this.jsonerror.indexOf("position") > -1) {
          // highlight error position
          var positionStr = this.jsonerror.lastIndexOf("position") + 8;
          var posi = parseInt(
            this.jsonerror.substr(positionStr, this.jsonerror.lastIndexOf('"'))
          );
          if (posi >= 0) {
            textarea.setSelectionRange(posi, posi + 1);
          }
        }
        return "";
      }
      return JSON.stringify(jsonValue, null, 2);
    },
  },
  mounted() {
    this.formValid = this.$refs.myForm.validate();
  },
};
</script>
