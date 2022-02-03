<template>
    <v-form ref="myForm" v-model="formValid">
        <v-text-field
            v-model="login_pwd"
            outlined
            dense
            :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.password_min, rules.password]"
            :type="password_show ? 'text' : 'password'"
            :label="schema.label"
            :hint="$t('verify.password_format')"
            persistent-hint
            counter
            @click:append="password_show = !password_show"
            @change="check($event)"
        />
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';

export default {
    mixins: [abstractField],
    data () {
        return {
            formValid: true,
            login_pwd: '',
            password_show: false,
            password: '',
            rules: {
                required: (value) => !!value || 'required password',
                password_min: (v) =>
                    v.length === 0 || v.length >= 8 || this.$i18n.t('verify.password_format_char_count'),
                password: (v) =>
                    v.length === 0 ||
          /^[a-zA-Z0-9\-_&=+%#@$*.!:]+$/.test(v) ||
          this.$i18n.t('verify.password_format_char_type')
            }
        };
    },
    methods: {
        check (e) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                this.$emit('model-updated', this.login_pwd, this.schema.model);
            }
        }
    },
    mounted() {
    }
};
</script>
