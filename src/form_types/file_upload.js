export default function createUploadFileSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '7') {
        if (json.required === '2') {
            result.required = true;
        } else {
            result.required = false;
        }
        result.accept = json.extensions.toString();
        result.model = key;
        result.type = 'uploadFile';
    }

    return result;
}
