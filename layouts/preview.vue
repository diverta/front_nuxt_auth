<template>
    <ClientOnly>
        <v-app class="l-content_wrap p-dashboard">
            <v-navigation-drawer id="c-navi_side" v-model="drawer" left fixed dark permanent>
                <div class="text-center py-4">
                    <a href="/">
                        <img src="~/assets/images/logo.png?width=150" class="c-navi_side-logo" />
                    </a>
                </div>
                <v-list>
                    <v-list-item v-for="(item, i) in items" :key="i" router exact class="l-mainmenu_item disabled">
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>

                        <v-list-item-title v-text="item.title" />
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main>
                <v-container class="l-content_inner" fluid>
                    <slot />
                </v-container>
            </v-main>
            <AppFooter />
        </v-app>
    </ClientOnly>
</template>

<script setup>
const drawer = ref(false);
const items = useNavDrawerItems();
</script>
