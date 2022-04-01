import validator from 'validator';

export default {
    locale: 'ja',
    library: {
        VuetifyText: {
            component: 'VuetifyText'
        },
        VuetifyTextarea: {
            component: 'VuetifyTextarea'
        },
        VuetifySingleOption: {
            component: 'VuetifySingleOption',
        },
        VuetifySingleChoice: {
            component: 'VuetifySingleChoice',
        },
        VuetifyMultipleChoice: {
            component: 'VuetifyMultipleChoice',
        },
        VuetifyFileUpload: {
            component: 'VuetifyFileUpload',
        },
        VuetifyDate: {
            component: 'VuetifyDate',
        },
        VuetifyPassword: {
            component: 'VuetifyPassword',
        }
    },
    /**
     * custom validation rules list except for native VueFormulate available rules.
     * @see https://vueformulate.com/guide/validation/
     */
    rules: {
        regex: (ctx, args) => {
            const regex = new RegExp(args);
            return regex.test(ctx.value);
        },
        tel: (ctx, args) => validator.isMobilePhone(ctx.value),
        zip: (ctx, args) => ctx.value.length === 7 && validator.isNumeric(ctx.value),
        number: (ctx, args) => validator.isNumeric(ctx.value),
        password: (ctx, args) => /^[a-zA-Z0-9\-_&=+%#@$*.!:]+$/.test(ctx.value)
    }
};
