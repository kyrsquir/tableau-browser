<template lang="pug">
b-row.entry(:class="{ 'selected': isSelected }" @mouseover="onMouseover" @click="onClick")
  b-col(v-for="(field, index) in fields" :key="index")
    span(v-if="field.type === 'date'") {{ entry[field.name] | moment("from", "now", true) }} ago
    span(v-if="field.type === 'array'") {{ entry[field.name] | displayArray }}
    span(v-if="field.type === 'string'") {{ entry[field.name] }}
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  filters: {
    displayArray(value) {
      if (value.join) {
        return value.join(", ");
      } else {
        return "";
      }
    }
  },
  props: {
    entry: Object,
    fields: Array,
    isSelected: Boolean
  },
  computed: mapState(["isEditing"]),
  methods: {
    ...mapMutations(["preview", "select", "deselect"]),
    onMouseover() {
      if (!this.isEditing) {
        this.preview(this.entry);
      }
    },
    onClick() {
      if (this.isEditing) {
        this.deselect();
      } else {
        this.select(this.entry);
      }
    }
  }
};
</script>

<style lang="stylus">
@import "../styles/colors.styl"
.entry
  align-items center
  background $white
  margin-bottom 3px
  height 3rem
  transition left 1s
  cursor pointer
  &.selected
    position relative
    left 1.5rem
    margin-bottom 1rem
    margin-top 1rem
</style>
