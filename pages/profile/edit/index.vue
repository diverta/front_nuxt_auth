<template>
    <div>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />

    </div>
</template>
<script setup>

const { authUser } = useAuth();
const config = useRuntimeConfig();
const formValues = ref({});
const loading = ref(true);
const agreementChecked = ref(false);

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
