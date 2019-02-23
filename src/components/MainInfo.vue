<template>
  <div class="mainContainer">
    <div class="mainText">{{ mainInfo }}</div>
    <div class="unit">km rămași</div>
  </div>
</template>

<script>
export default {
  props: ["mainInfo"]
};
</script>

<style scoped>
.mainContainer {
  display: flex;
  flex-direction: column;
}
.secondaryContainer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.mainText {
  font-size: 10rem;
  font-weight: bold;
  line-height: 0.75;
}
.unit {
  font-weight: bold;
  font-style: italic;
  color: rgba(0, 0, 0, 0.45);
}
</style>
