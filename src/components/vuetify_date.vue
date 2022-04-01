<template>
    <div class="input-date">
        <!-- TODO -->
        <v-dialog
            v-if="context.time !== '1'"
            v-model="modal"
            persistent
            width="290px"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="model"
                    :label="$t('label.date_picker')"
                    prepend-icon="mdi-calendar"
                    readonly
                    :rules="rules"
                    v-bind="attrs"
                    v-on="on"
                />
            </template>
            <v-date-picker
                v-model="model"
                mode="dateTime"
                color="#1777ca"
                is24hr
                scrollable
            >
                <v-spacer />
                <v-btn text color="primary" @click="() => modal = false">
                    Close
                </v-btn>
            </v-date-picker>
        </v-dialog>

        <div
            v-else
            class="inpute-date--datetime-wrapper"
        >
            <v-icon class="inpute-date--datetime-icon">
                mdi-calendar
            </v-icon>
            <v-datetime-picker
                v-model="model"
                class="inpute-date--datetime-picker"
                :label="$t('label.time_picker')"
                :dialog-width="340"
                clear="Clear"
                ok-text="OK"
            >
                <template #dateIcon>
                    <v-icon>mdi-calendar</v-icon>
                </template>
                <template #timeIcon>
                    <v-icon>mdi-clock</v-icon>
                </template>
            </v-datetime-picker>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import DatetimePicker from 'vuetify-datetime-picker';

Vue.use(DatetimePicker);

export default {
    props: {
        context: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            datetime: null,
            modal: false
        };
    },
    computed: {
        model: {
            get() {
                return this.context.model;
            },
            set(date) {
                const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(date);
                this.context.model = isYYYYMMDD
                    ? date
                    : this.$dateFns.format(new Date(date), 'yyyy-MM-dd hh:mm');
            }
        },
        rules() {
            if (!this?.context?.rules) {
                return [];
            }
            return this.context.rules.map(({ ruleName, args }) => {
                switch (ruleName) {
                case 'required':
                    return (v) => v !== ''
                        ? true
                        : this.$t('verify.required_field');
                default:
                    return null;
                }
            })
                .filter((fn) => fn);
        }
    }
};
</script>
