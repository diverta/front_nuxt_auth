<template>
    <FormKit
        v-model="values"
        type="form"
        :incomplete-message="$t('verify.fille_property')"
        :submit-label="$t('common.submit')"
        :submit-attrs="{
            wrapperClass: 'signup-form_elm-submit'
        }"
        :config="{
            classes: {
                outer: 'signup-form_outer',
                wrapper: 'c-form_formulate-wrapper',
                fieldset: 'c-form_formulate-fieldset'
            }
        }"
        @submit="(formValues) => emit('submit', formValues)"
    >
        <div class="signup-form_container">
            <slot name="headInput" />

            <FormKitSchema
                :schema="[
                    {
                        name: 'name1',
                        label: $t('label.first_name'),
                        $formkit: 'text',
                        validation: 'required|length:0,100',
                        'validation-messages': {
                            required: $t('verify.required_field'),
                            length: $t('verify.text_maximum')
                        },
                        classes: {
                            outer: 'signup-form_elm-name1'
                        }
                    },
                    {
                        name: 'name2',
                        label: $t('label.last_name'),
                        $formkit: 'text',
                        validation: 'required|length:0,100',
                        'validation-messages': {
                            required: $t('verify.required_field'),
                            length: $t('verify.text_maximum')
                        },
                        classes: {
                            outer: 'signup-form_elm-name2'
                        }
                    },
                    {
                        name: 'hire_date',
                        label: $t('label.hire_date'),
                        $formkit: 'date',
                        validation: 'required',
                        'validation-messages': {
                            required: $t('verify.required_field')
                        },
                        classes: {
                            outer: 'signup-form_elm-hire_date'
                        }
                    },
                    {
                        name: 'department',
                        label: $t('label.department'),
                        $formkit: 'text',
                        validation: 'length:0,100',
                        'validation-messages': {
                            length: $t('verify.text_maximum')
                        },
                        classes: {
                            outer: 'signup-form_elm-department'
                        }
                    },
                    {
                        name: 'position',
                        label: $t('label.position'),
                        $formkit: 'text',
                        validation: 'length:0,100',
                        'validation-messages': {
                            length: $t('verify.text_maximum')
                        },
                        classes: {
                            outer: 'signup-form_elm-position'
                        }
                    },
                    {
                        name: 'tel',
                        label: $t('label.phone'),
                        $formkit: 'text',
                        validation: 'required|length:0,100',
                        'validation-messages': {
                            required: $t('verify.required_field'),
                            length: $t('verify.text_maximum')
                        },
                        classes: {
                            outer: 'signup-form_elm-tel'
                        }
                    },
                    {
                        name: 'email',
                        label: $t('label.email'),
                        $formkit: 'email',
                        validation: 'required|email|length:0,100',
                        'validation-messages': {
                            required: $t('verify.required_field'),
                            email: $t('verify.text_format_email'),
                            length: $t('verify.text_maximum')
                        },
                        classes: {
                            outer: 'signup-form_elm-email'
                        }
                    },
                    {
                        name: 'login_pwd',
                        label: $t('label.password'),
                        $formkit: 'password',
                        validation: 'required|length:8,100',
                        'validation-messages': {
                            required: $t('verify.required_field'),
                            length: $t('verify.password_format')
                        },
                        placeholder: 'Password',
                        classes: {
                            outer: 'signup-form_elm-login_pwd'
                        }
                    },
                    {
                        name: 'pull_down',
                        label: $t('label.office'),
                        $formkit: 'select',
                        placeholder: 'Select office',
                        options: [
                            { label: '', value: '' },
                            { label: 'Tokyo', value: '1' },
                            { label: 'Osaka', value: '2' },
                            { label: 'Malaysia', value: '3' }
                        ],
                        classes: {
                            outer: 'signup-form_elm-office'
                        }
                    },
                    {
                        name: 'multiple_check',
                        label: $t('label.hobby'),
                        $formkit: 'checkbox',
                        options: [
                            { label: 'Reading', value: '1' },
                            { label: 'Watching TV', value: '2' },
                            { label: 'Family Time', value: '3' },
                            { label: 'Going to Movies', value: '4' },
                            { label: 'Fishing', value: '5' },
                            { label: 'Computer', value: '6' },
                            { label: 'Gardening', value: '7' },
                            { label: 'Renting Movies', value: '8' },
                            { label: 'Walking', value: '9' },
                            { label: 'Excercise', value: '10' }
                        ],
                        classes: {
                            outer: 'signup-form_elm-hobby'
                        }
                    },
                    {
                        name: 'notes',
                        label: $t('label.notes'),
                        $formkit: 'textarea',
                        validation: 'length:0,1000',
                        'validation-messages': {
                            length: $t('verify.text_maximum')
                        },
                        classes: {
                            outer: 'signup-form_elm-notes'
                        }
                    }
                ]"
            ></FormKitSchema>
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
                outer: 'signup-form_elm-terms',
                wrapper: 'signup-form_elm-terms_wrapper'
            }"
        />
    </FormKit>
</template>

<script setup>
import { FormKitSchema } from '@formkit/vue';
const values = ref({});

const props = defineProps({
    formValues: {
        type: Object,
        default: () => ({})
    }
});
values.value = { ...props.values };

const emit = defineEmits(['submit']);
</script>

<style lang="scss">
@import 'assets/partials/_mixin';

.signup-form {
    &_container {
        display: grid;
        gap: 0 10px;
        grid-template-columns: 1fr;
        @media screen and (min-width: 769px) {
            grid-template-columns: 1fr 1fr;
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
            &-name1 {
                grid-row: 2;
                grid-column: 1;
            }
            &-name2 {
                grid-row: 2;
                grid-column: 2;
            }
            &-hire_date {
                grid-row: 3;
                grid-column: 1;
            }
            &-department {
                grid-row: 4;
                grid-column: 1;
            }
            &-position {
                grid-row: 5;
                grid-column: 1;
            }
            &-tel {
                grid-row: 6;
                grid-column: 1;
            }
            &-email {
                grid-row: 7;
                grid-column: 1;
            }
            &-login_pwd {
                grid-row: 8;
                grid-column: 1;
            }
            &-office {
                grid-row: 9;
                grid-column: 1;
            }
            &-hobby {
                grid-row: 3 / 6;
                grid-column: 2;
            }
            &-notes {
                grid-row: 6 / 10;
                grid-column: 2;
            }
        }
    }
}
</style>
