<template>
  <div class="home">
    <LargeInfo/>
  </div>
</template>

<script>
import LargeInfo from "@/components/LargeInfo.vue";
export default {
  name: "home",
  components: {
    LargeInfo
  }
};
</script>

<style>
#home {
  display: flex;
}
</style>
