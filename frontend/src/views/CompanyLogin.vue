<template>
  <div :class="$style.companyLogin">
    <Header />
    <div :class="$style.__content">
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
      <Button btnText="KOM I GANG" @btnClicked="btnClicked" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TextInput from "@/components/shared/TextInput.vue";
import Header from "@/components/shared/Header.vue";
import Button from "@/components/shared/Button.vue";
export default Vue.extend({
  components: {
    TextInput,
    Header,
    Button
  },
  methods: {
    updateAdmissionCode(event: any) {},
    btnClicked() {
      //button was clicked, do something
    }
  }
});
</script>

<style lang="scss" module>
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
