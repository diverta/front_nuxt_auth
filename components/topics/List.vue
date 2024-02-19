<template>
  <section class="c-table">
    <div class="container">
      <div class="row c-table_title c-table_row">
        <v-row>
          <v-col><div class="c-table_col">Date</div></v-col>
          <v-col><div class="c-table_col">Category</div></v-col>
          <v-col><div class="c-table_col">Title</div></v-col>
        </v-row>
      </div>
      <div v-if="topics.length > 0">
        <div class="col">
          <div
            v-for="(item, index) in topics.slice(0, 5)"
            :key="item.topics_id"
            class="row c-table_row"
          >
            <v-row>
              <v-col
                ><div class="col-sm-2 col-auto c-table_col">Date</div></v-col
              >
              <v-col
                ><div class="col-sm-2 col-auto c-table_col">
                  {{ item.module_type }}
                </div></v-col
              >
              <v-col
                ><div class="col-sm-2 col-auto c-table_col">
                  <NuxtLink
                    :to="`/topics_detail/${item.module_id}`"
                    no-prefetch
                    >{{ item.module_title }}</NuxtLink
                  >
                </div></v-col
              >
            </v-row>
          </div>
        </div>
      </div>
      <div v-else class="row">
        <div class="text-center py-4 grey--text col">No data available</div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  topics: {
    type: Array,
    required: false,
    default: () => [],
  },
});
</script>
