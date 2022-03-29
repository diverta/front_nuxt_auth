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
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="item in profile" :key="item.name">
                                    <td width="200">
                                        {{ item.name }}
                                    </td>
                                    <td v-if="item.name == 'Phone'" width="1000">
                                        <a :href="'tel:' + item.value">{{ item.value }}</a>
                                    </td>
                                    <td v-else-if="item.name == 'Email'" width="1000">
                                        <a :href="'mailto:' + item.value">{{ item.value }}</a>
                                    </td>
                                    <td v-else width="1000" class="py-sm-3">
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
                @click="edit()"
            >
                {{$t('common.edit')}}
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
                url: '',
                location: '',
                phone: '',
                email: '',
                text: ''
            },
            profile: [
                /*
                {
                    name: 'First Name',
                    value: 'N/A'
                },
                {
                    name: 'Last Name',
                    value: 'N/A'
                },
                {
                    name: 'Gender',
                    value: 'N/A'
                },
                */
                {
                    name: 'Hire Date',
                    value: 'N/A'
                },
                /*
                {
                    name: 'Department',
                    value: 'N/A'
                },
                {
                    name: 'Position',
                    value: 'N/A'
                },
                */
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
        let response;
        try {
            response = await this.$auth.ctx.$axios.get(`/rcms-api/1/members/${this.$auth.user.member_id}`)
        } catch (e) {
            this.$store.dispatch('snackbar/setError', e?.response?.data?.errors?.[0]?.message);
            this.$store.dispatch('snackbar/snackOn');
            return;
        }

        const detailsObj = response.data.details;
        this.detail = {
            ...detailsObj,
            name: `${detailsObj.name1} ${detailsObj.name2}`,
            zip: detailsObj.zip_code,
            location: detailsObj.address1 ? `${detailsObj.address1}, ${detailsObj.address2} ${detailsObj.address3}` : '',
            phone: detailsObj.tel,
            email: detailsObj.email,
            url: detailsObj.profileimage.url ? `https://dev-nuxt-auth-mng.r-cms.jp${detailsObj.profileimage.url}` : this.placeholder,
            birth: detailsObj?.birth || '',
            position: detailsObj?.role || '',
            department: detailsObj?.department || '',
            radio_button_2: detailsObj?.radio_button_2?.label || '',
            pull_down: detailsObj?.pull_down?.label || '',
            text: detailsObj?.notes || '',
            multiple_check: detailsObj?.multiple_check?.map((label) => label).join(', '),
        };

        this.profile = this.profile.map((item) => {
            switch (item.name) {
            case 'First Name':
                return this.detail.name1 ? { ...item, value: this.detail.name1 } : item;
            case 'Last Name':
                return this.detail.name2 ? { ...item, value: this.detail.name2 } : item;
            case 'Hire Date':
                return this.detail.hire_date ? { ...item, value: this.detail.hire_date } : item;
            case 'Department':
                return this.detail.department ? { ...item, value: this.detail.department } : item;
            case 'Position':
                return this.detail.role ? { ...item, value: this.detail.role } : item;
            case 'Phone':
                return this.detail.phone ? { ...item, value: this.detail.phone } : item;
            case 'Email':
                return this.detail.email ? { ...item, value: this.detail.email } : item;
            case 'Office':
                return this.detail.pull_down ? { ...item, value: this.detail.pull_down } : item;
            case 'Hobby':
                return this.detail.multiple_check ? { ...item, value: this.detail.multiple_check } : item;
            case 'Notes':
                return this.detail.text ? { ...item, value: this.detail.text } : item;
            default:
                return item;
            }
        })
    }
};
</script>
