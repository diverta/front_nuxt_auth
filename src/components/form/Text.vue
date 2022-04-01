<template>
    <v-text-field
        v-if="context"
        v-model="context.model"
        :placeholder="context.placeholder"
        outlined
        dense
        :rules="rules"
        :maxlength="maxlength || 100"
        :minlength="minlength"
        :counter="maxlength || 100"
    />
</template>

<script>
import validator from 'validator';

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
            return this.context.rules.map(({ ruleName, args }) => {
                switch (ruleName) {
                case 'required':
                    return (v) => v !== ''
                        ? true
                        : this.$t('verify.required_field');
                case 'min':
                    const min = (args?.[0] || 0);
                    return (v) => min <= v.length
                        ? true
                        : this.$i18n.t('verify.text_minimum') + min + this.$i18n.t('verify.text_character');
                case 'max':
                    const max = (args?.[0] || Infinity);
                    return (v) => v.length <= max
                        ? true
                        : this.$i18n.t('verify.text_maximum') + max + this.$i18n.t('verify.text_character');
                case 'email':
                    return (v) => validator.isEmail(v)
                        ? true
                        : this.$i18n.t('verify.text_format_email');
                case 'tel':
                    return (v) => validator.isMobilePhone(v)
                        ? true
                        : this.$i18n.t('verify.text_format_telephone');
                case 'zip':
                    return (v) => v.length === 7 && validator.isNumeric(v)
                        ? true
                        : this.$i18n.t('verify.text_format_zip');
                case 'number':
                    return (v) => validator.isNumeric(v)
                        ? true
                        : this.$i18n.t('verify.text_format_numeric');
                case 'url':
                    return (v) => validator.isURL(v)
                        ? true
                        : this.$i18n.t('verify.text_format_url');
                case 'regex':
                    const regex = new RegExp(args?.[0] || '');
                    return (v) => regex.test(v)
                        ? true
                        : this.$i18n.t('verify.text_format_regex') + regex;
                default:
                    return null;
                }
            })
                .filter((fn) => fn);
        }
    }
};
</script>
