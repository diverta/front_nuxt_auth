<template>
    <div v-if="done">
        <template v-if="isDisallowed">
            <v-card>
                <v-card-text class="text-center">
                    {{ $t('member.disallowed') }}
                </v-card-text>
            </v-card>
        </template>
        <template v-else>
            <v-row>
                <v-col class="col-sm-6 col-12 py-0">
                    <v-autocomplete
                        v-model="name"
                        :items="names"
                        dense
                        filled
                        :label="$t('member.search_member')"
                    />
                </v-col>
                <v-col class="col-sm-6 col-12 py-0">
                    <v-autocomplete
                        v-model="department"
                        :items="departments"
                        dense
                        filled
                        :label="$t('member.department')"
                    />
                </v-col>
            </v-row>
            <v-data-table
                :headers="headers"
                :items="filteredItems"
                :items-per-page="perpage"
                :page.sync="page"
                hide-default-footer
                class="elevation-1 mt-5 c-table"
                @page-count="pageCount = $event"
            >
                <template #item.name="{ item }">
                    <NuxtLink :to="localePath({ path: `/member/detail/${item.id}` })" no-prefetch>
                        {{
                            item.name
                        }}
                    </NuxtLink>
                </template>
                <template #item.phone="{ item }">
                    <a :href="`tel:${item.phone}`">{{ item.phone }}</a>
                </template>
            </v-data-table>
            <v-pagination
                v-model="page"
                :length="pageCount"
                class="c-navi_pagination mt-5 pt-5"
            />
        </template>
    </div>
</template>
<script>
export default {
    auth: true,
    computed: {
        headers() {
            return [
                { text: 'Name', value: 'name', sortable: false },
                { text: 'Deparment', value: 'department', sortable: false },
                { text: 'Position', value: 'position', sortable: false },
                { text: 'Phone', value: 'phone', sortable: false }
            ];
        },
        names() { return ['', ...this.items.map(({ name }) => name)]; },
        departments() { return ['', ...this.items.map(({ department }) => department).filter((d) => d)]; },
        filteredItems() {
            return this.items
                .filter(({ department }) => this.department === '' ? true : department === this.department)
                .filter(({ name }) => this.name === '' ? true : name === this.name);
        }
    },
    data() {
        return {
            done: false,
            isDisallowed: false,

            items: [],
            perpage: 10,
            page: 1,
            pageCount: 0,
            name: '',
            department: ''
        };
    },
    async mounted() {
        try {
            const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/member/list');
            this.items = response.data.list.map((item) => ({
                name: `${item.name1} ${item.name2}`,
                department: item.department,
                position: item.position,
                phone: item.tel,
                id: item.member_id
            }));
        } catch (e) {
            if (e?.response?.status) {
                this.isDisallowed = true;
            }
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        }
        this.done = true;
    }
};
</script>
