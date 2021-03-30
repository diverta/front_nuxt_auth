<template>
  <v-form v-model="formValid" ref="myForm">
    <v-file-input @change="Preview_image" v-model="image"> </v-file-input>
    <v-img
      class="mx-auto"
      :aspect-ration="16 / 9"
      :src="schema.url"
      width="33%"
      max-height="300"
      max-width="300"
      position="center"
    >
    </v-img>
  </v-form>
</template>

<script>
import { abstractField } from "vue-form-generator";
export default {
  data: function () {
    return {
      formValid: true,
      image: null,
    };
  },
  methods: {
    Preview_image() {
      let formData = new FormData();
      formData.append("file", this.image);
      let self = this;
      const headers = {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      };

      self.formValid = false;
      self.$store.$auth.ctx.$axios
        .post("/rcms-api/1/upload", formData, {
          headers: headers,
        })
        .then(function (response) {
          self.formValid = true;
          self.schema.url =
            "https://dev-nuxt-auth.a.kuroco-img.app/v=1614168758/" +
            response.data.file_id +
            "?width=300px";
          self.$emit(
            "model-updated",
            {
              file_id: response.data.file_id,
              file_nm: "",
              desc: "",
            },
            self.schema.model
          );
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", "error");
          self.$store.dispatch("snackbar/snackOn");
          self.loading = false;
        });
    },
  },
  mixins: [abstractField],
  mounted() {
    this.formValid = this.$refs.myForm.validate();
  },
};
</script>
