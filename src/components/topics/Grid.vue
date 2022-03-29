<template>
    <section>
        <div class="container">
            <div v-if="topics.length > 0" class="row">
                <v-col v-for="item in topics" :key="item.id" class="col-md-4 col-sm-6 col-12">
                    <v-card class="c-article" :to="localePath({ path: '/topics_detail/' + item.id })">
                        <div class="c-article_thumb">
                            <v-img
                                v-if="item.thumbnail"
                                :src="item.thumbnail"
                                height="200"
                            />
                        </div>
                        <v-card-title
                            class="pb-0 c-article_title"
                            v-text="item.link"
                        />
                        <v-card-actions>
                            <span class="c-btn c-btn_dark c-btn_sm c-btn_disable mr-3">
                                {{ item.label }}
                            </span>
                            {{ item.date }}
                        </v-card-actions>
                    </v-card>
                </v-col>
            </div>
            <div v-else class="row">
                <div class="text-center py-4 grey--text col">
                    No data available
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        topics: {
            type: Array,
            required: false,
            default: () => []
        }
    }
};
</script>
