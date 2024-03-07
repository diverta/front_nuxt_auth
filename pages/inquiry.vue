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
            <!-- @TODO FIX File upload -->
            <FormKit
              v-if="field.type == 7"
              :type="getFieldType(field.type)"
              :name="field.key"
              :label="field.title"
              :validation="field.required == 2 ? 'required' : ''"
              @input="handleFileUpload"
              :value="fileID"
            />
            <FormKit
              v-else
              :type="getFieldType(field.type)"
              :name="field.key"
              :label="field.title"
              :validation="field.required == 2 ? 'required' : ''"
              :options="field.options"
            />
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
const isUploadFile = ref(null);
const fileID = ref(null);

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
    case 4:
      return "select";
    case 5:
      return "checkbox";
    case 7:
      return "file";
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
    snackbar.add({
      type: "error",
      text: e?.response?._data?.errors?.[0]?.message || "An error occurred",
    });
  }
  loading.value = false;
};

const handleFileUpload = async (file) => {
  const fileData = new FormData();
  fileData.append("file", file[0].file);

  try {
    const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/upload`, {
      credentials: "include",
      method: "POST",
      body: fileData,
    });
    
    if(response.errors.length !== 0){
      snackbar.add({
      type: "error",
      text: response?.errors?.[0]?.message || "Error while uplaoding file",
    });
    }
    else{
      isUploadFile.value = true;
      const file_id = response.file_id;
      fileID.value = { file_id };
    }
  } catch (error) {
    snackbar.add({
      type: "error",
      text: error?.response?._data?.errors?.[0]?.message || "An error occurred",
    });
    return {};
  }
};

const handleSubmit = async (form) => {
  let formDataAsText = {};
  // @TODO: Convert form data to text
  // for (const [key, value] of Object.entries(form)) {
  //   if(value!==undefined && value!==null && value!==""){
  //     // console.log(type(value))
  //     formDataAsText[key] = value.toString();
  //   }
  // }

  if(isUploadFile.value){
    form.ext_08 = fileID.value ;
  }

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

    snackbar.add({
      type: "success",
      text: "Inquiry posted successfully",
    });
  } catch (e) {
    snackbar.add({
      type: "error",
      text: e?.response?._data?.errors?.[0]?.message || "An error occurred",
    });
  }
};
</script>
