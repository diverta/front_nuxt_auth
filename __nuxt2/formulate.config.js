import validator from 'validator';
import { isAfter, isBefore } from 'date-fns';

export default {
    locale: 'ja',
    library: {
        FormText: {
            component: 'FormText'
        },
        FormTextarea: {
            component: 'FormTextarea'
        },
        FormSingleOption: {
            component: 'FormSingleOption',
        },
        FormSingleChoice: {
            component: 'FormSingleChoice',
        },
        FormMultipleChoice: {
            component: 'FormMultipleChoice',
        },
        FormFileUpload: {
            component: 'FormFileUpload',
            slotProps: {
                component: ['image']  // custom prop for image output useage
            }
        },
        FormDate: {
            component: 'FormDate',
            slotProps: {
                component: ['time']  // custom prop for datetime useage
            }
        },
        FormPassword: {
            component: 'FormPassword',
        },
        FormTextareaJson: {
            component: 'FormTextareaJson',
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
        password: (ctx, args) => /^[a-zA-Z0-9\-_&=+%#@$*.!:]+$/.test(ctx.value),
        datetime: (ctx, ...args) => {
            if (!ctx.value) {
                return;
            }
            const d = new Date(ctx.value);
            const [min, max] = args;
            if (min && isBefore(d, new Date(Number(min)))) { return false; }
            if (max && isAfter(d, new Date(Number(max)))) { return false; }
        }
    }
};
