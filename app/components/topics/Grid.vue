<template>
    <section>
        <div class="container">
            <div v-if="topics.length > 0" class="row">
                <v-row v-for="(chunk, chunkIndex) in Math.ceil(topics.length / 3)" :key="chunkIndex">
                    <v-col v-for="topic in topics.slice(chunkIndex * 3, (chunkIndex + 1) * 3)" :key="topic.topics_id" class="col-md-10 col-sm-6 col-12">
                        <v-card class="c-article" :to="localePath(`/topics_detail/${topic.topics_id}`)">
                            <div class="c-article_thumb">
                                <v-img v-if="topic.ext_8" :src="topic.ext_8.url" height="200" />
                            </div>
                            <v-card-title class="pb-0 c-article_title" v-text="topic.subject" />
                            <v-card-actions class="white--text">
                                <span class="c-btn c-btn_dark c-btn_sm c-btn_disable mr-3">
                                    {{ topic.contents_type_nm }}
                                </span>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </div>
    </section>
</template>

<script setup>
const localePath = useLocalePath();
const props = defineProps({
    topics: {
        type: Array,
        required: false,
        default: () => []
    }
});
</script>
