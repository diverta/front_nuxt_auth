<template>
    <ClientOnly>
        <div>
            <div class="l-content_heading">
                <h1>{{ $t('member.detail_title') }}</h1>
            </div>
            <v-col>
                <v-row>
                    <v-col>
                        <v-img fluid class="mx-auto mr-sm-5" :lazy-src="detail.url" :aspect-ration="16 / 9" :src="detail.url" max-height="180" max-width="180" />
                    </v-col>
                    <v-col class="mx-auto">
                        <v-container fluid>
                            <v-row class="headline mb-3">
                                <br />
                                {{ detail.name }}
                            </v-row>
                            <v-row v-if="detail.sex" class="mb-3"> <v-icon class="icon c-text_blue pr-2"> mdi-gender-male-female </v-icon>{{ detail.sex }} </v-row>
                            <v-row v-if="detail.birth" class="mb-3"> <v-icon class="icon c-text_blue pr-2"> mdi-card-account-details </v-icon>{{ detail.birth }} </v-row>
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
                <br />
                <br />
                <v-row>
                    <v-col>
                        <v-table class="elevation-1">
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
                <button type="submit" class="c-btn c-btn_dark c-btn_icon" @click="() => $router.go(-1)">
                    {{ $t('common.back') }}
                    <v-icon class="icon c-text_white pr-2"> mdi-undo-variant </v-icon>
                </button>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup>
const { authUser } = useAuth();
const { t } = useI18n();
const snackbar = useSnackbar();
const route = useRoute();
const member_id = ref(null);
const detail = ref({
    name: '',
    department: '',
    position: '',
    profileImageUrl: '',
    profile: {}
});
const placeholder = computed(() => {
    return new URL('@/assets/images/avatar-placeholder.png', import.meta.url).href;
});

onMounted(() => {
    fetchProfile();
});

const fetchProfile = async () => {
    member_id.value = route.params.slug;
    try {
        const res = await $fetch(`${apiDomain.baseURL}/rcms-api/1/member/list`, {
            credentials: 'include',
            server: false,
            params: {
                id: member_id.value
            }
        });
        const detailsObj = res.list[0];
        detail.value = {
            name: `${detailsObj.name1} ${detailsObj.name2}`,
            zip: detailsObj.zip_code,
            location: detailsObj.address1 ? `${detailsObj.address1}, ${detailsObj.address2} ${detailsObj.address3}` : '',
            phone: detailsObj.tel,
            email: detailsObj.email,
            url: detailsObj.profileimage.url ? `${detailsObj.profileimage.url}` : placeholder,
            sex: detailsObj?.sex?.label || '',
            birth: detailsObj?.birth || '',
            position: detailsObj?.position || '',
            department: detailsObj?.department || '',
            radio_button_2: detailsObj?.radio_button_2?.label,
            multiple_check: detailsObj?.multiple_check?.map(({ label }) => label)?.join(', ') || '',
            profile: {
                'Hire Date': detailsObj?.hire_date || 'N/A',
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
