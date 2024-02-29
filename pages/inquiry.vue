<template></template>
<script setup>
const { authUser } = useAuth();
const inquiryID = ref(1);
const loading = ref(true);
const agreementChecked = ref(false);
const formValues = reactive({});

onMounted(() => {
  fetchInquiry();
});



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
    console.log("cols", cols);

    // formValues.value = customParseSchema(cols);
    // console.log("formValues", formValues.value);


    // const filteredCols = cols.filter(({ name }) => {
    //   return !["body", "ext_03"].includes(name);
    // });
    // formValues.value = filteredCols.reduce((acc, { name }) => {
    //   acc[name] = "";
    //   return acc;
    // }, {});
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
};
</script>
