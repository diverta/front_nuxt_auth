<template>
  <div>
    <h1>Member detail</h1>
    <br />
    <v-col>
      <v-row>
        <v-col>
          <v-img
            fluid
            class="mx-auto"
            :lazy-src="placeholder"
            :aspect-ration="16 / 9"
            :src="detail.url"
            width="33%"
            max-height="400"
            max-width="400"
          ></v-img>
        </v-col>
        <v-col class="mx-auto">
          <v-row class="headline">
            <br />
            {{ detail.name }}
          </v-row>
          <v-row>
            {{ detail.location }}
          </v-row>
          <v-row>
            <br />
            <br />
            {{ detail.department }}
          </v-row>
          <v-row>
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
    <br /><br />
    <br /><br />
    <v-btn
      type="submit"
      block
      x-large
      color="success"
      class="white--text"
      @click="back()"
    >
      Back
    </v-btn>
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
      placeholder: require("@/assets/images/avatar-placeholder.png"),
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
          name: "Zip Code",
          value: "111-1111",
        },
        {
          name: "Location",
          value: "1-1-1 Shinjuku, Tokyo Japan",
        },
        {
          name: "Phone",
          value: "03-0000-0000",
        },
        {
          name: "Email",
          value: "nuri@sample.co.jp",
        },
        {
          name: "Item",
          value: "text text text text",
        },
        {
          name: "Item",
          value: "text text text text",
        },
        {
          name: "Notes",
          value: "Here is the first message",
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
        }
        if (details_obj.hasOwnProperty("role")) {
          detail["position"] = details_obj.role;
        }
        if (details_obj.hasOwnProperty("department")) {
          detail["department"] = details_obj.department;
        }

        if (details_obj.hasOwnProperty("notes")) {
          detail["text"] = details_obj.notes;
        }
        self.detail = detail;
        self.profile[0]["value"] = detail["zip"];
        self.profile[1]["value"] = detail["location"];
        self.profile[2]["value"] = detail["phone"];
        self.profile[3]["value"] = detail["email"];
        self.profile[6]["value"] = detail["text"];
      })
      .catch(function (error) {
        self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
        self.$store.dispatch("snackbar/snackOn");
      });
  },
};
</script>
