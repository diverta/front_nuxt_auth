<template>
    <div fluid>
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            absolute
            top
            color="orange white-4"
        />
        <v-card>
            <v-toolbar flat color="primary" dark>
                <v-toolbar-title
                >
                    Select type of the Topic #{{ topic_id }}
                </v-toolbar-title>
                <v-col class="text-right">
                    <v-btn class="ma-2" color="green" dark @click="submit()">
                        Save
                        <v-icon dark right>
                            mdi-checkbox-marked-circle
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-toolbar>
            <v-tabs v-model="tab_id">
                <v-tab @click="change_tab(0)">
                    <v-icon left>
                        mdi-file-excel
                    </v-icon>
                    File document
                </v-tab>
                <v-tab @click="change_tab(1)">
                    <v-icon left>
                        mdi-launch
                    </v-icon>
                    Url link
                </v-tab>
                <v-tab @click="change_tab(2)">
                    <v-icon left>
                        mdi-details
                    </v-icon>
                    Detail page
                </v-tab>
                <v-tab-item>
                    <v-card flat>
                        <v-container>
                            <vue-form-generator
                                ref="form"
                                :schema="schemaFile"
                                :model="model"
                                @model-updated="onInput"
                            />
                        </v-container>
                        <br>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-container>
                            <vue-form-generator
                                ref="form"
                                :schema="schemaUrl"
                                :model="model"
                                @model-updated="onInput"
                            />
                        </v-container>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-row v-for="item in schemaDetailList" :key="item.id">
                        <v-col>
                            <v-card outlined>
                                <v-container>
                                    <vue-form-generator
                                        ref="form"
                                        :schema="item"
                                        :model="model"
                                        @model-updated="onInput"
                                    />
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </div>
</template>

<script>
import '~/assets/form.css';
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import KurocoParser from '~/plugins/parser.js';
import fieldVuetifyUploadFile from '~/components/vuetify_file_upload.vue';
import fieldVuetifyUploadImage from '~/components/vuetify_image_upload.vue';
import fieldVuetifyText from '~/components/vuetify_text.vue';
import fieldVuetifyTextArea from '~/components/vuetify_textarea.vue';
import fieldVuetifyDate from '~/components/vuetify_date.vue';
import fieldVuetifyJson from '~/components/vuetify_json.vue';
import fieldVuetifyPrefecture from '~/components/vuetify_prefecture.vue';
import fieldVuetifyMultipleChoice from '~/components/vuetify_multiple_choice.vue';
import fieldVuetifySingleChoice from '~/components/vuetify_single_choice.vue';
import fieldVuetifySingleOption from '~/components/vuetify_single_option.vue';
import fieldVuetifyPassword from '~/components/vuetify_password.vue';

Vue.component('fieldVuetifyUploadFile', fieldVuetifyUploadFile);
Vue.component('fieldVuetifyUploadImage', fieldVuetifyUploadImage);
Vue.component('fieldVuetifyDate', fieldVuetifyDate);
Vue.component('fieldVuetifyText', fieldVuetifyText);
Vue.component('fieldVuetifyTextArea', fieldVuetifyTextArea);
Vue.component('fieldVuetifyJson', fieldVuetifyJson);
Vue.component('fieldVuetifyPrefecture', fieldVuetifyPrefecture);
Vue.component('fieldVuetifySingleOption', fieldVuetifySingleOption);
Vue.component('fieldVuetifySingleChoice', fieldVuetifySingleChoice);
Vue.component('fieldVuetifyMultipleChoice', fieldVuetifyMultipleChoice);
Vue.component('fieldVuetifyPassword', fieldVuetifyPassword);

Vue.use(VueFormGenerator);
Vue.use(KurocoParser);

export default {
    auth: true,
    methods: {
        onInput (value, fieldName) {
            this.$set(this.model, fieldName, value);
        },
        submit() {
            const self = this;
            let sendModel = {};
            if (this.tab_id === 0) {
                const fileType = this.schemaFile.fields[0].radioGroup;
                const file = this.model.file;
                sendModel = {
                    ext_col_01: {
                        key: fileType.key,
                        value: fileType.value
                    },
                    ext_col_02: file
                };
                if (fileType === null || file === null) {
                    this.$store.dispatch(
                        'snackbar/setError',
                        'Choose file type/ upload file.'
                    );
                    this.$store.dispatch('snackbar/snackOn');
                } else {
                    sendModel = {
                        ext_col_01: {
                            key: fileType.key,
                            label: fileType.value
                        },
                        ext_col_02: file
                    };
                }
            } else if (this.tab_id === 1) {
                let url = this.model.url;
                let toDisplay = this.model.toDisplay;

                if (typeof url === 'string' || typeof toDisplay === 'string') {
                    if (typeof url !== 'string') {
                        url = this.schemaUrl.fields[0].text;
                    }
                    if (typeof toDisplay !== 'string') {
                        toDisplay = this.schemaUrl.fields[1].text;
                    }
                    sendModel = {
                        ext_col_01: {
                            key: 'url',
                            label: 'url'
                        },
                        ext_col_03: {
                            title: toDisplay,
                            url
                        }
                    };
                }
            } else if (this.tab_id === 2) {
                sendModel = {
                    ext_col_01: {
                        key: 'data',
                        label: 'data'
                    }
                };
                sendModel.ext_col_04 = this.json.ext_col_04;
                sendModel.ext_col_06 = this.json.ext_col_06;
                sendModel.ext_col_07 = this.json.ext_col_07;
                sendModel.ext_col_09 = this.json.ext_col_09;
                sendModel.ext_col_05 = new Array(30).fill({});
                for (let i = 0; i < this.json.ext_col_05.length; ++i) {
                    sendModel.ext_col_05[i] = {
                        id: this.json.ext_col_05[i].id
                    };
                }
                for (const key in this.model) {
                    if (this.model.hasOwnProperty(key)) {
                        if (
                            key.startsWith('ext_col_04') ||
              key.startsWith('ext_col_05') ||
              key.startsWith('ext_col_06') ||
              key.startsWith('ext_col_07') ||
              key.startsWith('ext_col_09')
                        ) {
                            const arr = key.split('_');
                            const indexJson = arr[0] + '_' + arr[1] + '_' + arr[2];
                            const indexArr = parseInt(arr[3]);
                            sendModel[indexJson][indexArr] = this.model[key];
                        }
                    }
                }
            }

            self.$store.$auth.ctx.$axios
                .post(this.update_url, sendModel)
                .then(function (response) {
                    if (response.data.errors.length === 0) {
                        self.$store.dispatch(
                            'snackbar/setMessage',
                            'Thanks! Your topic is updated.'
                        );
                        self.$store.dispatch('snackbar/snackOn');
                        self.$router.push('/mypage/posted_list');
                    }
                })
                .catch(function (error) {
                    self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                    self.$store.dispatch('snackbar/snackOn');
                });
        },
        change_tab(id) {
            this.tab_id = id;
        }
    },
    data() {
        return {
            topic_id: null,
            update_url: '',
            text: '',
            loading: true,
            tab_id: null,
            json: '',
            model: {},
            schemaDetailList: [],
            schemaFile: {
                fields: [
                    {
                        model: 'type',
                        label: 'File type',
                        radioGroup: null,
                        contents: [
                            {
                                key: 'pdf',
                                value: 'pdf',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 'word',
                                value: 'word',
                                default: false,
                                attribute: { group: '1' }
                            },
                            {
                                key: 'excel',
                                value: 'excel',
                                default: false,
                                attribute: { group: '1' }
                            }
                        ],
                        required: true,
                        type: 'vuetifySingleChoice'
                    },
                    {
                        model: 'file',
                        type: 'vuetifyUploadFile',
                        file: null,
                        required: true
                    }
                ]
            },
            schemaUrl: {
                fields: [
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: 'Link URL',
                        model: 'url',
                        texttype: 'url',
                        required: true
                    },
                    {
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: '',
                        min: 0,
                        max: 100,
                        label: 'Text to display',
                        model: 'toDisplay',
                        required: true
                    }
                ]
            }
        };
    },
    mounted() {
        this.topic_id = this.$route.params.id;
        this.update_url = '/rcms-api/1/topics/update/' + this.topic_id;
        const url = '/rcms-api/1/topic/detail/' + this.topic_id;
        const self = this;

        this.loading = true;
        this.$store.$auth.ctx.$axios
            .get(url)
            .then(function (response) {
                const json = response.data.details;
                self.json = json;

                if (json.ext_col_01.key === 'url') {
                    self.schemaUrl.fields[0].text = json.ext_col_03.url;
                    self.schemaUrl.fields[1].text = json.ext_col_03.title;
                    self.tab_id = 1;
                } else if (
                    json.ext_col_01.key === 'pdf' ||
          json.ext_col_01.key === 'word' ||
          json.ext_col_01.key === 'excel'
                ) {
                    let fileFormat = {};
                    for (let i = 0; i < 3; ++i) {
                        if (
                            self.schemaFile.fields[0].contents[i].key === json.ext_col_01.key
                        ) {
                            fileFormat = self.schemaFile.fields[0].contents[i];
                        }
                    }
                    self.schemaFile.fields[0].radioGroup = fileFormat;
                    self.schemaFile.fields[1].file = new File([''], json.ext_col_02.url);
                    self.tab_id = 0;
                } else {
                    self.tab_id = 2;
                }

                for (let i = 0; i < 30; ++i) {
                    const schemaDetail = {
                        fields: []
                    };
                    let labelText = '';
                    let textarea = '';
                    let url = null;
                    let imagePos = {};
                    let textSize = {};

                    if (json.ext_col_01.key === 'data') {
                        if (typeof json.ext_col_09[i] === 'string') {
                            labelText = json.ext_col_09[i];
                        }
                        if (typeof json.ext_col_07[i] === 'string') {
                            textarea = json.ext_col_07[i];
                        }
                        if (
                            json.ext_col_05[i] !== undefined &&
              typeof json.ext_col_05[i].url === 'string'
                        ) {
                            url = json.ext_col_05[i].url;
                        }
                        imagePos = json.ext_col_04[i];
                        textSize = json.ext_col_06[i];
                    }
                    schemaDetail.fields.push({
                        type: 'vuetifyText',
                        inputType: 'text',
                        text: labelText,
                        min: 0,
                        max: 100,
                        label: 'subtitle_' + i.toString(),
                        model: 'ext_col_09_' + i.toString(),
                        required: false
                    });
                    schemaDetail.fields.push({
                        model: 'ext_col_07_' + i.toString(),
                        type: 'vuetifyTextArea',
                        inputType: 'text',
                        label: 'text_' + i.toString(),
                        placeholder: '',
                        text: textarea,
                        required: false,
                        counter: 1000,
                        max: 1000,
                        min: 0
                    });
                    schemaDetail.fields.push({
                        model: 'ext_col_06_' + i.toString(),
                        type: 'vuetifySingleOption',
                        label: 'text_size_' + i.toString(),
                        option: textSize,
                        contents: [
                            { key: '1', value: 'H2' },
                            { key: '2', value: 'H3' },
                            { key: '3', value: 'H4' },
                            { key: '4', value: 'H5' },
                            { key: '5', value: 'No level' }
                        ],
                        required: true,
                        edit: true
                    });
                    schemaDetail.fields.push({
                        model: 'ext_col_04_' + i.toString(),
                        type: 'vuetifySingleOption',
                        label: 'imagePosition_' + i.toString(),
                        option: imagePos,
                        contents: [
                            { key: '1', value: 'Top' },
                            { key: '2', value: 'Left' },
                            { key: '4', value: 'Right' },
                            { key: '3', value: 'Bottom' },
                            { key: '5', value: 'No image' }
                        ],
                        required: true,
                        edit: true
                    });
                    schemaDetail.fields.push({
                        model: 'ext_col_05_' + i.toString(),
                        type: 'vuetifyUploadImage',
                        url
                    });
                    self.schemaDetailList.push(schemaDetail);
                }
                self.loading = false;
            })
            .catch(function (error) {
                self.$store.dispatch('snackbar/setError', error.response.data.errors?.[0].message);
                self.$store.dispatch('snackbar/snackOn');
                self.loading = false;
            });
    }
};
</script>
