<template>
  <ClientOnly>
    <div class="l-content_maxWidth-sm mb-5 pb-5">
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="orange white-4"
      />
      <div class="v-stepper c-form_wrap bg-white">
        <v-container fluid>
          <div class="l-content_heading">
            <h1>{{ $t('signup.title') }}</h1>
            <h4 class="slogan">
              {{ $t('signup.text') }}
            </h4>
          </div>

          <ProfileForm
            @submit="handleSubmit"
          />

        </v-container>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
import { FormKitSchema } from '@formkit/vue';
const snackbar = useSnackbar();
const { register } = useAuth();
const loading = ref(false);
const sitekey = ref(apiDomain.sitekey);

const handleSubmit = async (formValue) => {
  loading.value = true;

  apiDomain.sitekey = sitekey.value;
  apiDomain.baseURL =
    apiDomain.sitekey === 'dev-nuxt-auth'
      ? 'https://dev-nuxt-auth.a.kuroco.app'
      : `https://${apiDomain.sitekey}.g.kuroco.app`;

  try {
    await register({
      ...formValue,
      // remove unnecessary fields
      sitekey: undefined,
      term: undefined,
    });
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error?.response?._data?.errors?.[0]?.message || 'An error occurred',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss">
@import 'assets/partials/_mixin';

.signup-form {
  &_container {
    display: grid;
    gap: 0 10px;
    grid-template-columns: 1fr;
    @media screen and (min-width: 769px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  &_elm {
    &-terms_wrapper,
    &-submit {
      display: flex;
      justify-content: center;
    }
  }

  @media screen and (min-width: 769px) {
    &_elm {
      &-sitekey {
        grid-row: 1;
        grid-column: 1 / 3;
      }
      &-name1 {
        grid-row: 2;
        grid-column: 1;
      }
      &-name2 {
        grid-row: 2;
        grid-column: 2;
      }
      &-hire_date {
        grid-row: 3;
        grid-column: 1;
      }
      &-department {
        grid-row: 4;
        grid-column: 1;
      }
      &-position {
        grid-row: 5;
        grid-column: 1;
      }
      &-tel {
        grid-row: 6;
        grid-column: 1;
      }
      &-email {
        grid-row: 7;
        grid-column: 1;
      }
      &-login_pwd {
        grid-row: 8;
        grid-column: 1;
      }
      &-office {
        grid-row: 9;
        grid-column: 1;
      }
      &-hobby {
        grid-row: 3 / 6;
        grid-column: 2;
      }
      &-notes {
        grid-row: 6 / 10;
        grid-column: 2;
      }
    }
  }
}
</style>import type { ProfileForm } from '#build/components';

