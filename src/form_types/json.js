export default function createJsonSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '8') {
        if (json.required === '2') {
            result.required = true;
        } else {
            result.required = false;
        }
        result.model = key;
        result.type = 'vuetifyJson';
        result.inputType = 'text';
    }

    console.log(result);
    return result;
}
