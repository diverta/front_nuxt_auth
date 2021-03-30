<template>
  <div>
    <h1>Member list</h1>
    <br />
    <v-row>
      <v-col cols="6">
        <v-autocomplete
          v-model="member"
          :items="members"
          dense
          filled
          label="Search member"
        ></v-autocomplete>
      </v-col>
      <v-col cols="5">
        <v-autocomplete
          v-model="department"
          :items="departments"
          dense
          filled
          label="Deparment"
        ></v-autocomplete>
      </v-col>
      <v-col>
        <v-btn @click="filterByMembersDepartment()"> search </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :items-per-page="perpage"
      class="elevation-1"
    >
      <template v-slot:item.name="{ item }">
        <NuxtLink :to="{ path: '/member/detail/' + item.id }" no-prefetch>{{
          item.name
        }}</NuxtLink>
      </template>
      <template v-slot:item.phone="{ item }">
        <a :href="'tel:' + item.phone">{{ item.phone }}</a>
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  auth: true,
  computed: {
    headers() {
      return [
        { text: "Name", value: "name", sortable: false },
        { text: "Deparment", value: "department", sortable: false },
        { text: "Position", value: "position", sortable: false },
        { text: "Phone", value: "phone", sortable: false },
      ];
    },
  },
  data() {
    return {
      items: [],
      filteredItems: [],
      members: [],
      departments: [],
      perpage: 10,
      member: "",
      department: "",
    };
  },
  methods: {
    filterByMembersDepartment() {
      if (this.department == undefined) {
        this.department = "";
      }
      if (this.member == undefined) {
        this.member = "";
      }
      if (this.department == "" && this.member == "") {
        this.filteredItems = this.items;
      } else if (this.department == "") {
        let self = this;
        this.filteredItems = this.items.filter(function (obj) {
          return obj.name.includes(self.member);
        });
      } else if (this.member == "") {
        let self = this;
        this.filteredItems = this.items.filter(function (obj) {
          return obj.department.includes(self.department);
        });
      } else {
        let self = this;
        this.filteredItems = this.items.filter(function (obj) {
          return (
            obj.department.includes(self.department) &&
            obj.name.includes(self.member)
          );
        });
      }
    },
  },
  mounted() {
    var url = "/rcms-api/1/members";
    let self = this;
    this.$store.$auth.ctx.$axios
      .get(url)
      .then(function (response) {
        var items = [];
        var members = [];
        var departments = [];
        for (var key in response.data.list) {
          var item = response.data.list[key];
          var department = "";
          var role = "";
          if (item.hasOwnProperty("department")) {
            department = item.department;
          }
          if (item.hasOwnProperty("role")) {
            role = item.role;
          }
          items.push({
            name: item["name1"] + " " + item["name2"],
            department: department,
            position: role,
            phone: item["tel"],
            id: item["member_id"],
          });
          members.push(item["name1"] + " " + item["name2"]);
          if (department != "") {
            departments.push(department);
          }
        }
        self.filteredItems = items;
        self.items = items;
        self.members = members;
        self.departments = departments;
      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
      });
  },
};
</script>
