<template>
  <div class="companyLogin">
    <Header />
    <div class="__content">
      <h2>Fin overskrift</h2>
      <p>
        Esse consectetur ipsum exercitation aliquip voluptate eiusmod esse
        pariatur aute. Esse consectetur ipsum exercitation aliquip voluptate
        eiusmod esse pariatur aute. Esse consectetur ipsum exercitation aliquip
        voluptate eiusmod esse pariatur aute.
      </p>
      <TextInput
        placeholderText="Skriv inn adgangskode"
        labelText="Kode"
        @emitInputText="updateAdmissionCode"
      />
      <Button btnText="KOM I GANG" @btnClicked="btnClicked" />
    </div>
  </div>
</template>

<script lang="ts">
import TextInput from "@/components/shared/TextInput.vue";
import Header from "@/components/shared/Header.vue";
import Button from "@/components/shared/Button.vue";
import { AxiosResponse } from "axios";

export default {
  components: {
    TextInput,
    Header,
    Button
  },
  methods: {
    updateAdmissionCode(event: any) {
      this.$store.dispatch(
        "SET_ADMISSION_CODE",
        (event.target as HTMLInputElement).value as string
      );
    },
    async btnClicked() {
      const value = [this.$store.getters.admissionCode];
      const res = await this.$http.post(
        "http://localhost:3000/company/login",
        value
      );
      if (res.data) {
        this.$store.commit({
          type: "attemptLogin",
          status: res.data
        });
        this.$router.push("calendar");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.companyLogin {
  display: flex;
  flex-direction: column;

  .__content {
    align-self: center;
    text-align: left;
    width: 25%;
  }
}
</style>
