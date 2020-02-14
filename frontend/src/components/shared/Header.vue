<template>
  <div>
    <header :class="$style.header">
      <img :class="$style.img" src="@/assets/online.png" alt="Online Header" />
      <h2>Bookingsystem</h2>
    </header>
  </div>
</template>

<style lang="scss" module>
header {
  background-color: $online-blue;
  display: grid;
  -moz-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  color: white;
}
img {
  width: 26rem;
  max-width: 100vw;
  box-sizing: border-box;
  padding: 1.5rem;
}
</style>
