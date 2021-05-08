<template>
    <v-form ref="myForm" v-model="formValid">
        <v-select
            v-model="schema.option"
            :items="schema.options"
            append-outer-icon="mdi-map"
            menu-props="auto"
            item-text="text"
            item-value="value"
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
            option: {}
        };
    },
    methods: {
        check (e, value) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                this.$emit(
                    'model-updated',
                    /* {
            "tdfk_cd": this.schema.option.value,
            "tdfk_nm": this.schema.option.text
         } */ this
                        .schema.option.value,
                    this.schema.model
                );
            }
        }
    },
    mounted() {
    // this.formValid = this.$refs.myForm.validate()
    }
};
</script>
