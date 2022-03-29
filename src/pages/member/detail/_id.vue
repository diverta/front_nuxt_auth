<template>
    <div>
        <div class="l-content_heading">
            <h1>{{$t('member.detail_title')}}</h1>
        </div>
        <v-col>
            <v-row>
                <v-col cols="sm-auto col-12">
                    <v-img
                        fluid
                        class="mx-auto mr-md-5"
                        :lazy-src="detail.url"
                        :aspect-ration="16 / 9"
                        :src="detail.url"
                        max-height="180"
                        max-width="180"
                    />
                </v-col>
                <v-col class="mx-auto">
                    <v-container fluid>
                        <v-row class="headline mb-3">
                            <br>
                            {{ detail.name }}
                        </v-row>
                        <v-row v-if="detail.sex" class="mb-3">
                            <v-icon class="icon c-text_blue pr-2">
                                mdi-gender-male-female
                            </v-icon>{{ detail.sex }}
                        </v-row>
                        <v-row v-if="detail.birth" class="mb-3">
                            <v-icon class="icon c-text_blue pr-2">
                                mdi-card-account-details
                            </v-icon>{{ detail.birth }}
                        </v-row>
                        <v-row v-if="detail.department" class="mb-3">
                            <v-icon class="icon c-text_blue pr-2">
                                mdi-office-building
                            </v-icon>
                            {{ detail.department }}
                        </v-row>
                        <v-row v-if="detail.position">
                            <v-icon class="icon c-text_blue pr-2">
                                mdi-briefcase-account
                            </v-icon>
                            {{ detail.position }}
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
            <br>
            <br>
            <v-row>
                <v-col>
                    <v-simple-table class="elevation-1">
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="item in profile" :key="item.id">
                                    <td width="200">
                                        {{ item.name }}
                                    </td>
                                    <td v-if="item.name == 'Phone'" width="1000">
                                        <a :href="'tel:' + item.value">{{ item.value }}</a>
                                    </td>
                                    <td v-else-if="item.name == 'Email'" width="1000">
                                        <a :href="'mailto:' + item.value">{{ item.value }}</a>
                                    </td>
                                    <td v-else width="1000" class="py-3">
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
                @click="() => back()"
            >
                {{ $t('common.back') }}
                <v-icon class="icon c-text_white pr-2">
                    mdi-undo-variant
                </v-icon>
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
        }
    },
    data() {
        return {
            placeholder: require('assets/images/avatar-placeholder.png'),
            member_id: null,
            detail: {
                name: '',
                department: '',
                position: '',
                url: '',
                // zip: "",
                location: '',
                phone: '',
                email: '',
                text: ''
            },
            profile: [
                {
                    name: 'Hire Date',
                    value: 'N/A'
                },
                {
                    name: 'Phone',
                    value: 'N/A'
                },
                {
                    name: 'Email',
                    value: 'N/A'
                },
                {
                    name: 'Office',
                    value: 'N/A'
                },
                {
                    name: 'Hobby',
                    value: 'N/A'
                },
                {
                    name: 'Notes',
                    value: 'N/A'
                }
            ]
        };
    },
    async mounted() {
        this.member_id = this.$route.params.id;

        try {
            const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/members', {
                params: {
                    id: this.member_id
                }
            });

            const detail = {};
            const detailsObj = response.data.list[0];
            detail.name = `${detailsObj.name1} ${detailsObj.name2}`;
            detail.zip = detailsObj.zip_code;
            detail.location = detailsObj.address1 ? `${detailsObj.address1}, ${detailsObj.address2} ${detailsObj.address3}` : '';
            detail.phone = detailsObj.tel;
            detail.email = detailsObj.email;
            detail.url = detailsObj.profileimage.url ? `https://dev-nuxt-auth-mng.r-cms.jp${detailsObj.profileimage.url}` : this.placeholder;
            if (detailsObj.sex) {
                detail.sex = detailsObj.sex.label;
            }
            if (detailsObj.birth) {
                detail.birth = detailsObj.birth;
            }
            if (detailsObj.position) {
                detail.position = detailsObj.position;
            }
            if (detailsObj.department) {
                detail.department = detailsObj.department;
            }
            if (detailsObj.radio_button_2) {
                detail.radio_button_2 = detailsObj.radio_button_2.label;
            }
            if (detailsObj.multiple_check) {
                let multipleInput = '';
                for (let i = 0; i < detailsObj.multiple_check.length; ++i) {
                    multipleInput += detailsObj.multiple_check[i].label + ', ';
                    detail.multiple_check = multipleInput;
                }
            }

            this.detail = detail;
            for (let i = 0; i < this.profile.length; i++) {
                if (this.profile[i].name === 'Hire Date' && detailsObj.hire_date) {
                    this.profile[i].value = detailsObj.hire_date;
                } else if (this.profile[i].name === 'Phone' && detail.phone) {
                    this.profile[i].value = detail.phone;
                } else if (this.profile[i].name === 'Email' && detail.email) {
                    this.profile[i].value = detail.email;
                } else if (this.profile[i].name === 'Office' && detailsObj.pull_down.label) {
                    this.profile[i].value = detailsObj.pull_down.label;
                } else if (this.profile[i].name === 'Hobby' && detail.multiple_check) {
                    this.profile[i].value = detail.multiple_check;
                } else if (this.profile[i].name === 'Notes' && detailsObj.notes) {
                    this.profile[i].value = detailsObj.notes;
                }
            }
        } catch (e) {
            this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
            this.$store.dispatch('snackbar/snackOn');
        }
    }
};
</script>
