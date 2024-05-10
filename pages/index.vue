<template>
    <ClientOnly>
        <Login v-if="!authUser.member_id" />
        <div v-else class="mypage">
            <v-carousel v-model="active" class="p-dashboard_banner">
                <v-carousel-item v-for="(url, i) in sliderImages" :key="i" :src="`${url}?height=500px`" reverse-transition="fade-transition" transition="fade-transition" />
            </v-carousel>

            <h1 class="text-left mt-5 pt-4">
                {{ $t('top.latest_articles') }}
            </h1>

            <TopicsGrid :topics="topicsList" />

            <div class="text-center py-5 mt-4 text-white">
                <a type="submit" block x-large color="success" class="c-btn c-btn_main c-btn_md c-btn_icon" @click="() => $router.push(localePath('/topics_list/'))">
                    {{ $t('top.more_articles') }}
                    <v-icon dark right class="icon"> mdi-arrow-right-drop-circle </v-icon>
                </a>
            </div>

            <h1 class="text-left mt-5 pt-4">
                {{ $t('top.starred') }}
            </h1>

            <TopicsList :topics="favouriteList" />

            <div class="text-center py-5 text-white">
                <a type="submit" block x-large color="success" class="c-btn c-btn_main c-btn_md c-btn_icon" @click="() => $router.push(localePath('/favourite/'))">
                    {{ $t('top.more_starred') }}
                    <v-icon dark right class="icon"> mdi-arrow-right-drop-circle </v-icon>
                </a>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup>
const { t } = useI18n();
const { authUser } = useAuth();
const topicsList = ref([]);
const favouriteList = ref([]);
const perPage = ref(5);
const active = ref(0);
const snackbar = useSnackbar();
const localePath = useLocalePath();

const sliderImages = computed(() => {
    return topicsList.value.map((topic) => topic?.ext_8?.url).filter((sliderImage) => sliderImage);
});

const updateTopics = async () => {
    try {
        topicsList.value = [];
        const { list: topics } = await $fetch(`${apiDomain.baseURL}/rcms-api/1/content/list?cnt=6`, {
            credentials: 'include',
            server: false
        });
        topicsList.value = topics;
    } catch (error) {
        snackbar.add({
            type: 'error',
            text: error?.response?._data?.errors?.[0]?.message || t('common.error')
        });
    }
};

const updateFavourite = async () => {
    try {
        favouriteList.value = [];
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
                cnt: perPage.value,
                ['id[]']: topicsIds
            }
        });
        favouriteList.value = favouriteTopicsRes.list;
    } catch (error) {
        snackbar.add({
            type: 'error',
            text: error?.response?._data?.errors?.[0]?.message || t('common.error')
        });
    }
};

watch(
    () => authUser.value,
    async () => {
        if (!authUser.value.member_id) {
            return [];
        }
        await updateTopics();
        await updateFavourite();
    },
    {
        deep: true,
        immediate: true
    }
);
</script>
