<template>
    <div class="c-form_wrap v-stepper">
        <div class="c-form pa-3">
            <v-container>
                <v-row v-for="item in profile" :key="item.id">
                    <v-col class="col-12">
                        <label>{{ item.name }}</label>
                        <div class="field-wrap pt-2">
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
                <v-icon class="icon c-text_white pl-2">
                    mdi-pencil
                </v-icon>
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
                location: '',
                phone: '',
                email: '',
                text: ''
            },
            profile: [
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
                {
                    name: 'Hire Date',
                    value: 'N/A'
                },
                {
                    name: 'Department',
                    value: 'N/A'
                },
                {
                    name: 'Position',
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
    mounted() {
        this.member_id = this.$auth.user.member_id;
        const self = this;
        this.$auth.ctx.$axios
            .get('/rcms-api/1/members/' + this.$auth.user.member_id)
            .then(function (response) {
                // console.log('testing');
                const detail = {};
                const detailsObj = response.data.details;
                detail.name = detailsObj.name1 + ' ' + detailsObj.name2;
                detail.zip = detailsObj.zip_code;
                if (detailsObj.address1 == null) {
                    detail.location = '';
                } else {
                    detail.location =
            detailsObj.address1 +
            ', ' +
            detailsObj.address2 +
            ' ' +
            detailsObj.address3;
                }
                detail.phone = detailsObj.tel;
                detail.email = detailsObj.email;
                if (detailsObj.profileimage.url !== undefined) {
                    detail.url = detailsObj.profileimage.url;
                } else {
                    detail.url = self.placeholder;
                }
                if (detailsObj.hasOwnProperty('sex')) {
                    detail.sex = detailsObj.sex.label;
                }
                if (detailsObj.hasOwnProperty('birth')) {
                    detail.birth = detailsObj.birth;
                }
                if (detailsObj.hasOwnProperty('role')) {
                    detail.position = detailsObj.role;
                }
                if (detailsObj.hasOwnProperty('department')) {
                    detail.department = detailsObj.department;
                }
                if (detailsObj.hasOwnProperty('radio_button_2')) {
                    detail.radio_button_2 = detailsObj.radio_button_2.label;
                }
                if (detailsObj.hasOwnProperty('pull_down')) {
                    detail.pull_down = detailsObj.pull_down.label;
                }
                if (detailsObj.hasOwnProperty('notes')) {
                    detail.text = detailsObj.notes;
                }
                if (detailsObj.hasOwnProperty('multiple_check')) {
                    let multipleInput = '';
                    for (let i = 0; i < detailsObj.multiple_check.length; ++i) {
                        multipleInput += detailsObj.multiple_check[i].label + ', ';
                        detail.multiple_check = multipleInput;
                    }
                }

                self.detail = detail;
                for (let i = 0; i < self.profile.length; i++) {
                    if (self.profile[i].name === 'First Name' && detailsObj.name1) {
                        self.profile[i].value = detailsObj.name1;
                    } else if (self.profile[i].name === 'Last Name' && detailsObj.name2) {
                        self.profile[i].value = detailsObj.name2;
                    } else if (self.profile[i].name === 'Gender' && detailsObj.sex.label) {
                        self.profile[i].value = detailsObj.sex.label;
                    } else if (self.profile[i].name === 'Hire Date' && detailsObj.hire_date) {
                        self.profile[i].value = detailsObj.hire_date;
                    } else if (self.profile[i].name === 'Department' && detailsObj.department) {
                        self.profile[i].value = detailsObj.department;
                    } else if (self.profile[i].name === 'Position' && detailsObj.role) {
                        self.profile[i].value = detailsObj.role;
                    } else if (self.profile[i].name === 'Phone' && detail.phone) {
                        self.profile[i].value = detail.phone;
                    } else if (self.profile[i].name === 'Email' && detail.email) {
                        self.profile[i].value = detail.email;
                    } else if (self.profile[i].name === 'Office' && detail.pull_down) {
                        self.profile[i].value = detail.pull_down;
                    } else if (self.profile[i].name === 'Hobby' && detail.multiple_check) {
                        self.profile[i].value = detail.multiple_check;
                    } else if (self.profile[i].name === 'Notes' && detail.text) {
                        self.profile[i].value = detail.text;
                    }
                }
            })
            .catch(function (error) {
                self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                self.$store.dispatch('snackbar/snackOn');
            });
    }
};
</script>
