import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appState: "connecting",
    batteryLevel: 69,
    batteryIcon: "battery-full",
    economyMode: false,
    kmRemaining: 24,
    kmTotal: 1039,
    kmTraveled: 6,
    vehicleSpeed: 20,
    vehicleTemperature: 19.2,
    vehicleLocked: false
  },
  mutations: {
    setAppState(state, appState) {
      state.appState = appState;
    },
    setBatteryLevel(state, n) {
      state.batteryLevel = n;
    },
    setKmRemaining(state, n) {
      state.kmRemaining = n;
    },
    setKmTotal(state, n) {
      state.kmTotal = n;
    },
    setKmTraveled(state, n) {
      state.kmTraveled = n;
    },
    setVehicleSpeed(state, n) {
      state.vehicleSpeed = n;
    },
    setVehicleTemperature(state, n) {
      state.vehicleTemperature = n;
    },
    lockUnlockVehicle(state) {
      // TO-DO: Send lock command
      state.vehicleLocked = !state.vehicleLocked;
    },
    toggleEconomyMode(state) {
      state.economyMode = !state.economyMode;
    }
  },
  actions: {}
});
