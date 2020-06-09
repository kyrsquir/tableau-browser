import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const PREFIX = "http://localhost:1337";
const {
  VUE_APP_TABLEAU_SERVER: server,
  VUE_APP_TABLEAU_SITE: site
} = process.env;
export default new Vuex.Store({
  state: {
    server: server,
    site: site,
    // authenticated: true,
    authenticated: false,
    list: [],
    selected: null,
    isEditing: false
  },
  mutations: {
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
    setList(state, list) {
      state.list = list;
    },
    preview(state, entry) {
      if (!entry.tags.length) {
        entry.tags = [];
      }
      state.selected = entry;
    },
    select(state, entry) {
      state.isEditing = true;
      state.selected = entry;
    },
    deselect(state) {
      state.isEditing = false;
    }
  },
  actions: {
    async login({ state, commit }, params) {
      params.server = state.server;
      params.site = state.site;
      let { data } = await axios.post(`${PREFIX}/auth/signin`, params);
      if (data) {
        commit("setAuthenticated", true);
      }
    },
    async fetch({ commit }) {
      let { data } = await axios.get(`${PREFIX}/sites/_siteId_/views`);
      commit("setList", data.views.view);
    }
  }
});
