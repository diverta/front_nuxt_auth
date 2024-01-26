<template>
    <v-container v-if="positionPattern === 'no image' && text" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="c-heading_h2" v-text="subtitle" />
            <v-card-text>
                <div class="text--primary">
                    <span class="text">{{ text }}</span>
                </div>
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="positionPattern === 'top'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="c-heading_h2" v-text="subtitle" />
            <v-img
                class="mx-auto"
                :src="imageUrl"
                max-width="1060"
                max-height="800"
                position="center"
                :aspect-ratio="1"
            />
            <v-card-text>
                <div class="text--primary">
                    <span class="text">{{ text }}</span>
                </div>
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="positionPattern === 'bottom'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="c-heading_h2" v-text="subtitle" />
            <v-card-text>
                <div class="text--primary pb-5">
                    <span class="text">{{ text }}</span>
                </div>
                <v-img
                    class="mx-auto"
                    :aspect-ration="16 / 9"
                    :src="imageUrl"
                    max-height="900"
                    max-width="1000"
                    position="center"
                />
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="positionPattern === 'left'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="text-h4" v-text="subtitle" />
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-img
                            fluid
                            class="mr-auto img-responsive"
                            :aspect-ration="16 / 9"
                            :src="imageUrl"
                            max-height="900"
                            max-width="500"
                        />
                    </v-col>
                    <v-col>
                        <div class="text--primary">
                            <span class="text">{{ text }}</span>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>

    <v-container v-else-if="positionPattern === 'right'" fluid>
        <v-card class="mx-auto" max-width="7000">
            <v-card-title class="text-h5" v-text="subtitle" />
            <v-container key="start">
                <v-row>
                    <v-col>
                        <div class="text--primary">
                            <span class="text">{{ text }}</span>
                        </div>
                    </v-col>
                    <v-col>
                        <v-img
                            fluid
                            class="ml-auto img-responsive"
                            :aspect-ration="16 / 9"
                            :src="imageUrl"
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
        imageUrl: {
            type: String,
            required: false,
            default: ''
        },
        positionPatternKey: {
            type: String,
            required: false,
            default: null
        },
        text: {
            type: String,
            required: false,
            default: ''
        }
    },
    computed: {
        positionPattern() {
            const getPattern = (key) => {
                switch (key) {
                case '0':
                    return 'no image';
                case '1':
                    return 'top';
                case '2':
                    return 'left';
                case '3':
                    return 'bottom';
                case '4':
                    return 'right';
                default:
                    return null;
                }
            };
            return getPattern(this.positionPatternKey);
        }
    }
};
</script>

<style>
.text {
  white-space: pre-line;
}
</style>
