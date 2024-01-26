<template>
    <div>
        <v-textarea
            v-model="model"
            outlined
            auto-grow
            filled
            label="Json"
            :rules="rules"
            placeholder="paste or type JSON here..."
        />

        <template v-if="!model.isError">
            <div class="text-success">
                Valid JSON ✔
            </div>
            <v-card-text>{{ model }}</v-card-text>
        </template>
    </div>
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
        minlength() {
            const min = this?.context?.rules
                ?.filter(({ ruleName }) => ruleName === 'min')
                ?.map(({ args }) => args)
                ?.[0];
            return Number(min);
        },
        maxlength() {
            const max = this?.context?.rules
                ?.filter(({ ruleName }) => ruleName === 'max')
                ?.map(({ args }) => args)
                ?.[0];
            return Number(max);
        },
        rules() {
            if (!this?.context?.rules) {
                return [];
            }
            const givenRules = this.context.rules.map(({ ruleName, args }) => {
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
            return [
                ...givenRules,
                (v) => {
                    try { JSON.parse(v); } catch (e) { return e; }
                }
            ];
        },
        model: {
            get() {
                try {
                    return {
                        isError: false,
                        json: JSON.stringify(JSON.parse(this.context.model), null, 2)
                    };
                } catch (e) {
                    return {
                        isError: true,
                        json: `${e}`
                    };
                }
            },
            set(v) {
                this.context.model = v;
            }
        }
    }
};
</script>
