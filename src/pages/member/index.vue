<template>
    <div>
        <!--
    <div class="l-content_heading">
      <h1>Members list</h1>
    </div>
    -->
        <v-row>
            <v-col class="col-sm-5 col-12 py-0">
                <v-autocomplete
                    v-model="member"
                    :items="members"
                    dense
                    filled
                    label="Search member"
                />
            </v-col>
            <v-col class="col-sm-5 col-12 py-0">
                <v-autocomplete
                    v-model="department"
                    :items="departments"
                    dense
                    filled
                    label="Deparment"
                />
            </v-col>
            <v-col class="col-md-2 col-12 py-0 mb-5">
                <button class="c-btn c-btn_main c-btn_icon c-btn_md mt-2" @click="filterByMembersDepartment()">
                    Search
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
                <NuxtLink :to="{ path: '/member/detail/' + item.id }" no-prefetch>
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
            // totalCnt: 50,
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
                const self = this;
                this.filteredItems = this.items.filter(function (obj) {
                    return obj.name.includes(self.member);
                });
            } else if (this.member === '') {
                const self = this;
                this.filteredItems = this.items.filter(function (obj) {
                    return obj.department.includes(self.department);
                });
            } else {
                const self = this;
                this.filteredItems = this.items.filter(function (obj) {
                    return (
                        obj.department.includes(self.department) &&
            obj.name.includes(self.member)
                    );
                });
            }
        }
    },
    mounted() {
        const url = '/rcms-api/1/members';
        const self = this;
        this.$store.$auth.ctx.$axios
            .get(url)
            .then(function (response) {
                const items = [];
                const members = [];
                const departments = [];
                for (const key in response.data.list) {
                    const item = response.data.list[key];
                    let department = '';
                    let position = '';
                    if (item.hasOwnProperty('department')) {
                        department = item.department;
                    }
                    if (item.hasOwnProperty('position')) {
                        position = item.position;
                    }
                    items.push({
                        name: item.name1 + ' ' + item.name2,
                        department,
                        position,
                        phone: item.tel,
                        id: item.member_id
                    });
                    members.push(item.name1 + ' ' + item.name2);
                    if (department !== '') {
                        departments.push(department);
                    }
                }
                self.filteredItems = items;
                self.items = items;
                self.members = members;
                self.departments = departments;
            })
            .catch(function (error) {
                self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                self.$store.dispatch('snackbar/snackOn');
            });
    }
};
</script>
