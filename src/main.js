import Vue from 'vue'
import App from './App.vue'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters);
import VueMoment from 'vue-moment'
Vue.use(VueMoment);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  render: h => h(App),
  store,
}).$mount('#app');
