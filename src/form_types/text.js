export default function createTextSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '1') {
        result.model = key;
        result.type = 'vuetifyText';
        result.inputType = 'text';
        result.label = json.title;
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
            result.texttype = json.validate.type;
            if (
                result.texttype === 'regex' &&
        json.validate.hasOwnProperty('regex')
            ) {
                result.regex = json.validate.regex;
            }
        }

        if (json.attribute.max_length !== '') {
            result.counter = json.attribute.max_length;
            result.max = parseInt(json.attribute.max_length);
        } else {
            result.counter = 100;
            result.max = 100;
        }

        if (json.attribute.min_length !== '') {
            result.min = parseInt(json.attribute.min_length);
        } else {
            result.min = 0;
        }
    }

    return result;
}
