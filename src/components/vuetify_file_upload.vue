<template>
    <v-form ref="myForm" v-model="formValid">
        <v-file-input
            ref="schema.model"
            v-model="schema.file"
            :rules="[
                (v) =>
                    schema.required == false ||
                    (schema.required == true && !!v) ||
                    $t('verify.required_file'),
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
        async check (e) {
            const formData = new FormData();
            formData.append('file', this.schema.file);
            const headers = {
                accept: '*/*',
                'Content-Type': 'multipart/form-data'
            };
            this.formValid = false;
            try {
                const response = await this.$store.$auth.ctx.$axios.post('/rcms-api/1/upload', formData, { headers })
                this.formValid = true;
                this.$emit(
                    'model-updated',
                    {
                        file_id: response.data.file_id,
                        file_nm: this.schema.file.name,
                        desc: this.schema.file.name
                    },
                    this.schema.model
                );
            } catch (e) {
                this.$store.dispatch('snackbar/popupError', e?.response?.data?.errors?.[0]?.message);
                this.loading = false;
            };
        }
    },
    mixins: [abstractField],
    mounted() {
        this.formValid = this.$refs.myForm.validate();
    }
};
</script>
