<template>
    <ClientOnly>
        <div>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute top color="orange white-4" />
            <div class="v-stepper c-form_wrap">
                <v-container fluid>
                    <ProfileForm v-if="hasProfile" :form-values="profile" @submit="handleSubmit" />
                </v-container>
            </div>
        </div>
    </ClientOnly>
</template>

<script setup>
const router = useRouter();
const snackbar = useSnackbar();
const profile = ref({});
const loading = ref(false);
const localePath = useLocalePath();
const { t } = useI18n();

const hasProfile = computed(() => Object.keys(profile.value).length > 0);

onMounted(async () => {
    loading.value = true;

    try {
        const res = await $fetch(`${apiDomain.baseURL}/rcms-api/1/member/me`, {
            credentials: 'include',
            server: false
        });
        const d = res.details;

        profile.value = {
            ...profile.value,
            name1: d?.name1,
            name2: d?.name2,
            department: d?.department,
            position: d?.position,
            tel: d?.tel,
            email: d?.email,
            notes: d?.notes,
            hire_date: d?.hire_date,
            multiple_check: d?.multiple_check?.map(({ key }) => `${key}`) || ''
        };
    } catch (error) {
        snackbar.add({
            type: 'error',
            text: error?.response?._data?.errors?.[0]?.message || t('common.error')
        });
        router.push(localePath('/profile'));
    } finally {
        loading.value = false;
    }
});

const handleSubmit = async (formValues) => {
    try {
        const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/member/update`, {
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
            throw new Error(response.errors.join('\n'));
        }

        snackbar.add({
            type: 'success',
            text: t('mypage.profile_changed')
        });
    } catch (e) {
        snackbar.add({
            type: 'error',
            text: e?.response?._data?.errors?.[0]?.message || t('common.error')
        });
    } finally {
        loading.value = false;
        router.push(localePath('/profile'));
    }
};
</script>
