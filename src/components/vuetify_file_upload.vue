<template>
  <!-- https://vuetifyjs.com/en/api/v-file-input/#props for more information 
		add schema based properties -->
  <v-form v-model="formValid" ref="myForm">
    <v-file-input
      ref="schema.model"
      v-model="schema.file"
      :rules="[
        (v) =>
          schema.required == false ||
          (schema.required == true && !!v) ||
          'need to upload file',
      ]"
      :label="schema.accept"
      :accept="schema.accept"
      @change="check($event)"
    ></v-file-input>
  </v-form>
</template>

<script>
import { abstractField } from "vue-form-generator";
export default {
  data: function () {
    return {
      formValid: true,
    };
  },
  methods: {
    check: function (e) {
      let formData = new FormData();
      formData.append("file", this.schema.file);
      let self = this;
      const headers = {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      };
      console.log(this.schema.file);
      self.formValid = false;
      self.$store.$auth.ctx.$axios
        .post("/rcms-api/1/upload", formData, {
          headers: headers,
        })
        .then(function (response) {
          console.log(response);
          self.formValid = true;
          self.$emit(
            "model-updated",
            {
              file_id: response.data.file_id,
              file_nm: self.schema.file.name,
              desc: self.schema.file.name,
            },
            self.schema.model
          );
        })
        .catch(function (error) {
          console.log(error);
          self.$store.dispatch("snackbar/setError", "error");
          self.$store.dispatch("snackbar/snackOn");
          self.loading = false;
        });
    },
  },
  mixins: [abstractField],
  mounted() {
    this.formValid = this.$refs.myForm.validate()
  },
};
</script>
