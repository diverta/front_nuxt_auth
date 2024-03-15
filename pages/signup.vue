<template>
  <ClientOnly>
    <div class="l-content_maxWidth-sm mb-5 pb-5">
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="orange white-4"
      />
      <div class="v-stepper c-form_wrap bg-white">
        <v-container fluid>
          <div class="l-content_heading">
            <h1>{{ $t('signup.title') }}</h1>
            <h4 class="slogan">
              {{ $t('signup.text') }}
            </h4>
          </div>

          <FormKit
            type="form"
            @submit="handleSubmit"
            :submit-label="$t('common.submit')"
            :submit-attrs="{
              wrapperClass: 'signup-form_elm-submit',
            }"
            :config="{
              classes: {
                outer: 'signup-form_outer',
                wrapper: 'c-form_formulate-wrapper',
                fieldset: 'c-form_formulate-fieldset',
              },
            }"
          >
            <div class="signup-form_container">
              <FormKit
                v-model="sitekey"
                name="sitekey"
                :label="$t('login.site_key')"
                type="text"
                :classes="{ outer: 'signup-form_elm-sitekey' }"
                validation="required|length:0,100"
              />
              <FormKitSchema
                :schema="[
                  {
                    name: 'name1',
                    label: $t('label.first_name'),
                    $formkit: 'text',
                    validation: 'required|length:0,100',
                    classes: {
                      outer: 'signup-form_elm-name1',
                    },
                  },
                  {
                    name: 'name2',
                    label: $t('label.last_name'),
                    $formkit: 'text',
                    validation: 'required|length:0,100',
                    classes: {
                      outer: 'signup-form_elm-name2',
                    },
                  },
                  {
                    name: 'hire_date',
                    label: $t('label.hire_date'),
                    $formkit: 'date',
                    validation: 'required',
                    classes: {
                      outer: 'signup-form_elm-hire_date',
                    },
                  },
                  {
                    name: 'department',
                    label: $t('label.department'),
                    $formkit: 'text',
                    validation: 'length:0,100',
                    classes: {
                      outer: 'signup-form_elm-department',
                    },
                  },
                  {
                    name: 'position',
                    label: $t('label.position'),
                    $formkit: 'text',
                    validation: 'length:0,100',
                    classes: {
                      outer: 'signup-form_elm-position',
                    },
                  },
                  {
                    name: 'tel',
                    label: $t('label.phone'),
                    $formkit: 'text',
                    validation: 'required|length:0,100',
                    classes: {
                      outer: 'signup-form_elm-tel',
                    },
                  },
                  {
                    name: 'email',
                    label: $t('label.email'),
                    $formkit: 'email',
                    validation: 'required|email|length:0,100',
                    classes: {
                      outer: 'signup-form_elm-email',
                    },
                  },
                  {
                    name: 'login_pwd',
                    label: $t('label.password'),
                    $formkit: 'password',
                    validation: 'required|length:8,100',
                    placeholder: 'Password',
                    classes: {
                      outer: 'signup-form_elm-login_pwd',
                    },
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
                      { label: 'Malaysia', value: '3' },
                    ],
                    classes: {
                      outer: 'signup-form_elm-office',
                    },
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
                      { label: 'Excercise', value: '10' },
                    ],
                    classes: {
                      outer: 'signup-form_elm-hobby',
                    },
                  },
                  {
                    name: 'notes',
                    label: $t('label.notes'),
                    $formkit: 'textarea',
                    validation: 'length:0,1000',
                    classes: {
                      outer: 'signup-form_elm-notes',
                    },
                  },
                ]"
              ></FormKitSchema>
            </div>
            <FormKit
              type="checkbox"
              :label="$t('common.agree')"
              name="term"
              v-model="agreementChecked"
              validation="accepted"
              :classes="{
                outer: 'signup-form_elm-terms',
                wrapper: 'signup-form_elm-terms_wrapper',
              }"
            />
          </FormKit>
        </v-container>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
import { FormKitSchema } from '@formkit/vue';
const snackbar = useSnackbar();
const { register } = useAuth();
const loading = ref(false);
const sitekey = ref(apiDomain.sitekey);
const agreementChecked = ref(false);

const handleSubmit = async (form) => {
  loading.value = true;

  apiDomain.sitekey = sitekey.value;
  apiDomain.baseURL =
    apiDomain.sitekey === 'dev-nuxt-auth'
      ? 'https://dev-nuxt-auth.a.kuroco.app'
      : `https://${apiDomain.sitekey}.g.kuroco.app`;
  localStorage.setItem('sitekey', apiDomain.baseURL);
  try {
    await register({
      ...form,
      // remove unnecessary fields
      sitekey: undefined,
      term: undefined,
    });
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error?.response?._data?.errors?.[0]?.message || 'An error occurred',
    });
  } finally {
    loading.value = false;
  }
};
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
      &-sitekey {
        grid-row: 1;
        grid-column: 1 / 3;
      }
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
