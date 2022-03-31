<template>
    <div
        v-if="context"
        class="input-checkbox-group"
    >
        <v-checkbox
            v-for="({ key, value }) in context.options"
            :key="`${key}_${value}`"
            v-model="checkedCategories"
            :label="value"
            :value="key"
            return-object
            checked="true"
            @change="() => context.model = checkedCategories"
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
    data () {
        return {
            checkedCategories: [],
            testVal: null
        };
    },
    mounted() {
        this.context.options.forEach((option) => {
            if (option.default) {
                this.checkedCategories.push(option.key);
                this.context.model = this.checkedCategories;
            }
        });
    }
};
</script>
