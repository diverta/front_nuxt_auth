<template>
  <section class="c-table">
    <div class="container">
      <div class="row c-table_title c-table_row">
        <div class="col-2 c-table_col">Date</div>
        <div class="col-4 c-table_col">Category</div>
        <div class="col c-table_col">Title</div>
      </div>
      <div v-if="topics.length > 0" class="row">
        <div class="col">
          <div
            v-for="(item, index) in topics.slice(0, 5)"
            :key="item.topics_id"
            class="row c-table_row"
          >
            <div class="col-sm-2 col-auto c-table_col">
              date
              <!-- {{ $dateFns.format(item.inst_ymdhi, 'yyyy/MM/dd') }} -->
            </div>
            <div class="col-sm-4 col c-table_col">
              {{ item.module_type }}
            </div>
            <div class="col-sm col-12 c-table_col">
              <NuxtLink
              :to="`/topics_detail/${item.module_id}`"
                no-prefetch
              >
                {{ item.module_title }}
              </NuxtLink>
            </div>
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
