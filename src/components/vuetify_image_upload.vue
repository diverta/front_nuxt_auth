<template>
    <v-form ref="myForm" v-model="formValid">
        <v-file-input v-model="image" @change="Preview_image" />
        <v-img
            class="mx-auto"
            :aspect-ration="16 / 9"
            :src="schema.url"
            width="33%"
            max-height="300"
            max-width="300"
            position="center"
        />
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';
export default {
    data () {
        return {
            formValid: true,
            image: null
        };
    },
    methods: {
        async Preview_image() {
            const formData = new FormData();
            formData.append('file', this.image);
            const headers = {
                accept: '*/*',
                'Content-Type': 'multipart/form-data'
            };
            this.formValid = false;
            try {
                const response = await this.$store.$auth.ctx.$axios.post('/rcms-api/1/upload', formData, { headers });
                this.formValid = true;
                this.schema.url = `${response.data.file_id}?width=300px`;
                this.$emit(
                    'model-updated',
                    {
                        file_id: response.data.file_id,
                        file_nm: '',
                        desc: ''
                    },
                    this.schema.model
                );
            } catch (e) {
                this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
                this.$store.dispatch('snackbar/snackOn');
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
