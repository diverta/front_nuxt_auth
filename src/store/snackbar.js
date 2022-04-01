export const state = () => ({
    isEnable: false,
    message: false,
    color: 'success'
});

export const getters = {
    status: (state) => {
        return state.isEnable;
    },
    message: (state) => {
        return state.message;
    }
};

export const mutations = {
    setenable(state) {
        state.isEnable = true;
    },
    setdisable(state) {
        state.isEnable = false;
    },
    setMessage(state, message) {
        state.color = 'success';
        state.message = message;
    },
    setError(state, message) {
        state.color = 'error';
        state.message = message;
    }
};

export const actions = {
    snackOff({ commit }) {
        commit('setdisable');
    },
    popupInfo({ commit }, message) {
        commit('setMessage', message);
        commit('setenable');
    },
    popupError({ commit }, message) {
        commit('setError', message);
        commit('setenable');
    }
};
