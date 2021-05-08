export default function createDateSchema(json, key) {
    const result = {};
    if (json.hasOwnProperty('type') && json.type === '6') {
        result.model = key;
        result.type = 'vuetifyDate';
        result.time = '0';
        if (json.required === '2') {
            result.required = true;
        } else {
            result.required = true;
        }
        if (
            json.hasOwnProperty('attribute') &&
      json.attribute.hasOwnProperty('add_time')
        ) {
            if (json.attribute.add_time === '1') {
                result.time = '1';
            }
        }
        if (
            json.hasOwnProperty('attribute') &&
      json.attribute.hasOwnProperty('minYear')
        ) {
            result.minYear = json.attribute.minYear.concat('-01-01');
        } else {
            result.minYear = undefined;
        }
        if (
            json.hasOwnProperty('attribute') &&
      json.attribute.hasOwnProperty('maxYear')
        ) {
            result.maxYear = (parseInt(json.attribute.maxYear) + 1)
                .toString(10)
                .concat('-01');
        } else {
            result.maxYear = undefined;
        }
    }

    return result;
}
