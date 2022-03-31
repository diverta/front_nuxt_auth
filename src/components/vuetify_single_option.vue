<template>
    <v-select
        v-if="context"
        v-model="context.model"
        :items="context.options"
        menu-props="auto"
        item-text="value"
        item-value="key"
    />
</template>

<script>
export default {
    props: {
        context: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.context.options.forEach((option) => {
            if (option.default) {
                this.context.model = option.key;
            }
        });
    }
};
</script>
