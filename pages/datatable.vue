<template>
  <ClientOnly>
    <v-card title="修了者一覧" flat class="limit">
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table
        show-select
        :headers="headers"
        :items="src"
        :search="search"
        items-per-page="-1"
      ></v-data-table>
    </v-card>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';
import dummy from './datatable-dummy.mjs';

const search = ref('');
const headers = [
  {
    key: 'id',
    title: 'ID',
  },
  {
    align: 'start',
    key: 'name',
    sortable: false,
    title: '氏名',
  },
  { key: 'class', title: '所属' },
  { key: 'lectureEndDate', title: '研修終了日' },
  { key: 'note', title: '備考' },
];

const src = dummy.map((item) => ({
  id: item[0],
  name: item[1],
  class: item[4],
  lectureEndDate: item[5],
  note: item[6],
}));
</script>

<style scoped>
.limit {
  max-height: 50vh;
  overflow: scroll;
}
:global(.v-data-table-footer) {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
