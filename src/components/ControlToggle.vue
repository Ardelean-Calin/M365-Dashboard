<template>
  <div>
    <div
      class="container"
      :class="{ btnDisabled: disabled, ripple: !disabled }"
      @click="action"
    >
      <font-awesome-icon
        class="icon"
        :icon="toggled ? iconTrue : iconFalse"
        size="2x"
        fixed-width
      ></font-awesome-icon>
    </div>
    <div v-if="!disabled" class="controlText">
      {{ toggled ? textTrue : textFalse }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    iconTrue: [Array, String],
    iconFalse: [Array, String],
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
    textFalse: String,
    disabled: Boolean
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
  background: white;
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
.btnDisabled {
  background: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.12);
}

.ripple {
  background-position: center;
  transition: background 0.5s ease;
}
.ripple:hover {
  background: white radial-gradient(circle, transparent 1%, white 1%)
    center/15000%;
}
.ripple:active {
  background-color: rgb(179, 179, 179);
  background-size: 100%;
  transition: background 0s;
}
</style>
