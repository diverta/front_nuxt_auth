<template>
    <div class="input-date">
        <!-- datetime -->
        <div
            v-if="context.slotProps.component.time"
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

        <!-- date -->
        <v-dialog
            v-else
            v-model="modal"
            persistent
            width="290px"
        >
            <template #activator="{ on, attrs }">
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
                :min="minmax.min"
                :max="minmax.max"
            >
                <v-spacer />
                <v-btn
                    text
                    color="primary"
                    @click="() => {
                        modal = false;
                        model = '';
                    }"
                >
                    Clear
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="() => modal = false"
                >
                    OK
                </v-btn>
            </v-date-picker>
        </v-dialog>
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
            modal: false
        };
    },
    computed: {
        model: {
            get() {
                return this.context.model;
            },
            set(date) {
                if (date === '') {
                    this.context.model = undefined;
                    return;
                }
                const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(date);
                this.context.model = isYYYYMMDD
                    ? date
                    : this.$dateFns.format(new Date(date), 'yyyy-MM-dd hh:mm');
            }
        },
        minmax() {
            const [min, max] = this.context.rules
                ?.filter(({ ruleName }) => ruleName === 'datetime')
                ?.map(({ args }) => args)
                ?.[0] || [];
            return {
                min: min ? this.$dateFns.formatISO(new Date(Number(min))) : undefined,
                max: max ? this.$dateFns.formatISO(new Date(Number(max))) : undefined
            };
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
