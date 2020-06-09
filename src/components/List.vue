<template lang="pug">
div.row
  main.col-9.pr-0
    b-form.filters
      b-row
        b-col(cols="4")
          b-form-group.search
            span.search-icon
              span <svg style="position: absolute;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.571 12.2945C13.773 11.0242 14.511 9.30921 14.511 7.42201C14.511 3.50701 11.337 0.333313 7.42201 0.333313C3.50701 0.333313 0.333313 3.50701 0.333313 7.42201C0.333313 11.337 3.50701 14.5107 7.42201 14.5107C8.96901 14.5107 10.4 14.0153 11.565 13.1745L16.23 17.8397L17.173 16.8969L12.571 12.2945Z" fill="#5F68AD"/></svg>
              span <svg style="left: 2px; position: absolute;" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.435 12.4347C11.764 11.1053 12.511 9.3023 12.511 7.4222C12.511 5.5422 11.764 3.7391 10.435 2.4097C9.10501 1.0803 7.302 0.333496 5.422 0.333496C3.542 0.333496 1.73901 1.0803 0.409607 2.4097L5.422 7.4222L10.435 12.4347Z" fill="#92B0FF"/></svg>
            b-input.search-input(placeholder="Search..." v-model="searchFilter")
          span.filters-toggle(@click="filtersCollapsed = !filtersCollapsed")
            span(v-show="filtersCollapsed") <svg width="10" height="4" viewBox="0 0 10 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 3L9 1" stroke="#5F68AD"/></svg>
            span(v-show="!filtersCollapsed") <svg width="10" height="4" viewBox="0 0 10 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.05005 3L5.05005 1L9.05005 3" stroke="#5F68AD"/></svg>
        span.delimiter
        b-form-group.sorting(label="ORDER BY" label-cols="5")
          b-select.sorting-select(v-model="currentSorting.field" :options="sortings")
          span.sorting-direction-icon(@click="currentSorting.direction = -currentSorting.direction")
            span(v-show="currentSorting.direction === 1") <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path transform="scale(1,-1) translate(0,-10)" d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 9.35355C3.84171 9.54882 4.15829 9.54882 4.35355 9.35355L7.53553 6.17157C7.7308 5.97631 7.7308 5.65973 7.53553 5.46447C7.34027 5.2692 7.02369 5.2692 6.82843 5.46447L4 8.29289L1.17157 5.46447C0.976311 5.2692 0.659728 5.2692 0.464466 5.46447C0.269204 5.65973 0.269204 5.97631 0.464466 6.17157L3.64645 9.35355ZM3.5 1V9H4.5V1H3.5Z" fill="#5F68AD"/></svg>
            span(v-show="currentSorting.direction === -1") <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 9.35355C3.84171 9.54882 4.15829 9.54882 4.35355 9.35355L7.53553 6.17157C7.7308 5.97631 7.7308 5.65973 7.53553 5.46447C7.34027 5.2692 7.02369 5.2692 6.82843 5.46447L4 8.29289L1.17157 5.46447C0.976311 5.2692 0.659728 5.2692 0.464466 5.46447C0.269204 5.65973 0.269204 5.97631 0.464466 6.17157L3.64645 9.35355ZM3.5 1V9H4.5V1H3.5Z" fill="#5F68AD"/></svg>
      b-row(v-show="!filtersCollapsed").filters-extra-row
        b-form-group.col-4(
            v-for="(field, index) in dateFields"
            :key="index"
            :label="field.caption"
            label-cols="3"
          )
          b-datepicker(
            v-model="filters[field.name]"
            value-as-date
            placeholder="Choose a date"
            :class="{ 'empty': !filters[field.name] }"
          )
        b-btn.clear-filters-button(variant="link" @click="filters = {}") Clear All
    b-row.entries-container
      b-col
        b-row.headers
          b-col(v-for="(field, index) in fields" :key="index") {{ field.caption | uppercase }}
        div.entries
          Entry(
            v-for="entry in sortedFilteredList"
            :key="entry.id"
            :entry="entry"
            :fields="fields"
            :is-selected="selected && entry.id === selected.id"
          )
  aside(:class="{ 'editing': isEditing }").col-3.selected
    b-form(v-if="selected")
      pre(v-if="0") data: {{ selected }}
      b-form-group(v-for="(field, index) in fields" :key="index" :label="field.caption" label-cols="3")
        b-input(
          v-if="field.type === 'string'"
          v-model="selected[field.name]"
          :plaintext="!isEditing || !field.editable"
        )
        b-tags(v-if="field.type === 'array'" v-model="selected[field.name]" :disabled="!isEditing || !field.editable")
        span(v-if="field.type === 'date'") {{ selected[field.name] | moment("from", "now", true) }} ago
      b-link.d-block.mt-3(:href="getAssetUrl()" target="_blank") Open asset
</template>

<script>
import Vue2Filters from "vue2-filters";
import Entry from "./Entry.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {
    Entry
  },
  mixins: [Vue2Filters.mixin],
  props: {
    fields: Array
  },
  data() {
    return {
      filtersCollapsed: true,
      searchFilter: "",
      filters: {},
      currentSorting: {
        direction: 1
      }
    };
  },
  computed: {
    ...mapState(["list", "selected", "isEditing", "server", "site"]),
    sortableFields() {
      return this.fields.filter(field =>
        ["string", "date"].includes(field.type)
      );
    },
    searchableFields() {
      return this.fields.filter(field =>
        ["string", "date"].includes(field.type)
      );
    },
    dateFields() {
      return this.fields.filter(field => field.type === "date");
    },
    sortings() {
      return this.sortableFields.map(entry => ({
        value: entry.name,
        text: entry.caption
      }));
    },
    filteredList() {
      let results = this.list;
      if (this.searchFilter) {
        results = this.filterBy(
          results,
          this.searchFilter,
          ...this.searchableFields.map(entry => entry.name)
        );
      }
      if (!this.filtersCollapsed) {
        for (let [key, value] of Object.entries(this.filters)) {
          results = results.filter(result =>
            this.$moment(value).isBefore(this.$moment(result[key]))
          );
        }
      }
      return results;
    },
    sortedFilteredList() {
      return this.orderBy(
        this.filteredList,
        this.currentSorting.field,
        this.currentSorting.direction
      );
    }
  },
  methods: {
    ...mapActions(["fetch"]),
    ...mapMutations(["preview"]),
    getAssetUrl() {
      return `${this.server}/#/site/${this.site}/views/${this.selected.contentUrl.replace("/sheets", "")}`;
    }
  },
  async created() {
    this.$set(this.currentSorting, "field", this.sortings[0].value);
    await this.fetch();
    this.preview(this.sortedFilteredList[0]);
  }
};
</script>

<style lang="stylus">
@import "../styles/colors.styl"
@import "../styles/overrides.styl"
main
  background-color $background
  padding-bottom 3rem

  .filters
    padding 1rem
    border-bottom 1px solid $purple
    margin-bottom 3rem
    .search
      padding-left 2.5rem
      &-icon
        position absolute
        top 10px
        left 25px
      &-input
        border none
        border-radius 0
        background none
        padding-left 0
        &::placeholder
          color $placeholder
        &:focus
          border-bottom 1px solid $purple
          background none
          box-shadow none
    &-toggle
      position absolute
      top 5px
      right 25px
      cursor pointer
      svg
        transform scale(1.3)
    .delimiter
      height 2rem
      margin-right 1rem
      border 0.5px solid $purple
    .sorting
      font-size 12px
      position relative
      color $caption
      &-select
        border 1px solid $lightpurple
        background $white
        color $darkpurple
        padding-left 15px
        width 8rem
      &-direction-icon
        cursor pointer
        position absolute
        right 8px
        top 8px
        svg
          transform scale(1.3)
    &-extra-row
      color $caption
      margin-top 1rem
      .b-form-datepicker.b-form-btn-label-control
        border-color $lightpurple
        &.empty label
          color $placeholder !important
        .btn.h-auto
          visibility hidden
        label
          margin-left -2rem
      .clear-filters-button
        color $blue
        font-weight bold

  .headers
    padding-bottom 1rem
    color $caption
    font-size 12px

  .entries-container
    padding 0 4rem

aside.selected
  display flex
  align-items center
  height 100vh
  flex 1
  max-width 75%
  background $white
  transition margin-left 0.5s ease
  padding-left 3rem
  &.editing
    margin-left -50%
</style>
