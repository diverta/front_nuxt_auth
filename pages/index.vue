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
      <h1 class="text-left mt-5 pt-4">
        {{ $t("top.latest_articles") }}
      </h1>

      <TopicsGrid :topics="topicsList" />

      <div class="text-center py-5 mt-4 white--text">
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

      <div class="text-center py-5 white--text">
                <a
                    type="submit"
                    block
                    x-large
                    color="success"
                    class="c-btn c-btn_main c-btn_md c-btn_icon"
                    @click="() => $router.push('/favourite/')"
                >
                    {{ $t('top.more_starred') }}
                    <v-icon dark right class="icon"> mdi-arrow-right-drop-circle </v-icon>
                </a>
            </div>

      <h1>Miracle Gaurav</h1>
      <h2>{{ authUser.member_id }}</h2>
      <h2>{{ authUser.name1 }}</h2>
      <h2>{{ authUser.name2 }}</h2>

      <ul v-if="topicsList.length > 0">
        <li v-for="content in topicsList" :key="content.id">
          {{ content.topics_id }}
        </li>
      </ul>
    </div>
  </ClientOnly>
</template>
<script setup>
const { authUser, profile, logout } = useAuth();

const config = useRuntimeConfig();
const topicsList = ref([]);
const favouriteList = ref([]);

watch(
  () => authUser.value,
  async () => {
    if (!authUser.value.member_id) {
      return [];
    }

    const { list: topics } = await $fetch(
      `${config.public.kurocoApiDomain}/rcms-api/1/content/list?cnt=6`,
      {
        credentials: "include",
        server: false,
      }
    );
    const { list: favourite } = await $fetch(
      `${config.public.kurocoApiDomain}/rcms-api/1/favorite/list`,
      {
        credentials: "include",
        server: false,
      }
    );
    topicsList.value = topics;
    favouriteList.value = favourite;
    console.log(favourite);
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
