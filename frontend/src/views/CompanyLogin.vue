<template>
  <div class="companyLogin">
    <Header />
    <div class="__content">
      <h2>
        Fin overskrift
      </h2>
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
    </div>
  </div>
</template>

<script>
import TextInput from "@/components/shared/TextInput.vue";
import Header from "@/components/shared/Header.vue";

export default {
  components: {
    TextInput,
    Header
  },
  methods: {
    updateAdmissionCode(event) {
      this.$store.dispatch("SET_ADMISSION_CODE", event.target.value);
    }
  }
};
</script>

<style lang="scss">
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
