import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
const API_PREFIX = "/api/3.4";
const {
  VUE_APP_TABLEAU_SERVER: server,
  VUE_APP_TABLEAU_SITE: site
} = process.env;
export default new Vuex.Store({
  state: {
    server: server,
    site: site,
    credentials: null,
    list: [],
    selected: null,
    isEditing: false
  },
  mutations: {
    setAuthCredentials(state, credentials) {
      state.credentials = credentials;
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
      const site = state.site;
      const { user, password } = params;
      let { data } = await axios.post(
        `${API_PREFIX}/auth/signin`,
        `<tsRequest>
              <credentials name="${user}" password="${password}">
                  <site contentUrl="${site}" />
              </credentials>
         </tsRequest>`,
        {
          headers: {
            "Content-Type": "text/xml"
          }
        }
      );
      if (data) {
        commit("setAuthCredentials", data.credentials);
      }
    },
    async fetch({ state, commit }) {
      const { token, site } = state.credentials;
      let { data } = await axios.get(`${API_PREFIX}/sites/${site.id}/views`, {
        headers: {
          "X-Tableau-Auth": token
        }
      });
      commit("setList", data.views.view);
    },
    async fetchUsers({ state, commit }) {
      const { token, site } = state.credentials;
      let { data } = await axios.get(`${API_PREFIX}/sites/${site.id}/users`, {
        headers: {
          "X-Tableau-Auth": token
        }
      });
    }
  }
});
