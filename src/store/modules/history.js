import Api from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
    test: []
}

// getters
const getters = {
    test: state => state.test
}

// actions
const actions = {
    addText: function({
        commit
    }, data) {
        commit(types.TEST, data)
    }
}


// mutations
const mutations = {
    [types.TEST](state, data) {
        state.list = data
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}