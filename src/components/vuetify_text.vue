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
                    'required field',
                (v) =>
                    v.length >= schema.min || 'minimum ' + schema.min + ' characters',
                (v) =>
                    v.length <= schema.max || 'maximum ' + schema.max + ' characters',
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
                    return 'Wrong email format. Example ******@example.jp';
                }
            } else if (schema.texttype === 'tel') {
                if (!validator.isMobilePhone(value)) {
                    return 'Wrong telephone format. Example 0312345678';
                }
            } else if (schema.texttype === 'zip') {
                if (value.length !== 7) {
                    return 'Wrong zip format for Japan. Example 0212141';
                }
            } else if (schema.texttype === 'number') {
                if (!validator.isNumeric(value)) {
                    return 'Wrong numeric format.';
                }
            } else if (schema.texttype === 'url') {
                if (!validator.isURL(value)) {
                    return 'Wrong url format.';
                }
            } else if (schema.texttype === 'regex') {
                const regex = new RegExp(schema.regex);
                if (!regex.test(value)) {
                    return 'Wrong regex format. ' + regex;
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
