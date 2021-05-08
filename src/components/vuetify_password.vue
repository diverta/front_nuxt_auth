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
            hint="8文字以上の半角英数字混在でご入力ください。記号を利用する場合は -_&=+%#@$*.!: が利用可能です。"
            persistent-hint
            counter
            @click:append="password_show = !password_show"
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
                    v.length === 0 || v.length >= 8 || '最低8文字以上を入力してください',
                password: (v) =>
                    v.length === 0 ||
          /^[a-zA-Z0-9\-_&=+%#@$*.!:]+$/.test(v) ||
          '半角英数字と記号(-_&=+%#@$*.!:)でご入力ください'
            }
        };
    },
    methods: {
        check (e) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                this.$emit('model-updated', this.text, this.schema.model);
            }
        }
    },
    mounted() {
    }
};
</script>
