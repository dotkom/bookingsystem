<template>
  <div id="app">
    <span>
    <label for="company code">{{label}} </label>
    <input v-model="accesstoken" type="text" name="company code"/>
   <p> {{hint}} </p>
    </span>
    <button @click="login"> Forsett til booking </button>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from "axios";

export default {
          data() {
       return {
         accesstoken: "",
         hint: "Hint: Tast inn koden du har fått tilsendt på mail",
         label:"Bedrifts kode"
       };
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

<style scoped>

#app * {
  display: block;
  text-align: center;
  margin: 0 auto;
}

span p{
  font-size: 6px;
}
</style>
