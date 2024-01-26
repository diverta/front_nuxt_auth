<template>
    <div
        v-if="context"
        class="input-checkbox-group"
    >
        <v-checkbox
            v-for="({ key, value }) in context.options"
            :key="`${key}_${value}`"
            v-model="context.model"
            :label="value"
            :value="key"
            return-object
            checked="true"
        />
    </div>
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
        if (!(this.context.model instanceof Array)) {
            this.context.model = [];
        }
        this.context.options.forEach((option) => {
            if (option.default) {
                this.context.model = this.checkedCategories;
            }
        });
    }
};
</script>
