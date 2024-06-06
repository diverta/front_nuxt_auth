<template>
    <ClientOnly>
        <v-app class="l-content_wrap">
            <v-navigation-drawer id="c-navi_side" left fixed dark permanent>
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

            <v-footer color="#1414A0" padless>
                <v-row justify="center" no-gutters class="pt-3">
                    <a href="https://github.com/diverta/front_nuxt_auth"><small class="my-4 pt-3 l-footer_copyright">Github repository</small></a>
                    <a href="https://kuroco.app/"><img src="~/assets/images/logo-kuroco.svg" width="120" class="pl-4 l-footer_logo" /></a>
                    <v-col class="#1414A0 text-center white--text" cols="12" />
                </v-row>
            </v-footer>
        </v-app>
    </ClientOnly>
</template>

<script setup>
const items = useNavDrawerItems();
</script>
