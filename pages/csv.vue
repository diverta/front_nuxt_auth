<template>
  <ClientOnly>
    <input type="file" accept=".csv" @change="readFile" />
    <div :class="{ mask: !availability }">
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
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';
import Papa from 'papaparse';

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

const availability = ref(false);
const src = ref([]);

const onComplete = (results, file) => {
  if (results.error) {
    console.error(results.error);
    return;
  }

  const trim = (str) => str.replace(/"/g, '');

  availability.value = !!results;
  src.value = results.data.map((item) => ({
    id: trim(item.id),
    name: trim(item.name),
    class: trim(item.class),
    lectureEndDate: trim(item.lectureEndDate),
    note: trim(item.note),
  }));
};
const readFile = (event) => {
  const file = event.target.files[0];
  Papa.parse(file, {
    header: true,
    complete: onComplete,
  });
};
</script>

<style scoped>
.limit {
  max-height: 50vh;
  overflow: scroll;
}
.mask {
  filter: brightness(0.8);
  cursor: default;
}
:global(.v-data-table-footer) {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
