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
                    <div v-for="item in topics" :key="item.topics_id" class="row c-table_row">
                        <div class="col-sm-2 col-auto c-table_col">
                            {{ $dateFns.format(item.inst_ymdhi, 'yyyy/MM/dd') }}
                        </div>
                        <div class="col-sm-4 col c-table_col">
                            {{ item.contents_type_nm }}
                        </div>
                        <div class="col-sm col-12 c-table_col">
                            <div v-if="item.icon == 'pdf'">
                                <a :href="item.fileurl">{{ item.subject }}</a>
                                <v-icon>mdi-pdf-box</v-icon>
                            </div>
                            <div v-else-if="item.icon == 'excel'">
                                <a :href="item.fileurl">{{ item.subject }}</a>
                                <v-icon>mdi-file-excel</v-icon>
                            </div>
                            <div v-else-if="item.icon == 'word'">
                                <a :href="item.fileurl">{{ item.subject }}</a>
                                <v-icon>mdi-file-word</v-icon>
                            </div>
                            <div v-else-if="item.icon == 'url'">
                                <a :href="item.linkurl">{{ item.subject }}</a>
                                <v-icon>mdi-launch</v-icon>
                            </div>
                            <div v-else>
                                <NuxtLink :to="localePath({ path: `/topics_detail/${item.topics_id}` })" no-prefetch>
                                    {{ item.subject }}
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
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
