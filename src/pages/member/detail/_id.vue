<template>
  <div>
    <div class="l-content_heading">
      <h1>Member details</h1>
    </div>
    <v-col>
      <v-row>
        <v-col cols="auto">
          <v-img
            fluid
            class="mx-auto mr-5"
            :lazy-src="detail.url"
            :aspect-ration="16 / 9"
            :src="detail.url"
            max-height="180"
            max-width="180"
          ></v-img>
        </v-col>
        <v-col class="mx-auto">
          <v-row class="headline mb-3">
            <br />
            {{ detail.name }}
          </v-row>
          <v-row v-if="detail.sex" class="mb-3">
            <v-icon class="icon c-text_blue pr-2">mdi-gender-male-female</v-icon>{{ detail.sex }}
          </v-row>
          <v-row v-if="detail.birth" class="mb-3">
            <v-icon class="icon c-text_blue pr-2">mdi-card-account-details</v-icon>{{ detail.birth }}
          </v-row>
          <v-row v-if="detail.department" class="mb-3">
            <v-icon class="icon c-text_blue pr-2">mdi-office-building</v-icon>
            {{ detail.department }}
          </v-row>
          <v-row v-if="detail.position">
            <v-icon class="icon c-text_blue pr-2">mdi-briefcase-account</v-icon>
            {{ detail.position }}
          </v-row>
        </v-col>
      </v-row>
      <br />
      <br />
      <v-row>
        <v-col>
          <v-simple-table class="elevation-1">
            <template v-slot:default>
              <tbody>
                <tr v-for="item in profile" :key="item.id">
                  <td width="200">{{ item.name }}</td>
                  <td v-if="item.name == 'Phone'" width="1000">
                    <a :href="'tel:' + item.value">{{ item.value }}</a>
                  </td>
                  <td v-else-if="item.name == 'Email'" width="1000">
                    <a :href="'mailto:' + item.value">{{ item.value }}</a>
                  </td>
                  <td v-else width="1000">
                    {{ item.value }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-col>
    <div class="text-center col">
      <button
        type="submit"
        class="c-btn c-btn_dark c-btn_icon"
        @click="back()"
      >
        Back
        <v-icon class="icon c-text_white pr-2">mdi-undo-variant</v-icon>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  auth: true,
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
  data() {
    return {
      //placeholder: require("assets/images/avatar-placeholder.png"),
      member_id: null,
      detail: {
        name: "",
        department: "",
        position: "",
        url: "",
        zip: "",
        location: "",
        phone: "",
        email: "",
        text: "",
      },
      profile: [
        {
          name: "Address",
          value: "N/A",
        },
        {
          name: "Zip Code",
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
          name: "Pull-down",
          value: "N/A",
        },
        {
          name: "Radio button",
          value: "N/A",
        },
        {
          name: "Multiple",
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
    this.member_id = this.$route.params.id;
    var url = "/rcms-api/1/members?id=" + this.member_id;
    let self = this;
    this.$store.$auth.ctx.$axios
      .get(url)
      .then(function (response) {
        var detail = {};
        var profile = [];
        var details_obj = response.data.list[0];
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
        if (details_obj.hasOwnProperty("multiple_check")) {
          detail["multiple_check"] = details_obj.multiple_check;
        }
        if (details_obj.hasOwnProperty("pull_down")) {
          detail["pull_down"] = details_obj.pull_down.label;
        }
        if (details_obj.hasOwnProperty("notes")) {
          detail["text"] = details_obj.notes;
        }
        self.detail = detail;
        self.profile[0]["value"] = detail["location"];
        self.profile[1]["value"] = detail["zip"];
        self.profile[2]["value"] = detail["phone"];
        self.profile[3]["value"] = detail["email"];
        self.profile[4]["value"] = detail["pull_down"];
        self.profile[5]["value"] = detail["radio_button_2"];
        self.profile[6]["value"] = detail["multiple_check"];
        self.profile[7]["value"] = detail["text"];
      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
      });
  },
};
</script>
