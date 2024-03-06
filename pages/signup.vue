<template>
  <div class="l-content_maxWidth-sm mb-5 pb-5">
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="orange white-4"
    />
    <div class="v-stepper c-form_wrap white">
      <v-container fluid>
        <div class="l-content_heading">
          <h1>{{ $t("signup.title") }}</h1>
          <h4 class="slogan">
            {{ $t("signup.text") }}
          </h4>
        </div>

        <v-text-field
          v-model="sitekey"
          :label="$t('login.site_key')"
          type="text"
          outlined
        />

        <FormKit v-if="sitekey" type="form" @submit="handleSubmit">
          <FormKitSchema
            :schema="[
              {
                name: 'name1',
                label: $t('label.first_name'),
                $formkit: 'text',
                validation: 'required|length:0,100',
              },
              {
                name: 'name2',
                label: $t('label.last_name'),
                $formkit: 'text',
                validation: 'required|length:0,100',
              },
              {
                name: 'hire_date',
                label: $t('label.hire_date'),
                $formkit: 'date',
                validation: 'required',
              },
              {
                name: 'department',
                label: $t('label.department'),
                $formkit: 'text',
                validation: 'length:0,100',
              },
              {
                name: 'position',
                label: $t('label.position'),
                $formkit: 'text',
                validation: 'length:0,100',
              },
              {
                name: 'tel',
                label: $t('label.phone'),
                $formkit: 'text',
                validation: 'required|length:0,100',
              },
              {
                name: 'email',
                label: $t('label.email'),
                $formkit: 'email',
                validation: 'required|email|length:0,100',
              },
              {
                name: 'login_pwd',
                label: $t('label.password'),
                $formkit: 'password',
                validation: 'required|length:8,100',
                placeholder: 'Password',
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
              },
              {
                name: 'notes',
                label: $t('label.notes'),
                $formkit: 'textarea',
                validation: 'length:0,1000',
              },
            ]"
          ></FormKitSchema>
        </FormKit>

        <v-checkbox v-model="agreementChecked" class="c-form_tnc">
          <template #label>
            <div>{{ $t("common.agree") }}</div>
          </template>
        </v-checkbox>
      </v-container>
    </div>
  </div>
</template>
<script setup>
import { FormKitSchema } from "@formkit/vue";
const snackbar = useSnackbar();
const { authUser, register } = useAuth();
const loading = ref(false);
const sitekey = ref(apiDomain.sitekey);
const agreementChecked = ref(false);

const handleSubmit = async (form) => {
  if (!agreementChecked.value) {
    snackbar.add({
      type: "info",
      text: "Please agree to the terms and conditions",
    });
    return;
  }

  loading.value = true;
  console.log(form);

  apiDomain.sitekey = sitekey.value;
  apiDomain.baseURL =
    apiDomain.sitekey === "dev-nuxt-auth"
      ? "https://dev-nuxt-auth.a.kuroco.app"
      : `https://${apiDomain.sitekey}.g.kuroco.app`;

  try {
    await register(form);
  } catch (error) {
    snackbar.add({
      type: "error",
      text: error?.response?._data?.errors?.[0]?.message || "An error occurred",
    });
  } finally {
    loading.value = false;
  }
};
</script>
