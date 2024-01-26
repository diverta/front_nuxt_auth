import Vue from 'vue';
import VueFormulate from '@braid/vue-formulate';

import config from '@/../formulate.config.js';

Vue.use(VueFormulate, {
    library: config.library
});
