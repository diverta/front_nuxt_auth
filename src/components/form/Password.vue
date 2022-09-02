<template>
    <v-text-field
        v-model="context.model"
        dense
        outlined
        :append-icon="showsPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="rules"
        :type="showsPassword ? 'text' : 'password'"
        :label="context.label"
        persistent-hint
        counter
        autocomplete="off"
        @click:append="() => showsPassword = !showsPassword"
    />
</template>

<script>
export default {
    props: {
        context: {
            type: Object,
            required: true
        }
    },
    computed: {
        rules() {
            return [
                (v) => !!v || 'required password',
                (v) =>
                    v.length >= 8 || this.$i18n.t('verify.password_format_char_count'),
                (v) =>
                    /^[a-zA-Z0-9\-_&=+%#@$*.!:]+$/.test(v) ||
                      this.$i18n.t('verify.password_format_char_type')
            ];
        }
    },
    data () {
        return {
            showsPassword: false
        };
    }
};
</script>
