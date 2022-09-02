import strtotime from 'locutus/php/datetime/strtotime';
import { min, max } from 'date-fns';

/**
 * returns shuffled inner elements array.
 * @param {*} array
 * @returns shuffled array
 */
export function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

/** returns whether minimum accptable date or undefined */
const getMinDatetime = (options = {}) => {
    const mY = options?.minYear ? new Date(`${options.minYear}-01-01 00:00:00`) : undefined;
    if (!options?.minPeriod) {
        return mY?.getTime();
    }
    const org = options?.originStrDate ? new Date(options?.originStrDate) : new Date();
    const baseDatetime = Math.trunc(org.getTime() / 1000);
    const mDY = new Date(strtotime(options.minPeriod, baseDatetime) * 1000);
    return mY ? min([mY, mDY]).getTime() : mDY?.getTime();
};
/** returns whether minimum accptable date or undefined */
const getMaxDatetime = (options = {}) => {
    const mY = options?.maxYear ? new Date(`${options.maxYear}-12-31 12:59:59`) : undefined;
    if (!options?.maxPeriod) {
        return mY?.getTime();
    }
    const org = options?.originStrDate ? new Date(options?.originStrDate) : new Date();
    const baseDatetime = Math.trunc(org.getTime() / 1000);
    const mDY = new Date(strtotime(options.maxPeriod, baseDatetime) * 1000);
    return mY ? max([mY, mDY]).getTime() : mY?.getTime();
};

/**
 * returns a single FormulateSchema object from a single COLs object.
 * @see https://vueformulate.com/guide/forms/generating-forms/#schemas
 * @param {*} keyName COLs object key name
 * @param {*} param1 COLs object value
 * @returns {object} FormulateSchema
 */
export function getFormulateScheme(keyName, { attribute, title, type, contents, required, validate, options }) {
    const getValidationRuleStr = (...customRuleStrs) => {
        return [
            required === 2 ? 'required' : null,
            ...customRuleStrs
        ]
            .filter((v) => v)
            .join('|');
    };

    const scheme = {
        name: keyName,
        label: title,
        'label-class': [
            required === 2 ? 'required' : undefined
        ],
        placeholder: attribute?.placeholder,
        disableErrors: true // disable native FormulateInput errors, uses custom errors instead.
    };

    switch (type) {
    case 1:
        return {
            ...scheme,
            validation: getValidationRuleStr(
                validate?.type ? `${validate.type}:${validate.regex}` : null,
                attribute?.max_length ? `max:${attribute.max_length},length` : null,
                attribute?.min_length ? `min:${attribute.min_length},length` : null,
                keyName === 'from_mail' ? 'email' : null // the auto generated item `from_mail` must be email.
            ),
            type: 'FormText'
        };
    case 2:
        return {
            ...scheme,
            validation: getValidationRuleStr(
                validate?.type ? `${validate.type}:${validate.regex}` : null,
                attribute?.max_length ? `max:${attribute.max_length},length` : null,
                attribute?.min_length ? `min:${attribute.min_length},length` : null
            ),
            type: 'FormTextarea'
        };
    case 3:
        return {
            ...scheme,
            validation: getValidationRuleStr(),
            type: 'FormSingleChoice',
            options: attribute?.random === '1' ? shuffle(contents) : contents
        };
    case 4:
        return {
            ...scheme,
            validation: getValidationRuleStr(),
            type: 'FormSingleOption',
            options: attribute?.random === '1' ? shuffle(contents) : contents
        };
    case 5:
        return {
            ...scheme,
            validation: getValidationRuleStr(),
            type: 'FormMultipleChoice',
            options: attribute?.random === '1' ? shuffle(contents) : contents
        };
    case 6:
        return {
            ...scheme,
            validation: getValidationRuleStr(
                `datetime:${getMinDatetime(options)},${getMaxDatetime(options)}`
            ),
            time: attribute?.add_time === '1',
            type: 'FormDate'
        };
    case 7:
        return {
            ...scheme,
            validation: getValidationRuleStr(
                options?.length > 0 ? `mime:${options.join(',')}` : null // type:file has this `options`, such as like '['jpg','png']'.
            ),
            image: false,
            type: 'FormFileUpload'
        };
    case 8:
        return {
            ...scheme,
            type: 'FormTextareaJson'
        };
    default:
        return {};
    }
};

/**
 * parse Kuroco's dynamic Inquiry COLs object several items included, to formulate Array schemas.
 */
export default (ctx, inject) => {
    inject(
        'parseFormulateSchema',
        (cols) => Object.entries(cols)
            .sort(([, a], [, b]) =>
                a.order_no < b.order_no ? 1 : (a.order_no > b.order_no ? -1 : 0))
            .map(([keyName, v]) => getFormulateScheme(keyName, v))
    );
};
