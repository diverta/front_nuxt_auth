<template>
    <v-form ref="myForm" v-model="formValid">
        <v-radio-group
            v-model="schema.radioGroup"
            :rules="[
                (v) =>
                    schema.required == false ||
                    (schema.required == true && !!v) ||
                    'required field',
            ]"
            @change="check($event)"
        >
            <v-radio
                v-for="item in schema.contents"
                :key="item.key"
                :label="item.value"
                :value="item"
            />
        </v-radio-group>
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';

export default {
    data () {
        return {
            formValid: false
        };
    },
    methods: {
        check (e) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                this.$emit(
                    'model-updated',
                    /* {
           "key": this.radioGroup.key,
           "label": this.radioGroup.value
         } */ this.schema.radioGroup.key.toString(),
                    this.schema.model
                );
            }
        }
    },
    mounted() {
        this.formValid = this.$refs.myForm.validate();
    },
    mixins: [abstractField]
};
</script>
