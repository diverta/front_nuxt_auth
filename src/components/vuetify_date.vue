<template>
    <v-form ref="myForm" v-model="formValid">
        <div v-if="schema.time == '1'">
            <v-dialog
                ref="dialogdate"
                v-model="modal"
                :return-value.sync="date"
                persistent
                width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="Date picker."
                        prepend-icon="mdi-calendar"
                        readonly
                        :rules="[
                            (v) =>
                                schema.required == false ||
                                (schema.required == true && !!v) ||
                                'required field',
                        ]"
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-date-picker
                    v-model="date"
                    mode="dateTime"
                    :min="schema.minYear"
                    :max="schema.maxYear"
                    is24hr
                    scrollable
                    @change="checkdate($event)"
                >
                    <v-spacer />
                    <v-btn text color="primary" @click="modal = false">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialogdate.save(date)">
                        OK
                    </v-btn>
                </v-date-picker>
            </v-dialog>
            <v-dialog
                ref="dialogtime"
                v-model="modal2"
                :return-value.sync="time"
                persistent
                width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="time"
                        label="Time picker."
                        :rules="[
                            (v) =>
                                schema.required == false ||
                                (schema.required == true && !!v) ||
                                'required field',
                        ]"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-time-picker
                    v-if="modal2"
                    v-model="time"
                    full-width
                    @change="checkdatetime($event)"
                >
                    <v-spacer />
                    <v-btn text color="primary" @click="modal2 = false">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialogtime.save(time)">
                        OK
                    </v-btn>
                </v-time-picker>
            </v-dialog>
        </div>
        <div v-else>
            <v-dialog
                ref="dialogdate"
                v-model="modal"
                :return-value.sync="date"
                persistent
                width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="Date picker."
                        :rules="[
                            (v) =>
                                schema.required == false ||
                                (schema.required == true && !!v) ||
                                'required field',
                        ]"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-date-picker
                    v-model="date"
                    mode="dateTime"
                    :min="schema.minYear"
                    :max="schema.maxYear"
                    is24hr
                    scrollable
                    @change="checkdate($event)"
                >
                    <v-spacer />
                    <v-btn text color="primary" @click="modal = false">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialogdate.save(date)">
                        OK
                    </v-btn>
                </v-date-picker>
            </v-dialog>
        </div>
    </v-form>
</template>

<script>
import { abstractField } from 'vue-form-generator';

export default {
    mixins: [abstractField],
    data () {
        return {
            formValid: true,
            date: null,
            time: null,
            modal: false,
            modal2: false
        };
    },
    methods: {
        checkdate (e) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                if (this.date && this.time) {
                    console.log(this.date + ' ' + this.time);
                    this.$emit(
                        'model-updated',
                        this.date + ' ' + this.time + ' +0900',
                        this.schema.model
                    );
                } else {
                    this.$emit('model-updated', this.date, this.schema.model);
                }
            }
        },
        checkdatetime (e) {
            this.formValid = this.$refs.myForm.validate();
            if (this.formValid) {
                if (this.date && this.time) {
                    console.log(this.date + ' ' + this.time);
                    this.$emit(
                        'model-updated',
                        this.date + ' ' + this.time + ' +0900',
                        this.schema.model
                    );
                } else {
                    this.$emit('model-updated', this.date, this.schema.model);
                }
            }
        }
    },
    mounted() {
        this.formValid = this.$refs.myForm.validate();
    }
};
</script>
