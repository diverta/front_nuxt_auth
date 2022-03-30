/**
 * Vuex object wrapper for simplifying snackbar utility.
 * @see `/src/store/snackbar`
 */
export default ({ store }, inject) => {
    const snackbar = {
        info: (msg) => store.dispatch('snackbar/popupInfo', msg),
        error: (msg) => store.dispatch('snackbar/popupError', msg)
    };
    inject('snackbar', snackbar);
};
