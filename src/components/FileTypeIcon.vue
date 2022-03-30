<template>
    <v-icon v-if="file_type == 'pdf'">
        mdi-pdf-box
    </v-icon>
    <v-icon v-else-if="file_type == 'excel'">
        mdi-microsoft-excel
    </v-icon>
    <v-icon v-else-if="file_type == 'word'">
        mdi-file-word
    </v-icon>
    <v-icon v-else-if="file_type == 'url'">
        mdi-launch
    </v-icon>
    <v-icon v-else-if="file_type == 'data'">
        mdi-file-document
    </v-icon>
</template>

<script>
export default {
    props: {
        fileType: {
            type: String,
            required: true
        }
    }
};
</script>
