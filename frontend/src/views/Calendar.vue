<template>
<div>
    <a @click="logout"> logout </a>
    <p>Future Calendar</p>
</div>
</template>

<script lang="ts">
export default {
  components: {},
  methods:{
    logout(){
            this.$store.commit({
              type: "attemptLogin",
              status: false
            });
            console.log(localStorage.getItem('store') as string)
            console.log(this.$store)
            this.$router.push('/login')
    }
  }
};
</script>
