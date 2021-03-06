import {
  CMD_LOCK_SCOOTER,
  CMD_UNLOCK_SCOOTER,
  CMD_ENABLE_CC,
  CMD_DISABLE_CC
} from "@/scooterCommands.js";
import { lockScooter, unlockScooter } from "@/m365.js";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
let store = new Vuex.Store({
  state: {
    avgSpeed: 0,
    batteryIcon: "battery-full",
    batteryLevel: 0,
    gattServer: null,
    connected: false,
    cruiseControl: true,
    errorFlag: false,
    kmRemaining: 0,
    kmTotal: 0,
    kmTraveled: 0,
    rxCharacteristic: null,
    txCharacteristic: null,
    uptime: 0,
    vehicleLocked: false,
    vehicleSpeed: 0,
    vehicleTemperature: null
  },
  mutations: {
    setGattServer(state, server) {
      state.gattServer = server;
    },
    setRxCharacteristic(state, char) {
      state.rxCharacteristic = char;
    },
    setTxCharacteristic(state, char) {
      state.txCharacteristic = char;
    },
    setConnected(state, connected) {
      state.connected = connected;
      if (connected == false) {
        state.gattServer = null;
        state.errorFlag = false;
        state.rxCharacteristic = null;
        state.txCharacteristic = null;
      }
    },
    setErrorFlag(state, val) {
      state.errorFlag = val;
    },
    setBatteryLevel(state, n) {
      state.batteryLevel = n;
    },
    setKmRemaining(state, n) {
      state.kmRemaining = Math.round(n * 10) / 10;
    },
    setKmTotal(state, n) {
      state.kmTotal = Math.round(n);
    },
    setKmTraveled(state, n) {
      state.kmTraveled = Math.round(n * 10) / 10;
    },
    setAvgSpeed(state, n) {
      state.avgSpeed = Math.round(n * 10) / 10;
    },
    setUptime(state, n) {
      state.uptime = Math.round(n);
    },
    setVehicleTemperature(state, n) {
      state.vehicleTemperature = Math.round(n * 10) / 10;
    },
    setStateLocked(state, b) {
      state.vehicleLocked = b;
    },
    lockUnlockVehicle(state) {
      if (state.vehicleLocked) {
        unlockScooter(state.txCharacteristic);
      } else {
        lockScooter(state.txCharacteristic);
      }
    },
    setStateCC(state, b) {
      state.cruiseControl = b;
    },
    toggleCruiseControl(state) {
      // Doesn't seem to work.
      // TO-DO: Send CC command
      // if (state.cruiseControl) {
      //   state.txCharacteristic.writeValue(CMD_ENABLE_CC);
      // } else {
      //   state.txCharacteristic.writeValue(CMD_DISABLE_CC);
      // }
    }
  },
  actions: {}
});

export default store;
