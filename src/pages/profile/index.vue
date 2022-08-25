<template>
    <section>
        <v-col>
            <v-row>
                <v-col cols="sm-auto col-12">
                    <v-img
                        fluid
                        class="mx-auto mr-sm-5"
                        :lazy-src="detail.url"
                        :aspect-ration="16 / 9"
                        :src="detail.profileImageUrl"
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
            <v-row>
                <v-col>
                    <v-simple-table class="elevation-1 mt-5 c-table_responsive">
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
                                    <td v-else width="1000" class="py-sm-3">
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
                @click="edit()"
            >
                {{ $t('common.edit') }}
                <v-icon class="icon c-text_white pl-2">
                    mdi-pencil
                </v-icon>
            </button>
        </div>
    </section>
</template>

<script>
export default {
    auth: true,
    methods: {
        edit() {
            this.$router.push(this.localePath('/profile/edit'));
        }
    },
    data() {
        return {
            placeholder: require('assets/images/avatar-placeholder.png'),
            detail: {
                name: '',
                department: '',
                position: '',
                profileImageUrl: '',
                profile: {}
            }
        };
    },
    async mounted() {
        try {
            const response = await this.$auth.ctx.$axios.get('/rcms-api/1/member/me');
            const detailsObj = response.data.details;
            this.detail = {
                name: `${detailsObj.name1} ${detailsObj.name2}`,
                profileImageUrl: detailsObj.profileimage.url
                    ? `${detailsObj.profileimage.url}`
                    : this.placeholder,
                position: detailsObj?.role || '',
                department: detailsObj?.department || '',
                profile: {
                    'First Name': detailsObj.name1 || 'N/A',
                    'Last Name': detailsObj.name2 || 'N/A',
                    'Hire Date': detailsObj?.hire_date || 'N/A',
                    Department: detailsObj.department || 'N/A',
                    Position: detailsObj.role || 'N/A',
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
