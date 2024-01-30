<template>
    <div class="l-content_maxWidth-sm mb-5 pb-5">
        <!-- <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        /> -->
        <div class="v-stepper c-form_wrap white">
            <v-container fluid>
                <div class="l-content_heading">
                    <h1>{{ $t('signup.title') }}</h1>
                    <h4 class="slogan">
                        {{ $t('signup.text') }}
                    </h4>
                </div>
            </v-container>
        </div>
    </div>
</template>
<script setup></script>