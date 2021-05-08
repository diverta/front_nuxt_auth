<template>
    <v-form ref="myForm" v-model="formValid">
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
        />
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';
export default {
    data () {
        return {
            formValid: true
        };
    },
    methods: {
        check (e) {
            const formData = new FormData();
            formData.append('file', this.schema.file);
            const self = this;
            const headers = {
                accept: '*/*',
                'Content-Type': 'multipart/form-data'
            };
            console.log(this.schema.file);
            self.formValid = false;
            self.$store.$auth.ctx.$axios
                .post('/rcms-api/1/upload', formData, {
                    headers
                })
                .then(function (response) {
                    console.log(response);
                    self.formValid = true;
                    self.$emit(
                        'model-updated',
                        {
                            file_id: response.data.file_id,
                            file_nm: self.schema.file.name,
                            desc: self.schema.file.name
                        },
                        self.schema.model
                    );
                })
                .catch(function (error) {
                    self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                    self.$store.dispatch('snackbar/snackOn');
                    self.loading = false;
                });
        }
    },
    mixins: [abstractField],
    mounted() {
        this.formValid = this.$refs.myForm.validate();
    }
};
</script>
