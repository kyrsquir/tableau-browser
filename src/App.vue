<template lang="pug">
b-container.px-0(fluid)
  Popup
  List(:fields="fields" v-if="$store.state.authenticated")
</template>

<script>
import List from "./components/List.vue";
import Popup from "./components/Popup.vue";

export default {
  components: {
    List,
    Popup
  },
  data() {
    return {
      fields: [
        {
          name: "name",
          caption: "Name",
          type: "string",
          editable: true
        },
        {
          name: "updatedAt",
          caption: "Modified",
          type: "date"
        },
        {
          name: "tags",
          caption: "Tags",
          type: "array",
          editable: true
        }
      ]
    };
  }
};
</script>

<style lang="stylus">
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap")
.container-fluid
  font-family Nunito
  min-height 100vh
</style>
