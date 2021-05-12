<template>

    <v-container v-if="pattern == 'no image' && text" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="c-heading_h2" v-text="subtitle" />
            <v-card-text>
                <div class="text--primary">
                    {{ text }}
                </div>
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="pattern == 'top'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="c-heading_h2" v-text="subtitle" />
            <v-img
                class="mx-auto"
                :src="image_url"
                max-width="1060"
                max-height="800"
                position="center"
                :aspect-ratio="1"
            />
            <v-card-text>
                <div class="text--primary">
                    {{ text }}
                </div>
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="pattern == 'bottom'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="c-heading_h2" v-text="subtitle" />
            <v-card-text>
                <div class="text--primary pb-5">
                    {{ text }}
                </div>
                <v-img
                    class="mx-auto"
                    :aspect-ration="16 / 9"
                    :src="image_url"
                    max-height="900"
                    max-width="1000"
                    position="center"
                />
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="pattern == 'left'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="text-h4" v-text="subtitle" />
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-img
                            fluid
                            class="mr-auto img-responsive"
                            :aspect-ration="16 / 9"
                            :src="image_url"
                            max-height="900"
                            max-width="500"
                        />
                    </v-col>
                    <v-col>
                        <div class="text--primary">
                            {{ text }}
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="pattern == 'right'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="text-h5" v-text="subtitle" />
            <v-container key="start">
                <v-row>
                    <v-col>
                        <div class="text--primary">
                            {{ text }}
                        </div>
                    </v-col>
                    <v-col>
                        <v-img
                            fluid
                            class="ml-auto img-responsive"
                            :aspect-ration="16 / 9"
                            :src="image_url"
                            max-height="900"
                            max-width="500"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-container>

</template>

<script>
export default {
    props: {
        subtitle: {
            type: String,
            required: false,
            default: ''
        },
        image_url: {
            type: String,
            required: false,
            default: ''
        },
        pattern: {
            type: String,
            required: false,
            default: null
        },
        text: {
            type: String,
            required: false,
            default: ''
        },
    }
};
</script>
