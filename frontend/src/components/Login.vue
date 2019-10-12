<template>
  <div id="app">
    <input v-model="accesstoken" type="text" placeholder="input token"/>
    <button @click="login"> Access bookingsystem </button>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";

export default {
          data() {
       return { accesstoken: ""};
     },
  methods: {
    login() {
      const value = [this.accesstoken];
              this.$http
        .post("http://localhost:3000/company/login", value)
               .then((res: AxiosResponse) => {
          if (res.data) {
            this.$store.commit({
              type: "attemptLogin",
              status: res.data
            });
            this.$router.push("calendar");
          }
        });
    }
  }
};
</script>

<style scoped></style>
