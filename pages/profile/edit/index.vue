<template>
  <div>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="orange white-4"
    />
    <div class="v-stepper c-form_wrap">
      <v-container fluid>
        <!-- <FormKitSchema :schema="schema" /> -->
        <!-- <FormKit type="form">
          <FormKit
            type="email"
            label="Email"
            placeholder="email@example.com"
            validation="required|email"
          />
        </FormKit> -->
        <FormKit type="form" @submit="handleSubmit">
          <FormKitSchema
            :schema="[
              {
                name: 'name1',
                label: $t('label.first_name'),
                $formkit: 'text',
                validation: 'required|length:0,100',
              },
              {
                $formkit: 'email',
                name: 'email',
                label: 'Email address',
                help: 'Please enter your email address.',
              },
            ]"
          />
        </FormKit>
      </v-container>
    </div>
  </div>
</template>
<script setup>
import { FormKitSchema } from "@formkit/vue";
const { authUser } = useAuth();
const config = useRuntimeConfig();
const formValues = ref({});
const loading = ref(true);
const agreementChecked = ref(false);

const handleSubmit = async (form) => {
  console.log(form);
  try {
    const response = await $fetch(`${config.public.kurocoApiDomain}/rcms-api/1/member/update`, {
      credentials: "include",
      server: false,
      method: "POST",
      body: form,
    });

    if (response.errors.length !== 0) {
      throw new Error(response.errors.join("\n"));
    }

    console.log("Profile updated successfully");
  } catch (e) {
    console.log("Phatti");
    console.log(e);
  }
};

const submitF = async () => {
  const sendModel = JSON.parse(JSON.stringify(formValues));
  try {
    const response = await $fetch("/rcms-api/1/member/update", {
      method: "POST",
      body: sendModel,
    });

    if (response.errors.length !== 0) {
      throw new Error(response.errors.join("\n"));
    }

    console.log("Profile updated successfully");
    // $snackbar.info($i18n.t('mypage.profile_changed'));
  } catch (e) {
    $snackbar.error(e?.response?.data?.errors?.[0]?.message || e);
  }
};

onMounted(() => {
  fetchProfile();
  loading.value = false;
});

const fetchProfile = async () => {
  try {
    const res = await $fetch(
      `${config.public.kurocoApiDomain}/rcms-api/1/member/me`,
      {
        credentials: "include",
        server: false,
      }
    );
    const d = res.details;

    formValues.value = {
      ...formValues.value,
      name1: d?.name1,
      name2: d?.name2,
      department: d?.department,
      position: d?.position,
      tel: d?.tel,
      email: d?.email,
      notes: d?.notes,
      hire_date: d?.hire_date,
      multiple_check: d?.multiple_check?.map(({ key }) => `${key}`) || "",
    };
  } catch (error) {
    console.error(error);
  }
};
</script>
