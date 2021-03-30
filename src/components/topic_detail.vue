<template>
  <v-container fluid v-if="pattern == 1">
    <v-card class="mx-auto" max-width="7000">
      <v-card-title class="text-h2" v-text="subtitle"></v-card-title>
      <v-card-text>
        <div class="text--primary">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container fluid v-else-if="pattern == 2">
    <v-card class="mx-auto" max-width="7000">
      <v-card-title class="text-h3" v-text="subtitle"></v-card-title>
      <v-img
        class="mx-auto"
        :aspect-ration="16 / 9"
        :src="image_url"
        width="33%"
        max-height="900"
        max-width="900"
        position="center"
      ></v-img>

      <v-card-text>
        <div class="text--primary">
          {{ text }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container fluid v-else-if="pattern == 3">
    <v-card class="mx-auto" max-width="7000">
      <v-card-text>
        <div class="text--primary">
          {{ text }}
        </div>
        <v-img
          class="mx-auto"
          :aspect-ration="16 / 9"
          :src="image_url"
          width="33%"
          max-height="900"
          max-width="900"
          position="center"
        >
        </v-img>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container fluid v-else-if="pattern == 4">
    <v-card class="mx-auto" max-width="7000">
      <v-card-title class="text-h4" v-text="subtitle"></v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-img
              fluid
              class="mr-auto"
              :aspect-ration="16 / 9"
              :src="image_url"
              width="33%"
              max-height="900"
              max-width="900"
            >
            </v-img>
          </v-col>
          <v-col>
            <div class="text--primary">
              {{ text }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container fluid v-else-if="pattern == 5">
    <v-card class="mx-auto" max-width="7000">
      <v-card-title class="text-h5" v-text="subtitle"></v-card-title>
      <v-container key="start">
        <v-row>
          <v-col>
            <div class="text--primary">
              {{ text }}
            </div>
          </v-col>
          <v-col>
            <v-img
              fluid
              class="ml-auto"
              :aspect-ration="16 / 9"
              :src="image_url"
              width="33%"
              max-height="900"
              max-width="900"
            >
            </v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>

  <v-container fluid v-else-if="pattern == 6">
    <v-card class="mx-auto" max-width="7000">
      <v-card-text>
        <v-img
          fluid
          class="mx-auto"
          :aspect-ration="16 / 9"
          :src="image_url"
          width="33%"
          max-height="900"
          max-width="900"
        >
        </v-img>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    pattern: null,
    subtitle: "",
    image_url: null,
    text_size: null,
    text: "",
  },
};
</script>
