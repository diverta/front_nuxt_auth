<template>
    <v-form ref="myForm" v-model="formValid">
        <v-text-field
            ref="schema.model"
            v-model="schema.text"
            outlined
            dense
            :readonly="schema.readonly"
            :disabled="schema.disabled"
            :rules="[
                (v) =>
                    schema.required == false ||
                    (schema.required == true && !!v) ||
                    $t('verify.required_field'),,
                (v) =>
                    v.length >= schema.min || $t('verify.text_minimum') + schema.min + $t('verify.text_character'),
                (v) =>
                    v.length <= schema.max || $t('verify.text_maximum') + schema.max + $t('verify.text_character'),
                (v) => isValid(schema, v),
            ]"
            :placeholder="schema.placeholder"
            :counter="schema.counter"
            :hint="schema.hint"
            @change="check($event)"
        />
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';
import validator from 'validator';

export default {
    mixins: [abstractField],
    data () {
        return {
            formValid: true
        };
    },
    methods: {
        isValid (schema, value) {
            if (schema.texttype === 'email') {
                if (!validator.isEmail(value)) {
                    return this.$i18n.t('verify.text_format_email');
                }
            } else if (schema.texttype === 'tel') {
                if (!validator.isMobilePhone(value)) {
                    return this.$i18n.t('verify.text_format_telephone');
                }
            } else if (schema.texttype === 'zip') {
                if (value.length !== 7) {
                    return this.$i18n.t('verify.text_format_zip');
                }
            } else if (schema.texttype === 'number') {
                if (!validator.isNumeric(value)) {
                    return this.$i18n.t('verify.text_format_numeric');
                }
            } else if (schema.texttype === 'url') {
                if (!validator.isURL(value)) {
                    return this.$i18n.t('verify.text_format_url');
                }
            } else if (schema.texttype === 'regex') {
                const regex = new RegExp(schema.regex);
                if (!regex.test(value)) {
                    return this.$i18n.t('verify.text_format_regex') + regex;
                }
            }

            return true;
        },
        check (e) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                this.$emit('model-updated', this.schema.text, this.schema.model);
            }
        }
    },
    mounted() {
    // this.formValid = this.$refs.myForm.validate()
    }
};
</script>
