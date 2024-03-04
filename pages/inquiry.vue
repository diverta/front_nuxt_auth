<template>
  <div>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      color="orange white-4"
    />
    <div class="l-content_heading">
      <h3 class="slogan text-left">{{ $t("inquiry.message") }}<br /></h3>
    </div>
    <div class="v-stepper mt-5 c-form_wrap">
      <v-container fluid>
        <FormKit type="form" @submit="handleSubmit">
          <template v-for="field in formFields" :key="field.key">
            <!-- Radio Buttons -->
            <!-- <FormKit
              v-if="field.type === 3 || field.type === 4"
              :type="getFieldType(field.type)"
              :name="field.key"
              :label="field.title"
              :options="field.options"
            >
            </FormKit> -->

            <FormKit
              :type="getFieldType(field.type)"
              :name="field.key"
              :label="field.title"
              :validation="field.required == 2 ? 'required' : ''"
              :options="field.options"
            >
            </FormKit>
          </template>
        </FormKit>
      </v-container>
    </div>
  </div>
</template>
<script setup>
const { authUser } = useAuth();
const snackbar = useSnackbar();
const inquiryID = ref(1);
const loading = ref(true);
const agreementChecked = ref(false);
const formFields = ref([]);

onMounted(() => {
  fetchInquiry();
});

const getFieldType = (type) => {
  switch (type) {
    case 1:
      return "text";
    case 2:
      return "textarea";
    case 3:
      return "radio";
    // case 4:
    //   return "dropdown";
    case 5:
      return "checkbox";
    default:
      return "text";
  }
};

const fetchInquiry = async () => {
  loading.value = true;
  try {
    const response = await $fetch(
      `${apiDomain.baseURL}/rcms-api/1/inquiry/${inquiryID.value}`,
      {
        credentials: "include",
        server: false,
      }
    );
    const cols = response.details.cols;
    formFields.value = cols;
    console.log("formFields", formFields.value);
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
};

const handleSubmit = async (form) => {
  console.log(form);
  try {
    const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/inquiry/1`, {
      credentials: "include",
      server: false,
      method: "POST",
      body: form,
    });

    console.log("response", response);

    if (response.errors.length !== 0) {
      throw new Error(response.errors.join("\n"));
    }

    console.log("Inquiry posted successfully");
    snackbar.add({
      type: "success",
      text: "Inquiry posted successfully",
    });
  } catch (e) {
    console.log(e);
  }
};
</script>
