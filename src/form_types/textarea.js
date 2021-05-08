export default function createTextAreaSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '2') {
        result.model = key;
        result.type = 'vuetifyTextArea';
        result.inputType = 'text';
        result.label = json.title;
        result.placeholder = '';
        result.text = '';
        if (json.required === '2') {
            result.required = true;
        } else {
            result.required = false;
        }
        if (
            json.validate.hasOwnProperty('type') &&
      json.validate.type.length > 0
        ) {
            if (
                result.texttype === 'regex' &&
        json.validate.hasOwnProperty('regex')
            ) {
                result.texttype = json.validate.type;
                result.regex = json.validate.regex;
            }
        }

        if (json.attribute.max_length !== '') {
            result.counter = json.attribute.max_length;
            result.max = parseInt(json.attribute.max_length);
        } else {
            result.counter = 400;
            result.max = 400;
        }

        if (json.attribute.min_length !== '') {
            result.min = parseInt(json.attribute.min_length);
        } else {
            result.min = 0;
        }
    }

    return result;
}
