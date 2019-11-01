<template>
  <div>
    <a @click="logout">logout</a>
    <p>Future Calendar</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  components: {},
  methods: {
    logout() {
      this.$store.commit({
        type: "attemptLogin",
        status: false
      });
      this.$router.push("/login");
    }
  }
});
</script>



