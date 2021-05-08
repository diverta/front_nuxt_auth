<template>
    <v-form ref="myForm" v-model="formValid">
        <v-textarea
            ref="schema.model"
            v-model="schema.text"
            outlined
            dense
            :required="schema.required"
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

export default {
    mixins: [abstractField],
    data () {
        return {
            formValid: false
        };
    },
    methods: {
        isValid (schema, value) {
            if (schema.texttype === 'regex') {
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
        this.formValid = this.$refs.myForm.validate();
    }
};
</script>
