<template>
  <!-- <h1>Gaurav</h1>
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
    <form>
      <label for="locale-select">{{ $t('language') }}: </label>
      <select id="locale-select" v-model="$i18n.locale">
        <option value="en">en</option>
        <option value="ja">ja</option>
      </select>
    </form> -->
  <ClientOnly>
    <Login v-if="!authUser.member_id" />
    <div v-else class="mypage">
      <v-carousel class="p-dashboard_banner" v-model="active">
        <v-carousel-item
          v-for="(url, i) in sliderImages"
          :key="i"
          :src="`${url}?height=500px`"
          reverse-transition="fade-transition"
          transition="fade-transition"
        />
      </v-carousel>

      <h1 class="text-left mt-5 pt-4">
        {{ $t("top.latest_articles") }}
      </h1>

      <TopicsGrid :topics="topicsList" />

      <div class="text-center py-5 mt-4 text-white">
        <a
          type="submit"
          block
          x-large
          color="success"
          class="c-btn c-btn_main c-btn_md c-btn_icon"
          @click="() => $router.push('/topics_list/')"
        >
          {{ $t("top.more_articles") }}
          <v-icon dark right class="icon"> mdi-arrow-right-drop-circle </v-icon>
        </a>
      </div>

      <h1 class="text-left mt-5 pt-4">
        {{ $t("top.starred") }}
      </h1>

      <TopicsList :topics="favouriteList" />

      <div class="text-center py-5 text-white">
        <a
          type="submit"
          block
          x-large
          color="success"
          class="c-btn c-btn_main c-btn_md c-btn_icon"
          @click="() => $router.push('/favourite/')"
        >
          {{ $t("top.more_starred") }}
          <v-icon dark right class="icon"> mdi-arrow-right-drop-circle </v-icon>
        </a>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
const { authUser, profile, logout } = useAuth();
const topicsList = ref([]);
const favouriteList = ref([]);
const perPage = ref(5);
const active = ref(0);

const sliderImages = computed(() => {
  return topicsList.value
    .map((topic) => topic?.ext_8?.url)
    .filter((sliderImage) => sliderImage);
});

watch(
  () => authUser.value,
  async () => {
    if (!authUser.value.member_id) {
      return [];
    }

    console.log("apiDomain in index", apiDomain.baseURL);
    const { list: topics } = await $fetch(
      `${apiDomain.baseURL}/rcms-api/1/content/list?cnt=6`,
      {
        credentials: "include",
        server: false,
      }
    );

    const favouriteRes = await $fetch(
      `${apiDomain.baseURL}/rcms-api/1/favorite/list`,
      {
        credentials: "include",
        server: false,
        params: {
          member_id: parseInt(authUser.value.member_id),
          module_type: "topics",
        },
      }
    );

    const topicsIds = favouriteRes.list.map((item) => item.module_id);
    if (topicsIds.length === 0) {
      return;
    }

    const favouriteTopicsRes = await $fetch(
      `${apiDomain.baseURL}/rcms-api/1/content/list`,
      {
        credentials: "include",
        server: false,
        params: {
          cnt: perPage.value,
          ["id[]"]: topicsIds,
        },
      }
    );
    topicsList.value = topics;
    favouriteList.value = favouriteTopicsRes.list;
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
