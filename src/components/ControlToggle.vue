<template>
  <div>
    <div class="container" @click="action">
      <font-awesome-icon
        class="icon"
        :icon="toggled ? iconTrue : iconFalse"
        size="2x"
        fixed-width
      ></font-awesome-icon>
    </div>
    <div class="controlText">{{ toggled ? textTrue : textFalse }}</div>
  </div>
</template>

<script>
export default {
  props: {
    iconTrue: String,
    iconFalse: String,
    action: {
      type: Function,
      required: false,
      default: () => {}
    },
    toggled: {
      type: Boolean,
      required: true,
      default: false
    },
    textTrue: String,
    textFalse: String
  }
};
</script>

<style scoped>
.container {
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
.controlText {
  margin-top: 5px;
  font-weight: bold;
}
.icon {
  padding: 0.35em;
}
.iconNotToggled {
  color: hsla(0, 0%, 45%, 1);
}
.iconToggled {
  color: white;
  background: #2c3e50;
}
</style>
