<template>
    <v-form ref="myForm" v-model="formValid">
        <v-checkbox
            v-for="item in schema.contents"
            :key="item.key"
            ref="mul"
            v-model="checkedCategories"
            :label="item.value"
            :value="item.key"
            :rules="rules"
            return-object
            @change="check($event)"
        />
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';

export default {
    data () {
        return {
            formValid: false,
            checkedCategories: []
        };
    },
    computed: {
        rules() {
            return [
                this.schema.required === false ||
          (this.schema.required === true && this.checkedCategories.length > 0) ||
          'At least one item should be selected'
            ];
        }
    },
    methods: {
        check (e) {
            this.formValid = this.$refs.myForm.validate();
            const checkedJson = [];
            for (const key in this.checkedCategories) {
                checkedJson.push(
                    this.checkedCategories[key].toString()
                );
            }
            if (this.formValid) {
                this.$emit('model-updated', checkedJson, this.schema.model);
            }
        }
    },
    mounted() {
        this.formValid = this.$refs.myForm.validate();
    },
    mixins: [abstractField]
};
</script>
