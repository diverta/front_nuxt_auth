<template>
    <v-form ref="myForm" v-model="formValid">
        <v-select
            v-model="schema.option"
            :items="schema.contents"
            menu-props="auto"
            item-text="value"
            item-value="key"
            :rules="[
                (v) =>
                    schema.required == false ||
                    (schema.required == true && !!v) ||
                    'required field',
            ]"
            return-object
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
            formValid: false,
            option: null
        };
    },
    methods: {
        check (e) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                if (this.schema.edit === true) {
                    this.$emit(
                        'model-updated',
                        {
                            key: this.schema.option.key,
                            label: this.schema.option.value
                        },
                        this.schema.model
                    );
                } else {
                    this.$emit(
                        'model-updated',
                        this.schema.option.key.toString(),
                        this.schema.model
                    );
                }
            }
        }
    },
    mounted() {
        this.formValid = this.$refs.myForm.validate();
    }
};
</script>
