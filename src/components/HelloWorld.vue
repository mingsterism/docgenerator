<template>
  <button v-on:click="buttonClick">Create Document</button>
</template>

<script>
var ObjectID = require("bson-objectid");
export default {
  name: "HelloWorld",
  methods: {
    mongoDbId: function() {
      return ObjectID();
    },
    buttonClick: function() {
      this.$router.push({ name: "edit", params: { id: this.mongoDbId() } });
    }
  }
};
</script>

<style>
</style>
