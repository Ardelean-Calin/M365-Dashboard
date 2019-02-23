<template>
  <div>
    <div>{{ mainInfo }} km/h</div>
  </div>
</template>

<script>
export default {
  computed: {
    mainInfo() {
      return this.$store.state.kmRemaining;
    }
  }
};
</script>

<style>
</style>
