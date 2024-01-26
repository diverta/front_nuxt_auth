<template>
    <section>
        <div class="container">
            <div v-if="topics.length > 0" class="row">
                <v-col
                    v-for="topic in topics"
                    :key="topic.topics_id"
                    class="col-md-4 col-sm-6 col-12"
                >
                    <v-card
                        class="c-article"
                        :to="localePath({ path: `/topics_detail/${topic.topics_id}` })"
                    >
                        <div class="c-article_thumb">
                            <v-img v-if="topic.ext_8" :src="topic.ext_8.url" height="200" />
                        </div>
                        <v-card-title class="pb-0 c-article_title" v-text="topic.subject" />
                        <v-card-actions class="white--text">
                            <span class="c-btn c-btn_dark c-btn_sm c-btn_disable mr-3">
                                {{ topic.contents_type_nm }}
                            </span>
                            {{ $dateFns.format(topic.ymd, 'yyyy/MM/dd') }}
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
