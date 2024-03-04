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
        <FormKit v-model="formValues" type="form" @submit="handleSubmit">
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
                validation: 'required|length:0,100',
              },
              {
                name: 'position',
                label: $t('label.position'),
                $formkit: 'text',
                validation: 'required|length:0,100',
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
              // {
              //@TODO profile image
              // name: 'profileimage',
              // label: $t('label.avatar'),
              // $formkit: 'file',
              // },
              {
                //@TODO by default select the dropdown value when reading
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
          />
        </FormKit>
      </v-container>
    </div>
  </div>
</template>
<script setup>
import { FormKitSchema } from "@formkit/vue";
const snackbar = useSnackbar();
const { authUser } = useAuth();
const formValues = ref({});
const loading = ref(true);
const agreementChecked = ref(false);

const handleSubmit = async (form) => {
  console.log(form);
  try {
    const response = await $fetch(
      `${apiDomain.baseURL}/rcms-api/1/member/update`,
      {
        credentials: "include",
        server: false,
        method: "POST",
        body: form,
      }
    );

    if (response.errors.length !== 0) {
      throw new Error(response.errors.join("\n"));
    }

    console.log("Profile updated successfully");
    snackbar.add({
      type: "success",
      text: "Profile updated successfully",
    });
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  fetchProfile();
  loading.value = false;
});

const fetchProfile = async () => {
  try {
    const res = await $fetch(`${apiDomain.baseURL}/rcms-api/1/member/me`, {
      credentials: "include",
      server: false,
    });
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
    console.log(formValues.value);
  } catch (error) {
    console.error(error);
  }
};
</script>
