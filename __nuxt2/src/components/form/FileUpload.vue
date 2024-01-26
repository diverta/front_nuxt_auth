<template>
    <div>
        <v-file-input
            v-model="file"
            :rules="rules"
            :label="context.label"
            :accept="accept"
            @change="uploadFile"
        />
        <v-img
            v-if="context.slotProps.component.image"
            class="mx-auto"
            :src="context.model ? `${context.model.file_id}?width=300px` : ''"
            :aspect-ration="16 / 9"
            width="33%"
            max-height="300"
            max-width="300"
            position="center"
        />
    </div>
</template>

<script>
export default {
    props: {
        context: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            file: null
        };
    },
    computed: {
        accept() {
            return this?.context?.rules
                ?.filter(({ ruleName }) => ruleName === 'mime')
                ?.map(({ args }) => args?.map((v) => '.' + v)?.join(', '))
                ?.[0];
        },
        rules() {
            if (!this?.context?.rules) {
                return [];
            }
            return this.context.rules.map(({ ruleName, args }) => {
                switch (ruleName) {
                case 'required':
                    return (v) => {
                        return v
                            ? true
                            : this.$t('verify.required_file');
                    };
                default:
                    return null;
                }
            })
                .filter((fn) => fn);
        }
    },
    methods: {
        async uploadFile (file) {
            if (!file) {
                this.file = null;
                this.context.model = undefined;
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            const headers = {
                accept: '*/*',
                'Content-Type': 'multipart/form-data'
            };
            try {
                const response = await this.$store.$auth.ctx.$axios.post('/rcms-api/1/upload', formData, { headers });
                this.context.model = {
                    file_id: response.data.file_id,
                    file_nm: file.name,
                    desc: file.name
                };
            } catch (e) {
                this.file = null;
                this.context.model = undefined;
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            };
        }
    }
};
</script>
