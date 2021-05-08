export default function createSingleChoiceSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '3') {
        result.model = key;
        result.label = json.title;
        result.contents = json.contents;

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

        result.type = 'vuetifySingleChoice';
    }

    return result;
}
