<template>
  <div class="p-login_content elevation-7">
    <v-row>
      <v-col class="pa-0 col-sm-6 col-12">
        <div class="p-login_intro">
          <img
            src="~/assets/images/logo.png?width=150px"
            class="p-login_logo"
          />
          <div class="p-login_intro-text">
            <h1 class="heading">
              <span v-html="$t('reminder.back_to_login')" />
              <v-icon dark right large class="icon"> mdi-undo-variant </v-icon>
            </h1>
            <p v-html="$t('reminder.sign_up')" />
          </div>
        </div>
      </v-col>
      <v-col class="pa-0 col-sm-6 col-12">
        <v-card v-if="pageState == 1" class="p-login_form" outlined>
          <v-form @submit.prevent="reminder">
            <v-card-title>
              <h2 align="left" class="pb-4 c-text_blue">
                {{ $t("reminder.password_reset") }}
              </h2>
            </v-card-title>
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <p>{{ $t("reminder.send_email") }}</p>
                  <v-text-field
                    v-model="formData.email"
                    label="Email address"
                    type="email"
                    autocomplete="off"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-center white--text">
                  <button
                    type="submit"
                    :loading="loading1"
                    class="c-btn c-btn_dark"
                  >
                    {{ $t("reminder.reset") }}
                  </button>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
        <v-card v-else-if="pageState == 2">
          <v-form @submit.prevent="set_password">
            <v-card-title>
              <h2 align="center" class="pb-4 c-text_blue">
                <p>{{ $t("reminder.set_password") }}</p>
              </h2>
            </v-card-title>
            <v-container fluid class="p-login_content-inner">
              <v-row>
                <v-col cols="12 py-0">
                  <p>{{ $t("reminder.temp_password") }}</p>
                  <v-text-field
                    v-model="formData.temporaryPassword"
                    :type="text"
                    label=""
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12 py-0">
                  <p>{{ $t("reminder.new_password") }}</p>
                  <v-text-field
                    v-model="formData.password"
                    :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.password_min]"
                    :type="password_show ? 'text' : 'password'"
                    label=""
                    :hint="$t('reminder.rule')"
                    counter
                    outlined
                    @click:append="password_show = !password_show"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12 pt-0">
                  <p>{{ $t("reminder.conf_password") }}</p>
                  <v-text-field
                    v-model="formData.confirmPassword"
                    :append-icon="password_show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      rules.required,
                      rules.password_min,
                      rules.password2,
                    ]"
                    :type="password_show2 ? 'text' : 'password'"
                    label=""
                    :hint="$t('reminder.rule')"
                    counter
                    outlined
                    @click:append="password_show2 = !password_show2"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    type="submit"
                    block
                    x-large
                    color="success"
                    dark
                    :loading="loading2"
                  >
                    {{ $t("reminder.submit") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
        <v-card v-else-if="pageState == 3">
          <v-form>
            <v-container fluid>
              <v-row class="p-login_content-inner">
                <v-col cols="12" class="align-self-center">
                  <p align="center" v-html="$t('reminder.send_emailed')" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
const route = useRoute();
const token = route.query.token;
const snackbar = useSnackbar();
const pageState = ref(1);
const loading1 = ref(false);
const loading2 = ref(false);
const password_show = ref(false);
const password_show2 = ref(false);
const rules = {
  required: (v) => !!v || "Required",
  password_min: (v) =>
    v.length >= 8 || "Password must be at least 8 characters",
  password2: (v) => v === formData.password || "Password does not match",
};

const formData = reactive({
  email: "",
  temporaryPassword: "",
  password: "",
  confirmPassword: "",
});

onMounted(() => {
  if (token) {
    pageState.value = 2;
  }
});

const reminder = async () => {
  loading1.value = true;
  try {
    const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/reminder`, {
      method: "POST",
      server: false,
      body: {
        email: formData.email,
      },
    });

    pageState.value = 3;
    snackbar.add({
      type: "success",
      text: "A password reset email has been sent.",
    });
  } catch (error) {
    snackbar.add({
      type: "error",
      text: error?.response?._data?.errors?.[0]?.message || "An error occurred",
    });
  }
  loading1.value = false;
};

const set_password = async () => {
  loading2.value = true;
  try {
    const response = await $fetch(`${apiDomain.baseURL}/rcms-api/1/reminder`, {
      method: "POST",
      server: false,
      body: {
        token,
        temp_pwd: formData.temporaryPassword,
        login_pwd: formData.password,
      },
    });

    snackbar.add({
      type: "success",
      text: "Password has been reset. Please login.",
    });

    useRouter().push("/");
  } catch (error) {
    snackbar.add({
      type: "error",
      text: error?.response?._data?.errors?.[0]?.message || "An error occurred",
    });
  }
  loading2.value = false;
};
</script>
