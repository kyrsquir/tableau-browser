<template lang="pug">
b-modal(
  v-model="!$store.state.credentials"
  title="Sign in"
  :ok-only="true"
  ok-title="Login"
  no-close-on-esc
  no-close-on-backdrop
  hide-header-close
  @ok="handleOk"
)
  b-form
    b-form-group.mb-3(label-cols="3" label="User")
      b-input(type="text" v-model="user" placeholder="User")
    b-form-group(label-cols="3" label="Password")
      b-input(type="password" v-model="password" placeholder="Password")
</template>

<script>
import { mapActions, mapMutations } from "vuex";

const {
  VUE_APP_TABLEAU_USER: user,
  VUE_APP_TABLEAU_PASSWORD: password
} = process.env;
export default {
  data() {
    return { user, password };
  },
  methods: {
    ...mapActions(["login"]),
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.login({
        user: this.user,
        password: this.password
      });
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    }
  }
};
</script>
