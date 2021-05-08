<template>
    <v-form ref="myForm" v-model="formValid">
        <v-textarea
            id="jsonText"
            v-model="jsonstr"
            outlined
            auto-grow
            filled
            label="Json"
            :rules="[
                (v) =>
                    schema.required == false ||
                    (schema.required == true && !!v) ||
                    'required field',
                (v) => v.length == 0 || !jsonerror || 'invalid JSON',
            ]"
            placeholder="paste or type JSON here..."
            @change="check($event)"
        />
        <div v-if="jsonstr && jsonerror" class="text-danger">
            {{ jsonerror }}
        </div>
        <div v-if="!jsonerror" class="text-success">
            Valid JSON ✔
        </div>
        <v-card-text>{{ prettyFormat }}</v-card-text>
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';

export default {
    mixins: [abstractField],
    data () {
        return {
            formValid: true,
            jsonstr: '',
            jsonerror: ''
        };
    },
    methods: {
        check (e) {
            this.formValid = this.$refs.myForm.validate();
            console.log(this.jsonstr);
            if (this.formValid) {
                this.$emit('model-updated', this.jsonstr, this.schema.model);
            }
        }
    },
    computed: {
        prettyFormat () {
            // reset error
            let jsonerror = '';
            let jsonValue = '';
            try {
                // try to parse
                jsonValue = JSON.parse(this.jsonstr);
            } catch (e) {
                jsonerror = JSON.stringify(e.message);
                const textarea = document.getElementById('jsonText');
                if (this.jsonerror.includes('position')) {
                    // highlight error position
                    const positionStr = jsonerror.lastIndexOf('position') + 8;
                    const posi = parseInt(
                        jsonerror.substr(positionStr, jsonerror.lastIndexOf('"'))
                    );
                    if (posi >= 0) {
                        textarea.setSelectionRange(posi, posi + 1);
                    }
                }
                return '';
            }
            return JSON.stringify(jsonValue, null, 2);
        }
    },
    mounted() {
        this.formValid = this.$refs.myForm.validate();
    }
};
</script>
