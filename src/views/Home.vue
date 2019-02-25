<template>
  <div class="container">
    <!-- Status items -->
    <div class="connection" @click="connect">
      <font-awesome-icon
        :icon="['fab', 'bluetooth']"
        size="lg"
        :class="{ connected: isConnected }"
      ></font-awesome-icon>
    </div>
    <div class="temperature">
      <font-awesome-icon
        icon="thermometer-half"
        size="lg"
        fixed-width
      ></font-awesome-icon>
      <div class="temperatureText">
        {{ this.$store.state.vehicleTemperature }} °C
      </div>
    </div>
    <!-- Main view -->
    <div class="home">
      <div class="information">
        <MainInfo :mainInfo="this.$store.state.kmRemaining" />
        <div class="importantInfo">
          <AddInfo
            class="flexItem"
            :icon="this.$store.state.batteryIcon"
            :info="this.$store.state.batteryLevel"
            unit="%"
            subText="baterie"
            large
          />

          <AddInfo
            class="flexItem"
            :info="this.$store.state.avgSpeed"
            icon="tachometer-alt"
            unit="km/h"
            subText=""
            large
          />
        </div>
        <div class="additionalInfo">
          <AddInfo
            class="flexItem"
            :icon="['far', 'flag']"
            :info="this.$store.state.kmTraveled"
            unit="km"
            subText="cursă"
          />
          <AddInfo
            class="flexItem"
            :info="this.$store.state.kmTotal"
            icon="road"
            unit="km"
            subText="total"
          />
          <AddInfo
            class="flexItem"
            :info="this.$store.state.uptime.toString() + 'm'"
            icon="stopwatch"
            unit=""
            subText="durată"
          />
        </div>
      </div>
      <div class="controls">
        <ControlToggle
          :toggled="this.$store.state.vehicleLocked"
          iconTrue="lock"
          iconFalse="unlock"
          textTrue="Blocat"
          textFalse="Deblocat"
          :disabled="!this.isConnected"
          :action="() => this.$store.commit('lockUnlockVehicle')"
        />
        <ControlToggle
          :toggled="this.$store.state.cruiseControl"
          :iconTrue="['fas', 'compass']"
          :iconFalse="['far', 'compass']"
          textTrue="CC pornit"
          textFalse="CC oprit"
          :disabled="!this.isConnected"
          :action="() => this.$store.commit('toggleCruiseControl')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { connectScooter } from "@/m365.js";
import MainInfo from "@/components/MainInfo.vue";
import AddInfo from "@/components/AddInfo.vue";
import ControlToggle from "@/components/ControlToggle.vue";
export default {
  name: "home",
  components: {
    MainInfo,
    AddInfo,
    ControlToggle
  },
  computed: {
    isConnected() {
      return this.$store.state.connected;
    }
  },
  methods: {
    connect() {
      // Just connect to the scooter
      connectScooter();
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.divider {
  width: 1px;
  border-right: 1px dashed;
}
.connection {
  position: absolute;
  top: 1rem;
  left: 1rem;
}
.controls {
  padding: 0 20%;
  margin-top: 8rem;
  display: flex;
  justify-content: space-between;
}
.temperature {
  display: flex;
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.temperatureText {
  font-weight: bold;
}
.information {
  margin: 0.5em;
  padding: 2rem 1rem 1rem 1rem;
  background: white;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.importantInfo {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.additionalInfo {
  display: flex;
  flex-wrap: wrap;
  margin-top: 3rem;
  justify-content: center;
  align-content: space-between;
}

.flexItem {
  flex-basis: 33%;
}

.connected {
  color: #2980b9;
}
</style>
