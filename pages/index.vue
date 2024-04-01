<template>
  <ClientOnly>
    <v-list lines="one">
      <v-list-item
        v-for="member in displayMembers"
        :key="member"
        :title="member"
      ></v-list-item>
    </v-list>

    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          color="surface-variant"
          text="Open Dialog"
          variant="flat"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="Dialog">
          <v-form>
            <v-autocomplete
              :custom-filter="customFilter"
              :items="members"
              v-model="memberModel"
              base-color="white"
              item-title="summary"
              item-value="summary"
              label="検索/選択"
              chips
              closable-chips
              multiple
            ></v-autocomplete>
          </v-form>

          <v-spacer></v-spacer>

          <v-card-actions>
            <v-btn text="キャンセル" @click="isActive.value = false"></v-btn>
            <v-btn text="適用" @click="() => save(isActive)"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';

const members = [
  { id: 1, name: '鈴木　一郎' },
  { id: 2, name: '田中　二郎' },
  { id: 3, name: '齋藤　花子' },
];
members.forEach((member) => {
  member.summary = `ID: ${member.id} - 氏名: ${member.name}`;
});

const memberModel = ref([]);
const displayMembers = ref([]);

function customFilter(itemTitle, queryText, item) {
  const textOne = item.raw.id.toString();
  const textTwo = item.raw.name.toLowerCase();
  const searchText = queryText.toLowerCase();
  return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1;
}
function save(activatorRef) {
  displayMembers.value = [...memberModel.value];
  activatorRef.value = false;
}
</script>

<style scoped>
:global(.v-autocomplete__selection) {
  display: block;
  width: 100%;
}
</style>
