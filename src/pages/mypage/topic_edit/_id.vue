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
                    {{ $t('mypage.select_type') }}{{ $route.params.id }}
                </v-toolbar-title>
                <v-col class="text-right">
                    <v-btn class="ma-2" color="green" dark @click="submit">
                        {{ $t('common.save') }}
                        <v-icon dark right>
                            mdi-checkbox-marked-circle
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-toolbar>
            <v-tabs v-model="tabID">
                <v-tab @click="() => tabID = 0">
                    <v-icon left>
                        mdi-file-excel
                    </v-icon>
                    {{ $t('mypage.tab_file') }}
                </v-tab>
                <v-tab @click="() => tabID = 1">
                    <v-icon left>
                        mdi-launch
                    </v-icon>
                    {{ $t('mypage.tab_url') }}
                </v-tab>
                <v-tab @click="() => tabID = 2">
                    <v-icon left>
                        mdi-details
                    </v-icon>
                    {{ $t('mypage.tab_detal') }}
                </v-tab>

                <v-tab-item>
                    <v-card flat>
                        <v-container>
                            <FormulateForm
                                v-model="form.file.values"
                                class="c-form"
                                :schema="form.file.schema"
                            />
                        </v-container>
                        <br>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-container>
                            <FormulateForm
                                v-model="form.url.values"
                                class="c-form"
                                :schema="form.url.schema"
                            />
                        </v-container>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-row v-for="item in schemaDetailList" :key="item.id">
                        <v-col>
                            <v-card outlined>
                                <v-container>
                                    <FormulateForm
                                        v-model="form.detail.values"
                                        class="c-form"
                                        :schema="form.detail.schema"
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
export default {
    auth: true,
    methods: {
        // TODO
        async submit() {
            let sendModel = {};
            if (this.tabID === 0) {
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
                    this.$snackbar.error(this.$i18n.t('mypage.choose_file'));
                } else {
                    sendModel = {
                        ext_col_01: {
                            key: fileType.key,
                            label: fileType.value
                        },
                        ext_col_02: file
                    };
                }
            } else if (this.tabID === 1) {
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
            } else if (this.tabID === 2) {
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
            await this.requestUpdate(sendModel);
        },
        async requestUpdate(sendModel) {
            try {
                const response = await this.$store.$auth.ctx.$axios.post(`/rcms-api/1/topics/update/${this.$route.params.id}`, sendModel);
                if (response.data.errors.length === 0) {
                    this.$store.info(this.$i18n.t('detail.thanks'));
                    this.$router.push('/mypage/posted_list');
                }
            } catch (e) {
                this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
            };
        }
    },
    data() {
        return {
            text: '',
            loading: true,
            tabID: null,
            json: '',
            model: {},
            schemaDetailList: [],

            form: {
                file: {
                    schema: [
                        {
                            name: 'type',
                            label: this.$i18n.t('mypage.file_type'),
                            type: 'VuetifySingleChoice',
                            'label-class': ['required'],
                            validation: 'required',
                            disableErrors: true,
                            options: [
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
                            ]
                        },
                        {
                            name: 'file',
                            type: 'VuetifyFileUpload',
                            label: 'File',
                            'label-class': ['required'],
                            validation: 'required',
                            disableErrors: true
                        }
                    ],
                    values: {}
                },
                url: {
                    schema: [
                        {
                            name: 'url',
                            label: this.$i18n.t('mypage.link_url'),
                            type: 'VuetifyText',
                            validation: 'required|url',
                            'label-class': ['required'],
                            disableErrors: true
                        },
                        {
                            name: 'toDisplay',
                            label: this.$i18n.t('mypage.text_display'),
                            type: 'VuetifyText',
                            validation: 'required|min:0,length|max:100,length',
                            'label-class': ['required'],
                            disableErrors: true
                        }
                    ],
                    values: {}
                },
                detail: {
                    schema: [],
                    values: {}
                }
            }
        };
    },
    async mounted() {
        this.loading = true;
        try {
            const response = await this.$store.$auth.ctx.$axios.get(`/rcms-api/1/topic/detail/${this.$route.params.id}`);
            this.details = response.data.details;

            const attachedFileType = this.details.ext_col_01.key;
            switch (attachedFileType) {
            case 'url':
                this.tabID = 1;
                break;
            case 'pdf':
            case 'word':
            case 'excel':
                this.tabID = 0;
                break;
            default:
                this.tabID = 2;
            }

            if (attachedFileType === 'url') {
                this.form.url.values.url = this.details.ext_col_03.url;
                this.form.url.values.toDisplay = this.details.ext_col_03.title;
            } else if (
                attachedFileType === 'pdf' ||
                attachedFileType === 'word' ||
                attachedFileType === 'excel'
            ) {
                this.form.file.file = new File([''], this.details.ext_col_02.url);
            }

            for (let i = 0; i < 30; ++i) {
                this.form.detail.schema = [
                    {
                        name: `ext_col_09_${i}`,
                        label: `subtitle_${i}`,
                        type: 'VuetifyText',
                        text: this?.details.ext_col_09?.[i] || '',
                        validation: 'min:0,length|max:100,length'
                    },
                    {
                        name: `ext_col_07_${i}`,
                        label: `text_${i}`,
                        type: 'VuetifyTextArea',
                        text: this?.details.ext_col_07?.[i] || '',
                        validation: 'min:0,length|max:1000,length'
                    },
                    {
                        name: `ext_col_06_${i}`,
                        label: `text_size_${i}`,
                        type: 'VuetifySingleOption',
                        option: this?.details?.ext_col_06?.[i] || '', // TODO
                        options: [
                            { key: '1', value: 'H2' },
                            { key: '2', value: 'H3' },
                            { key: '3', value: 'H4' },
                            { key: '4', value: 'H5' },
                            { key: '5', value: 'No level' }
                        ],
                        edit: true // TODO
                    },
                    {
                        name: `ext_col_04_${i}`,
                        label: `imagePosition_${i}`,
                        type: 'VuetifySingleOption',
                        option: this?.details?.ext_col_04?.[i] || '', // TODO
                        options: [
                            { key: '1', value: 'Top' },
                            { key: '2', value: 'Left' },
                            { key: '4', value: 'Right' },
                            { key: '3', value: 'Bottom' },
                            { key: '5', value: 'No image' }
                        ],
                        required: true,
                        edit: true // TODO
                    },
                    {
                        model: `ext_col_05_${i}`,
                        type: 'VuetifyImageUpload', // TODO
                        url: this?.details.ext_col_05?.[i]?.url || ''
                    }
                ];
            }
        } catch (e) {
            this.$snackbar.error(e?.response?.data?.errors?.[0]?.message);
        };
        this.loading = false;
    }
};
</script>
