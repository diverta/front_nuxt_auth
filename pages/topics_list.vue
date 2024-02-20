<template>
  <section>
    <div>
      <v-btn-toggle v-model="text" class="c-navi_filter" group>
        <v-btn value="0" @click="changeCategoryAll"> ALL </v-btn>
        <v-btn
          v-for="item in categories"
          :key="item.key"
          :value="item.key"
          @click="() => changeCategory(item)"
        >
          {{ item.value }}
        </v-btn>
      </v-btn-toggle>
    </div>
    <div class="mt-4">
      <TopicsGrid :topics="topics" />
    </div>
    <div class="text-center mt-5 pt-5">
      <v-pagination
        v-if="Math.ceil(totalCnt / perPage) > 1"
        v-model="page"
        :length="Math.ceil(totalCnt / perPage)"
        class="c-navi_pagination"
        @input="updateTopics"
      />
    </div>
  </section>
</template>
<script setup>
const { authUser } = useAuth();
const config = useRuntimeConfig();
const topics = ref([]);
const page = ref(1);
const perPage = ref(20);
const totalCnt = ref(0);
const categories = ref([]);
const category_key = ref(null);

const changeCategoryAll = () => {
  category_key.value = null;
  page.value = 1;
  updateTopics();
};

const changeCategory = (item) => {
  category_key.value = item.key;
  page.value = 1;
  updateTopics();
};

const updateTopics = async () => {
  try {
    const response = await $fetch(
      `${config.public.kurocoApiDomain}/rcms-api/1/content/list`,
      {
        credentials: "include",
        server: false,
        params: {
          pageID: page.value,
          cnt: perPage.value,
          contents_type:
            category_key.value !== null ? category_key.value : undefined,
        },
      }
    );

    totalCnt.value = response.pageInfo.totalCnt;
    topics.value = response.list;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  category_key.value = null;
  try {
    const response = await $fetch(
      `${config.public.kurocoApiDomain}/rcms-api/1/content/category`,
        {
            credentials: "include",
            server: false,
        }
    );
    categories.value = response.list.map((item) => ({
      key: item.topics_category_id,
      value: item.category_nm,
    }));
  } catch (error) {
    console.error(error);
  }
  updateTopics();
});
</script>
