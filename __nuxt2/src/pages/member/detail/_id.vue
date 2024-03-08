<template>
    <div>
        <div class="l-content_heading">
            <h1>{{ $t('member.detail_title') }}</h1>
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
                        <template #default>
                            <tbody>
                                <tr v-for="([keyName, value]) in Object.entries(detail.profile)" :key="keyName">
                                    <td width="200">
                                        {{ keyName }}
                                    </td>
                                    <td v-if="keyName == 'Phone'" width="1000">
                                        <a :href="`tel:${value}`">{{ value }}</a>
                                    </td>
                                    <td v-else-if="keyName == 'Email'" width="1000">
                                        <a :href="`mailto:${value}`">{{ value }}</a>
                                    </td>
                                    <td v-else width="1000" class="py-3">
                                        {{ value }}
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-col>
        <div class="text-center col white--text">
            <button
                type="submit"
                class="c-btn c-btn_dark c-btn_icon"
                @click="() => $router.go(-1)"
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
    data() {
        return {
            placeholder: require('assets/images/avatar-placeholder.png'),
            member_id: null,
            detail: {
                name: '',
                department: '',
                position: '',
                url: '',
                location: '',
                phone: '',
                email: '',
                text: '',
                profile: {}
            }
        };
    },
    async mounted() {
        this.member_id = this.$route.params.id;

        try {
            const response = await this.$store.$auth.ctx.$axios.get('/rcms-api/1/member/list', {
                params: {
                    id: this.member_id
                }
            });

            const detailsObj = response.data.list[0];
            this.detail = {
                name: `${detailsObj.name1} ${detailsObj.name2}`,
                zip: detailsObj.zip_code,
                location: detailsObj.address1 ? `${detailsObj.address1}, ${detailsObj.address2} ${detailsObj.address3}` : '',
                phone: detailsObj.tel,
                email: detailsObj.email,
                url: detailsObj.profileimage.url ? `${detailsObj.profileimage.url}` : this.placeholder,
                sex: detailsObj?.sex?.label || '',
                birth: detailsObj?.birth || '',
                position: detailsObj?.position || '',
                department: detailsObj?.department || '',
                radio_button_2: detailsObj?.radio_button_2?.label,
                multiple_check: detailsObj?.multiple_check?.map(({ label }) => label)?.join(', ') || '',
                profile: {
                    'Hire Date': detailsObj?.hire_date || 'N/A',
                    Phone: detailsObj.tel || 'N/A',
                    Email: detailsObj.email || 'N/A',
                    Office: detailsObj?.pull_down?.label || 'N/A',
                    Hobby: detailsObj?.multiple_check?.map(({ label }) => label)?.join(', ') || 'N/A',
                    Notes: detailsObj?.notes || 'N/A'
                }
            };
        } catch (e) {
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        }
    }
};
</script>
