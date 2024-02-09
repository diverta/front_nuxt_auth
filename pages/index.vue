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
      <h1>Miracle Gaurav</h1>
      <h2>{{ authUser.member_id }}</h2>
      <h2>{{ authUser.name1 }}</h2>
      <h2>{{ authUser.name2 }}</h2>
      <button
        type="button"
        @click="
          () => {
            logout();
            useRouter().push('/');
          }
        "
        class="c-button u-display-flex u-display-flex-justify-content-between u-width-100"
      >
        <span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="u-mr-5"
          >
            <path
              d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.6667 11.3333L14.0001 7.99996L10.6667 4.66663"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 8H6"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          ログアウト
        </span>
      </button>
      <ul v-if="contents.length > 0">
        <li v-for="content in contents" :key="content.id">
          {{ content.topics_id }}
        </li>
      </ul>
    </div>
  </ClientOnly>
</template>
<script setup>
const { authUser, profile, logout } = useAuth();

const config = useRuntimeConfig();
const contents = ref([]);

watch(
  () => authUser.value,
  async () => {
    if (!authUser.value.member_id) {
      return [];
    }

    const { list } = await $fetch(
      `${config.public.kurocoApiDomain}/rcms-api/1/content/list`,
      {
        credentials: 'include',
        server: false,
      }
    );
    contents.value = list;
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
