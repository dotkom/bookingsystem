<template>
  <div>
    <a @click="logout">logout</a>
    <p>Future Calendar</p>
  </div>
</template>

<script lang="ts">
export default {
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
};
</script>
