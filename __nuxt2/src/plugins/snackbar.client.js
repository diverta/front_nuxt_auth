/**
 * Vuex object wrapper for simplifying snackbar utility.
 * @see `/src/store/snackbar`
 */
export default ({ store, i18n }, inject) => {
    const snackbar = {
        info: (msg) => store.dispatch('snackbar/popupInfo', msg || i18n.t('common.executed')),
        error: (msg) => store.dispatch('snackbar/popupError', msg || i18n.t('common.error'))
    };
    inject('snackbar', snackbar);
};
