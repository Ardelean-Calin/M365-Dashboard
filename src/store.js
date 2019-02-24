import Vue from "vue";
import Vuex from "vuex";
import {lockScooter, unlockScooter, enableCC, disableCC} from "@/m365.js";

Vue.use(Vuex);
let store = new Vuex.Store({
  state: {
    connected: false,
    bluetoothDevice: null,
    batteryLevel: 0,
    batteryIcon: "battery-full",
    cruiseControl: true,
    kmRemaining: 0,
    kmTotal: 0,
    kmTraveled: 0,
    vehicleSpeed: 0,
    vehicleTemperature: null,
    vehicleLocked: false
  },
  mutations: {
    setConnected(state, connected) {
      state.connected = connected;
      if (connected == false){
        state.bluetoothDevice = null;
      }
    },
    setBatteryLevel(state, n) {
      state.batteryLevel = n;
    },
    setKmRemaining(state, n) {
      state.kmRemaining = n;
    },
    setKmTotal(state, n) {
      state.kmTotal = Math.round(n);
    },
    setKmTraveled(state, n) {
      state.kmTraveled = Math.round(n * 10) / 10;
    },
    setVehicleSpeed(state, n) {
      state.vehicleSpeed = Math.round(n * 10) / 10;
    },
    setVehicleTemperature(state, n) {
      state.vehicleTemperature = Math.round(n * 10) / 10;
    },
    setStateLocked(state, b){
      state.vehicleLocked = b;
    },
    lockUnlockVehicle(state) {
      if (state.vehicleLocked){
        unlockScooter(state.bluetoothDevice)
      } else {
        lockScooter(state.bluetoothDevice)
      }
    },
    setStateCC(state, b){
      state.cruiseControl = b;
    },
    toggleCruiseControl(state) {
      // TO-DO: Send CC command
      // if (state.cruiseControl){
      //   enableCC(state.bluetoothDevice)
      // } else {
      //   disableCC(state.bluetoothDevice)
      // }
    },
    setDevice(state, d){
      state.bluetoothDevice = d;
    }
  },
  actions: {}
});

export default store;