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

export function getFormulateScheme(keyName, { attribute, title, type, contents, required, validate, options }) {
    const validation = [
        required === 2 ? 'required' : null,
        validate?.type ? `${validate.type}:${validate.regex}` : null,
        attribute?.max_length ? `max:${attribute.max_length},length` : null,
        attribute?.min_length ? `min:${attribute.min_length},length` : null,
        options?.length > 0 ? `mime:${options.join(',')}` : null, // type:file has this `options`, such as like '['jpg','png']'.
        keyName === 'from_mail' ? 'email' : null // the auto generated item `from_mail` must be email.
    ]
        .filter((v) => v)
        .join('|');

    const scheme = {
        name: keyName,
        label: title,
        placeholder: attribute?.placeholder,
        validation,
        disableErrors: true // disable native FormulateInput errors, uses custom errors instead.
    };

    switch (type) {
    case 1:
        return {
            ...scheme,
            type: 'VuetifyText'
        };
    case 2:
        return {
            ...scheme,
            type: 'VuetifyTextarea'
        };
    case 3:
        return {
            ...scheme,
            type: 'VuetifySingleChoice',
            options: attribute?.random === '1' ? shuffle(contents) : contents
        };
    case 4:
        return {
            ...scheme,
            type: 'VuetifySingleOption',
            options: attribute?.random === '1' ? shuffle(contents) : contents
        };
    case 5:
        return {
            ...scheme,
            type: 'VuetifyMultipleChoice',
            options: attribute?.random === '1' ? shuffle(contents) : contents
        };
    // TODO date
    case 6:
        return {
            ...scheme,
            type: 'datetune-locale',
            options: contents
        };
    case 7:
        return {
            ...scheme,
            type: 'VuetifyFileUpload'
        };
    default:
        return {};
    }
};

/**
 * parse Kuroco COLs object to formulate scheme.
 */
export default (ctx, inject) => {
    inject(
        'parseFormulateScheme',
        (cols) => Object.entries(cols)
            .sort(([, a], [, b]) => a > b ? 1 : -1)
            .map(([keyName, v]) => getFormulateScheme(keyName, v))
    );
};
