<template>
  <div class="container">
    <!-- Status items -->
    <div class="connection" @click="connect">
      <font-awesome-icon
        :icon="['fab', 'bluetooth-b']"
        size="lg"
        :class="{connected: isConnected}"
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
        <div class="additionalInfo">
          <AddInfo
            :icon="this.$store.state.batteryIcon"
            :info="this.$store.state.batteryLevel"
            unit="%"
            subText="baterie"
          />
          <div class="divider"></div>
          <AddInfo
            icon="road"
            :info="this.$store.state.kmTraveled"
            unit="km"
            subText="parcurși"
          />
          <div class="divider"></div>
          <AddInfo
            :info="this.$store.state.kmTotal"
            icon="tachometer-alt"
            unit="km"
            subText="total"
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
import {
  searchScooter,
  connectScooter,
  startNotificationListener,
  startRequesterTimer
} from "@/m365.js";
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
    isConnected(){
      return this.$store.state.connected;
    }
  },
  methods: {
    connect() {
      let gattServer;
      searchScooter()
        // TO-DO: Store device in store
        .then(device => connectScooter(device))
        .then(server => {
          gattServer = server;
          return startNotificationListener(server);
        })
        .then(characteristic => startRequesterTimer(gattServer));
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
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.additionalInfo {
  display: flex;
  flex-wrap: wrap;
  margin-top: 3rem;
  justify-content: space-around;
}

.connected {
  color: #2980b9;
}
</style>
