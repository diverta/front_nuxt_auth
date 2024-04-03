<template>
    <ClientOnly>
        <div>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute top color="orange white-4" />
            <div class="l-content_heading">
                <h3 class="slogan text-left">{{ $t('inquiry.message') }}<br /></h3>
            </div>
            <div class="v-stepper mt-5 c-form_wrap">
                <v-container fluid>
                    <FormKit
                        id="inquiry-form"
                        type="form"
                        :incomplete-message="$t('verify.fille_property')"
                        :submit-label="$t('common.submit')"
                        :submit-attrs="{
                            wrapperClass: 'inquiry-form_elm-submit'
                        }"
                        :config="{
                            classes: {
                                outer: 'inquiry-form_outer',
                                wrapper: 'c-form_formulate-wrapper',
                                fieldset: 'c-form_formulate-fieldset'
                            }
                        }"
                        @submit="handleSubmit"
                    >
                        <div class="inquiry-form_container">
                            <template v-for="field in formFields" :key="field.key">
                                <FormKit
                                    v-if="field.type === 'file'"
                                    :type="field.type"
                                    :name="field.key"
                                    :label="field.title"
                                    :validation="field.required ? 'required' : ''"
                                    :validation-messages="{
                                        required: $t('verify.required_field')
                                    }"
                                    :classes="{
                                        outer: `inquiry-form_elm-${field.type}`
                                    }"
                                    @input="(event) => handleFileUpload({ key: field.key, event })"
                                />
                                <FormKit
                                    v-else
                                    :type="field.type"
                                    :name="field.key"
                                    :label="field.title"
                                    :validation="field.required ? 'required' : ''"
                                    :validation-messages="{
                                        required: $t('verify.required_field')
                                    }"
                                    :options="field.options"
                                    :classes="{
                                        outer: `inquiry-form_elm-${field.type}`
                                    }"
                                />
                            </template>
                        </div>
                        <FormKit
                            type="checkbox"
                            :label="$t('common.agree')"
                            name="term"
                            validation="accepted"
                            :validation-messages="{
                                accepted: $t('verify.terms_of_use')
                            }"
                            :classes="{
                                outer: 'inquiry-form_elm-terms',
                                wrapper: 'inquiry-form_elm-terms_wrapper'
                            }"
                        />
                    </FormKit>
                </v-container>
            </div>
        </div>
    </ClientOnly>
</template>

<script setup>
import { reset } from '@formkit/core';

const router = useRouter();
const snackbar = useSnackbar();
const loading = ref(true);
const formFields = ref({});
const localePath = useLocalePath();
const { t } = useI18n();

const transformAdapter = (field) => {
    if (Array.isArray(field.options)) {
        const options = {};
        field.options.forEach(({ key, value }) => {
            if (key !== undefined && value !== undefined) {
                options[key] = value;
            }
        });
        return options;
    }
    return field.options;
};

onMounted(async () => {
    const getFieldType = (field) => {
        switch (field.type) {
            case 1:
                if (field.title === 'email') {
                    return 'email';
                } else {
                    return 'text';
                }
            case 2:
                return 'textarea';
            case 3:
                return 'radio';
            case 4:
                return 'select';
            case 5:
                return 'checkbox';
            case 7:
                return 'file';
            default:
                return 'text';
        }
    };

    loading.value = true;
    try {
        const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/inquiry/1`, {
            credentials: 'include',
            server: false
        });
        formFields.value = Object.values(response.details.cols)
            .map((d) => ({
                ...d,
                type: getFieldType(d),
                required: d.required === 2,
                options: transformAdapter(d)
            }))
            // convert array to object
            .reduce((acc, curr) => {
                acc[curr.key] = curr;
                return acc;
            }, {});
    } catch (e) {
        snackbar.add({
            type: 'error',
            text: e?.response?._data?.errors?.[0]?.message || t('common.error')
        });
        router.push(localePath('/'));
    } finally {
        loading.value = false;
    }
});

const handleFileUpload = async ({ key, event }) => {
    loading.value = true;

    // remove fileObject when event is file-clear
    const isFileAdd = event?.[0]?.file;
    if (!isFileAdd) {
        formFields.value[key].fileObject = undefined;
        loading.value = false;
        return;
    }

    // prepare for multipart/form-data file upload
    const __file = event[0].file;
    const fileData = new FormData();
    fileData.append('file', __file);

    try {
        const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/upload`, {
            credentials: 'include',
            method: 'POST',
            body: fileData
        });

        if (response.errors.length !== 0) {
            throw new Error({ response });
        }

        // store data as fileObject to formFields, will be used in form submit
        const fileObject = {
            file_id: response.file_id,
            file_nm: __file.name,
            desc: __file.name
        };
        formFields.value[key].fileObject = fileObject;
    } catch (error) {
        snackbar.add({
            type: 'error',
            text: error?.response?._data?.errors?.[0]?.message || t('common.error')
        });
        formFields.value[key].fileObject = undefined;
    } finally {
        loading.value = false;
    }
};

const handleSubmit = async (formValues) => {
    // inject file values from formFields, which is prepared in handleFileUpload
    Object.values(formFields.value)
        .filter((field) => field.type === 'file')
        .forEach((field) => (formValues[field.key] = field.fileObject));

    try {
        const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/inquiry/1`, {
            credentials: 'include',
            server: false,
            method: 'POST',
            body: {
                ...formValues,
                // remove unnecessary fields
                term: undefined
            }
        });

        if (response.errors.length !== 0) {
            throw new Error({ response });
        }

        reset('inquiry-form');
        snackbar.add({
            type: 'success',
            text: t('inquiry.thanks')
        });
    } catch (e) {
        snackbar.add({
            type: 'error',
            text: e?.response?._data?.errors?.[0]?.message || t('common.error')
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style lang="scss">
.inquiry-form {
    &_container {
        display: grid;
        gap: 0 20px;
        grid-template-columns: 1fr;
        @media screen and (min-width: 769px) {
            grid-template-columns: 1fr 1fr;
            grid-auto-flow: column;
        }
    }
    &_elm {
        &-terms_wrapper,
        &-submit {
            display: flex;
            justify-content: center;
        }
    }

    @media screen and (min-width: 769px) {
        &_elm {
            &-text,
            &-select,
            &-file {
                grid-column: 1;
            }
            &-radio,
            &-checkbox,
            &-textarea {
                grid-row: span 2;
                grid-column: 2;
            }

            &-radio,
            &-checkbox {
                fieldset {
                    display: block;
                    padding-left: 20px;
                }
            }
        }
    }
}
</style>
