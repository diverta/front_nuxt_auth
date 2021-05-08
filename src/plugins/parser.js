import createTextSchema from '../form_types/text.js';
import createTextAreaSchema from '../form_types/textarea.js';
import createDateSchema from '../form_types/date.js';
import createUploadFileSchema from '../form_types/file_upload.js';
import createJsonSchema from '../form_types/json.js';
import createPrefectureSchema from '../form_types/prefecture.js';
import createSingleChoiceSchema from '../form_types/single_choice.js';
import createMultipleChoiceSchema from '../form_types/multiple_choice.js';
import createSingleOptionSchema from '../form_types/single_option.js';

const KurocoParser = {};

KurocoParser.install = function (Vue, options) {
    Vue.prototype.$parse = (json, key) => {
        if (
            json.hasOwnProperty('type') &&
      json.hasOwnProperty('required') &&
      json.required !== '0'
        ) {
            let result = {};
            const typeId = json.type;
            if (typeId === '1') {
                result = createTextSchema(json, key);
            } else if (typeId === '2') {
                result = createTextAreaSchema(json, key);
            } else if (typeId === '3') {
                result = createSingleChoiceSchema(json, key);
            } else if (typeId === '4') {
                result = createSingleOptionSchema(json, key);
            } else if (typeId === '5') {
                result = createMultipleChoiceSchema(json, key);
            } else if (typeId === '6') {
                result = createDateSchema(json, key);
            } else if (typeId === '7') {
                result = createUploadFileSchema(json, key);
            } else if (typeId === '8') {
                result = createJsonSchema(json, key);
            } else if (typeId === '9') {
                result = createPrefectureSchema(json, key);
            }
            return result;
        }
    };
};

export default KurocoParser;
