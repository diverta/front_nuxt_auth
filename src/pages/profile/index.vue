<template>
  <div class='c-form_wrap v-stepper'>
    <div class='c-form pa-3'>
      <v-container>
        <v-row v-for="item in profile" :key="item.id">
          <v-col class='col-12'>
            <label>{{ item.name }}</label>
            <div class='field-wrap pt-2'>
              {{ item.value }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="text-center col">
      <button
        type="submit"
        class="c-btn c-btn_dark c-btn_icon"
        @click="edit()"
      >
        Edit
        <v-icon class="icon c-text_white pl-2">mdi-pencil</v-icon>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  auth: true,
  methods: {
    edit() {
      this.$router.push('/profile/edit');
    },
  },
  data() {
    return {
      placeholder: require("assets/images/avatar-placeholder.png"),
      member_id: null,
      detail: {
        name: "",
        department: "",
        position: "",
        url: "",
        location: "",
        phone: "",
        email: "",
        text: "",
      },
      profile: [
        {
          name: "First Name",
          value: "N/A",
        },
        {
          name: "Last Name",
          value: "N/A",
        },
        {
          name: "Gender",
          value: "N/A",
        },
        {
          name: "Hire Date",
          value: "N/A",
        },
        {
          name: "Department",
          value: "N/A",
        },
        {
          name: "Position",
          value: "N/A",
        },
        {
          name: "Phone",
          value: "N/A",
        },
        {
          name: "Email",
          value: "N/A",
        },
        {
          name: "Office",
          value: "N/A",
        },
        {
          name: "Hobby",
          value: "N/A",
        },
        {
          name: "Notes",
          value: "N/A",
        },
      ],
    };
  },
  mounted() {
    this.member_id = this.$auth.user.member_id;
    var url = "/rcms-api/1/members?id=" + this.member_id;
    let self = this;
    this.$auth.ctx.$axios
      .get("/rcms-api/1/members/" + this.$auth.user.member_id)
      .then(function (response) {
        //console.log('testing');
        var detail = {};
        var profile = [];
        var details_obj = response.data.details;
        detail["name"] = details_obj.name1 + " " + details_obj.name2;
        detail["zip"] = details_obj.zip_code;
        if (details_obj.address1 == null) {
          detail["location"] = "";
        } else {
          detail["location"] =
            details_obj.address1 +
            ", " +
            details_obj.address2 +
            " " +
            details_obj.address3;
        }
        detail["phone"] = details_obj.tel;
        detail["email"] = details_obj.email;
        if (details_obj.profileimage.url != undefined) {
          detail["url"] =
            "https://dev-nuxt-auth.a.kuroco-img.app/v=1614168758" +
            details_obj.profileimage.url;
        } else {
          detail["url"] =
            "/_nuxt/src/assets/images/avatar-placeholder.png";
        }
        if (details_obj.hasOwnProperty("sex")) {
          detail["sex"] = details_obj.sex.label;
        }
         if (details_obj.hasOwnProperty("birth")) {
          detail["birth"] = details_obj.birth;
        }
        if (details_obj.hasOwnProperty("role")) {
          detail["position"] = details_obj.role;
        }
        if (details_obj.hasOwnProperty("department")) {
          detail["department"] = details_obj.department;
        }
        if (details_obj.hasOwnProperty("radio_button_2")) {
          detail["radio_button_2"] = details_obj.radio_button_2.label;
        }
        if (details_obj.hasOwnProperty("pull_down")) {
          detail["pull_down"] = details_obj.pull_down.label;
        }
        if (details_obj.hasOwnProperty("notes")) {
          detail["text"] = details_obj.notes;
        }
        if (details_obj.hasOwnProperty("multiple_check")) {
        var multipleInput = "";
          for (var i = 0; i < details_obj.multiple_check.length; ++i) {
            multipleInput += details_obj.multiple_check[i].label + ", ";
            detail["multiple_check"] = multipleInput;
          }
        }
        
        self.detail = detail;
        for (var i=0; i < self.profile.length; i++) {
          if (self.profile[i].name === 'First Name' && details_obj.name1) {
            self.profile[i].value = details_obj.name1;
          } 
          else if (self.profile[i].name === 'Last Name' && details_obj.name2) {
            self.profile[i].value = details_obj.name2;
          } 
          else if (self.profile[i].name === 'Gender' && details_obj.sex.label) {
            self.profile[i].value = details_obj.sex.label;
          }
          else if (self.profile[i].name === 'Hire Date' && details_obj.hire_date) {
            self.profile[i].value = details_obj.hire_date;
          }
          else if (self.profile[i].name === 'Department' && details_obj.department) {
            self.profile[i].value = details_obj.department;
          }
          else if (self.profile[i].name === 'Position' && details_obj.role) {
            self.profile[i].value = details_obj.role;
          }
          else if (self.profile[i].name === 'Phone' && detail["phone"]) {
            self.profile[i].value = detail["phone"];
          }
          else if (self.profile[i].name === 'Email' && detail["email"]) {
            self.profile[i].value = detail["email"];
          }
          else if (self.profile[i].name === 'Office' && detail["pull_down"]) {
            self.profile[i].value = detail["pull_down"];
          }
          else if (self.profile[i].name === 'Hobby' && detail["multiple_check"]) {
            self.profile[i].value = detail["multiple_check"];
          }
          else if (self.profile[i].name === 'Notes' && detail["text"]) {
            self.profile[i].value = detail["text"];
          }
        }

      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
      });
  },
};
</script>
