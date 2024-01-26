<template>
    <v-radio-group
        v-if="context"
        v-model="context.model"
        :rules="rules"
    >
        <v-radio
            v-for="({ key, value }) in context.options"
            :key="`${key}_${value}`"
            :label="value"
            :value="key"
        />
    </v-radio-group>
</template>

<script>

export default {
    props: {
        context: {
            type: Object,
            required: true
        }
    },
    computed: {
        rules() {
            if (!this?.context?.rules) {
                return [];
            }
            return this.context.rules.map(({ ruleName, args }) => {
                switch (ruleName) {
                case 'required':
                    return (v) => v !== ''
                        ? true
                        : this.$t('verify.required_field');
                default:
                    return null;
                }
            })
                .filter((fn) => fn);
        }
    },
    mounted() {
        this.context.options.forEach((option) => {
            if (option.default) {
                this.context.model = option.value;
            }
        });
    }
};
</script>
