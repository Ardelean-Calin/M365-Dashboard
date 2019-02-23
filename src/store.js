import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appState: "connecting",
    batteryLevel: 0,
    kmRemaining: 0,
    kmTotal: 0,
    kmTraveled: 0,
    vehicleSpeed: 0,
    vehicleTemperature: 0
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
    }
  },
  actions: {}
});
