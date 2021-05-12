<template>
    <section class="c-table">
        <div class="container">
            <div class="row c-table_title c-table_row">
                <div class="col-2 c-table_col">
                    Date
                </div>
                <div class="col-4 c-table_col">
                    Category
                </div>
                <div class="col c-table_col">
                    Title
                </div>
            </div>
            <div v-if="topics.length > 0" class="row">
                <div class="col">
                    <div v-for="item in topics" :key="item.id" class="row c-table_row">
                        <div class="col-sm-2 col-auto c-table_col">
                            {{ item.date }}
                        </div>
                        <div class="col-sm-4 col c-table_col">
                            {{ item.label }}
                        </div>
                        <div class="col-sm col-12 c-table_col">
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
                                <NuxtLink :to="{ path: '/topics_detail/' + item.id }" no-prefetch>
                                    {{
                                        item.link
                                    }}
                                </NuxtLink>
                            </div>
                        </div>
                        <v-col v-if="item.edit == true" class="py-2">
                            <v-btn
                                class="mx-3 c-icon_main c-icon_sm"
                                fab
                                dark
                                small
                                @click="edit_topic(item.id)"
                            >
                                <v-icon dark>
                                    mdi-pencil
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </div>
                </div>
            </div>
            <div v-else class="row">
                <div class="text-center py-4 grey--text col">
                    No data available
                </div>
            </div>
        </div>
        </div>
    </section>
</template>

<script>
export default {
    methods: {
        edit_topic(topicId) {
            this.$router.push('/profile/topic_edit/' + topicId);
        }
    },
    props: {
        topics: {
            type: Array,
            required: false,
            default: () => []
        }
    }
};
</script>
