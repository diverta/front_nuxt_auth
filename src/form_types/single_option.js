export default function createSingleOptionSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '4') {
        result.model = key;
        result.label = json.title;
        result.contents = json.contents;
        if (json.hasOwnProperty('option')) {
            result.option = json.option;
        } else {
            result.option = {};
        }
        if (json.required === '2') {
            result.required = true;
        } else {
            result.required = false;
        }
        if (
            json.hasOwnProperty('attribute') &&
      json.attribute.hasOwnProperty('random')
        ) {
            if (json.attribute.random === '1') {
                let list = result.contents;
                list = list.sort(() => Math.random() - 0.5);
                result.contents = list;
            }
        }

        result.type = 'vuetifySingleOption';
    }

    return result;
}
