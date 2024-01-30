
<template>
  <!-- <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div> -->
  <v-app class="l--content_wrap">
    <v-main>
      <AppHeader />
      <v-container class="l-content_inner" fluid>
        <!-- <v-row>
          <v-col cols="12">
            <AppHeader />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <slot />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <AppFooter />
          </v-col>
        </v-row> -->
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
