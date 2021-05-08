export default function createPrefectureSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '9') {
        result.model = key;
        if (json.required === '2') {
            result.required = true;
        } else {
            result.required = false;
        }
        result.type = 'vuetifyPrefecture';
        result.label = json.title;
        result.options = [];
        for (const key in json.options) {
            result.options.push({ text: json.options[key], value: key });
        }
    }

    return result;
}
