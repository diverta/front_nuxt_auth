<template>
    <ClientOnly>
        <section>
            <v-col>
                <v-row>
                    <v-col>
                        <v-img fluid class="mx-auto mr-sm-5" :lazy-src="detail.url" :aspect-ration="16 / 9" :src="detail.profileImageUrl" max-height="180" max-width="180" />
                    </v-col>
                    <v-col class="mx-auto">
                        <v-container fluid>
                            <v-row class="headline mb-3">
                                <br />
                                {{ detail.name }}
                            </v-row>
                            <v-row v-if="detail.department" class="mb-3">
                                <v-icon class="icon c-text_blue pr-2"> mdi-office-building </v-icon>
                                {{ detail.department }}
                            </v-row>
                            <v-row v-if="detail.position">
                                <v-icon class="icon c-text_blue pr-2"> mdi-briefcase-account </v-icon>
                                {{ detail.position }}
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-table class="elevation-1 mt-5 c-table_responsive">
                            <template #default>
                                <tbody>
                                    <tr v-for="[keyName, value] in Object.entries(detail.profile)" :key="keyName">
                                        <td width="200">
                                            {{ keyName }}
                                        </td>
                                        <td v-if="keyName == 'Phone'" width="1000">
                                            <a :href="`tel:${value}`">{{ value }}</a>
                                        </td>
                                        <td v-else-if="keyName == 'Email'" width="1000">
                                            <a :href="`mailto:${value}`">{{ value }}</a>
                                        </td>
                                        <td v-else width="1000" class="py-sm-3">
                                            {{ value }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>
                    </v-col>
                </v-row>
            </v-col>
            <div class="text-center col text-white">
                <button type="submit" class="c-btn c-btn_dark c-btn_icon" @click="$router.push(localePath('/profile/edit'))">
                    {{ $t('common.edit') }}
                    <v-icon class="icon c-text_white pl-2"> mdi-pencil </v-icon>
                </button>
            </div>
        </section>
    </ClientOnly>
</template>
<script setup>
const { t } = useI18n();
const snackbar = useSnackbar();
const localePath = useLocalePath();
const { authUser } = useAuth();
const placeholder = computed(() => {
    return new URL('@/assets/images/avatar-placeholder.png', import.meta.url).href;
});
const detail = ref({
    name: '',
    department: '',
    position: '',
    profileImageUrl: '',
    profile: {}
});

onMounted(() => {
    fetchProfile();
});

const fetchProfile = async () => {
    try {
        const res = await $fetch(`${apiDomain.baseURL}/rcms-api/1/member/me`, {
            credentials: 'include',
            server: false
        });
        const detailsObj = res.details;

        detail.value = {
            name: `${detailsObj.name1} ${detailsObj.name2}`,
            profileImageUrl: detailsObj.profileimage.url ? `${detailsObj.profileimage.url}` : placeholder,
            position: detailsObj?.role || '',
            department: detailsObj?.department || '',
            profile: {
                'First Name': detailsObj.name1 || 'N/A',
                'Last Name': detailsObj.name2 || 'N/A',
                'Hire Date': detailsObj?.hire_date || 'N/A',
                Department: detailsObj.department || 'N/A',
                Position: detailsObj?.position || 'N/A',
                Phone: detailsObj.tel || 'N/A',
                Email: detailsObj.email || 'N/A',
                Office: detailsObj?.pull_down?.label || 'N/A',
                Hobby: detailsObj?.multiple_check?.map(({ label }) => label)?.join(', ') || 'N/A',
                Notes: detailsObj?.notes || 'N/A'
            }
        };
    } catch (error) {
        snackbar.add({
            type: 'error',
            text: error?.response?._data?.errors?.[0]?.message || t('common.error')
        });
    }
};
</script>
