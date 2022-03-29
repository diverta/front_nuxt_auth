<template>
    <div>
        <v-row>
            <v-col class="col-sm-5 col-12 py-0">
                <v-autocomplete
                    v-model="member"
                    :items="members"
                    dense
                    filled
                    :label="$t('member.search_member')"
                />
            </v-col>
            <v-col class="col-sm-5 col-12 py-0">
                <v-autocomplete
                    v-model="department"
                    :items="departments"
                    dense
                    filled
                    :label="$t('member.department')"
                />
            </v-col>
            <v-col class="col-md-2 col-12 py-0 mb-5">
                <button class="c-btn c-btn_main c-btn_icon c-btn_md mt-2" @click="filterByMembersDepartment()">
                    {{$t('member.search')}}
                    <v-icon
                        dark
                        class="icon"
                    >
                        mdi-magnify
                    </v-icon>
                </button>
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
            <template v-slot:item.name="{ item }">
                <NuxtLink :to="localePath({ path: '/member/detail/' + item.id })" no-prefetch>
                    {{
                        item.name
                    }}
                </NuxtLink>
            </template>
            <template v-slot:item.phone="{ item }">
                <a :href="'tel:' + item.phone">{{ item.phone }}</a>
            </template>
        </v-data-table>
        <v-pagination
            v-model="page"
            :length="pageCount"
            class="c-navi_pagination mt-5 pt-5"
        />
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
        }
    },
    data() {
        return {
            items: [],
            filteredItems: [],
            members: [],
            departments: [],
            perpage: 10,
            page: 1,
            pageCount: 0,
            member: '',
            department: ''
        };
    },
    methods: {
        next(page) {
            this.updateTopics();
        },
        changeCategoryAll() {
            this.category_key = null;
            this.page = 1;
            this.updateTopics();
        },
        changeCategory(item) {
            this.category_key = item.key;
            this.page = 1;
            this.updateTopics();
        },
        filterByMembersDepartment() {
            if (this.department === undefined) {
                this.department = '';
            }
            if (this.member === undefined) {
                this.member = '';
            }
            if (this.department === '' && this.member === '') {
                this.filteredItems = this.items;
            } else if (this.department === '') {
                this.filteredItems = this.items.filter(function (obj) {
                    return obj.name.includes(this.member);
                });
            } else if (this.member === '') {
                this.filteredItems = this.items.filter(function (obj) {
                    return obj.department.includes(this.department);
                });
            } else {
                this.filteredItems = this.items.filter(function (obj) {
                    return (
                        obj.department.includes(this.department) &&
            obj.name.includes(this.member)
                    );
                });
            }
        }
    },
    async mounted() {
        let response;
        try {
            response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/members');
        } catch (e) {
            this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
            this.$store.dispatch('snackbar/snackOn');
            return;
        }

        response.data.list.forEach((item) => {
            const itm = {
                name: item.name1 + ' ' + item.name2,
                department: item.department,
                position: item.position,
                phone: item.tel,
                id: item.member_id
            };
            this.items.push(itm);
            this.filteredItems.push(itm);
            this.members.push(`${item.name1} ${item.name2}`);
            if (item.department !== '') {
                this.departments.push(item.department);
            }
        });
    }
};
</script>
