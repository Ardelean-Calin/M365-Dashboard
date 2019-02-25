<template>
  <div class="container">
    <div class="widget">
      <div class="info">
        <font-awesome-icon
          class="icon"
          :icon="icon"
          :size="iconSize"
          fixed-width
        />
        <div>
          <div class="infoValue" :class="{ largeText: large }">{{ info }}</div>
          <div class="subtitle">
            <div v-if="unit" class="unit">{{ unit }}</div>
            {{ subText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: [String, Array],
    info: [String, Number],
    unit: String,
    subText: String,
    large: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconSize() {
      return this.$props.large ? "4x" : "2x";
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.widget {
  display: flex;
  flex-direction: column;
  max-width: 10rem;
}
.icon {
  color: hsla(0, 0%, 45%, 1);
  padding-right: 5px;
}
.info {
  display: flex;
  align-items: center;
  padding: 2px;
  text-align: left;
}
.infoValue {
  font-weight: bold;
  font-size: 1.2rem;
  /* margin: auto; */
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

.largeText {
  font-size: 1.5rem;
}
</style>
