<template>
    <ClientOnly>
        <div fluid>
            <TopicsList :topics="topics" />
            <br />
            <div class="text-center mt-5 pt-5">
                <v-pagination v-if="Math.ceil(totalCnt / perPage) > 1" v-model="page" :length="Math.ceil(totalCnt / perPage)" class="c-navi_pagination" @input="() => updateTopics()" />
            </div>
        </div>
    </ClientOnly>
</template>
<script setup>
const { t } = useI18n();
const { authUser } = useAuth();
const snackbar = useSnackbar();
const topics = ref([]);
const page = ref(1);
const perPage = ref(20);
const totalCnt = ref(0);

onMounted(() => {
    updateTopics();
});

const updateTopics = async () => {
    try {
        const favouriteRes = await $fetch(`${apiDomain.baseURL}/rcms-api/1/favorite/list`, {
            credentials: 'include',
            server: false,
            params: {
                member_id: parseInt(authUser.value.member_id),
                module_type: 'topics'
            }
        });

        const topicsIds = favouriteRes.list.map((item) => item.module_id);
        if (topicsIds.length === 0) {
            return;
        }

        const favouriteTopicsRes = await $fetch(`${apiDomain.baseURL}/rcms-api/1/content/list`, {
            credentials: 'include',
            server: false,
            params: {
                pageID: page.value,
                cnt: perPage.value,
                ['id[]']: topicsIds
            }
        });

        totalCnt.value = favouriteTopicsRes.pageInfo.totalCnt;
        topics.value = favouriteTopicsRes.list;
    } catch (error) {
        snackbar.add({
            type: 'error',
            text: error?.response?._data?.errors?.[0]?.message || t('common.error')
        });
    }
};
</script>
