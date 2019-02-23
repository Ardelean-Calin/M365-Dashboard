<template>
  <div class="container">
    <div class="info">
      <font-awesome-icon class="icon" :icon="icon" size="2x" fixed-width />
      <div class="infoValue">{{ info }}</div>
    </div>
    <div class="subtitle">
      <div class="unit">{{ unit }}</div>
      {{ subText }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["icon", "info", "unit", "subText"]
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 5rem;
}
.icon {
  color: hsla(0, 0%, 45%, 1);
}
.info {
  display: flex;
  align-items: center;
  padding: 2px;
}
.infoValue {
  font-weight: bold;
  font-size: 1.2rem;
  margin: auto;
}
.unit {
  margin-left: 1px;
  font-style: normal;
  font-weight: bold;
  margin-right: 3px;
}
.subtitle {
  display: flex;
  justify-content: center;
  font-style: italic;
  text-align: center;
}
</style>
