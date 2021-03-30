<template>
  <div>
    <v-row v-for="item in topics" v-bind:key="item.id">
      <br />
      <v-col>
        {{ item.date }}
      </v-col>
      <v-col>
        {{ item.label }}
      </v-col>
      <v-col>
        <div v-if="item.icon == 'pdf'">
          <a :href="item.fileurl">{{ item.link }}</a>
          <v-icon>mdi-pdf-box</v-icon>
        </div>
        <div v-else-if="item.icon == 'excel'">
          <a :href="item.fileurl">{{ item.link }}</a>
          <v-icon>mdi-file-excel</v-icon>
        </div>
        <div v-else-if="item.icon == 'word'">
          <a :href="item.fileurl">{{ item.link }}</a>
          <v-icon>mdi-file-word</v-icon>
        </div>
        <div v-else-if="item.icon == 'url'">
          <a :href="item.linkurl">{{ item.link }}</a>
          <v-icon>mdi-launch</v-icon>
        </div>
        <div v-else>
          <NuxtLink :to="{ path: '/topics_detail/' + item.id }" no-prefetch>{{
            item.link
          }}</NuxtLink>
        </div>
      </v-col>
      <v-col v-if="item.edit == true">
        <v-btn
          class="mx-3"
          fab
          dark
          small
          color="cyan"
          @click="edit_topic(item.id)"
        >
          <v-icon dark> mdi-pencil </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  methods: {
    edit_topic(topic_id) {
      this.$router.push("/mypage/topic_edit/" + topic_id);
    },
  },
  props: {
    topics: null,
  },
};
</script>
