import * as cmd from "@/scooterCommands.js";

import store from "@/store.js";
import { sleep } from "@/utils.js";

const UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// Time in ms to wait between requests
const BLE_REQUEST_DELAY = 35;

// Options for device scanning. services field is necessary to be allowed to
// access that field
const options = {
  filters: [
    { namePrefix: "MIScooter" },
    { services: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"] }
  ]
};

let refreshTimer;

export async function connectScooter() {
  let device;
  // TO-DO Check if we have a saved device and try to connect to that, skipping
  // the device part. Is this even possible?

  // Get a device by prompting the user
  try {
    device = await navigator.bluetooth.requestDevice(options);
  } catch (err) {
    store.commit("setErrorFlag", true);
    return;
  }

  // Add an on-disconnect event
  device.addEventListener("gattserverdisconnected", onDisconnected);

  // Get a gattServer
  let gattServer = await device.gatt.connect();
  store.commit("setConnected", true);
  store.commit("setErrorFlag", false);
  store.commit("setGattServer", gattServer);

  // Get the serial RX and TX characteristics
  let rxCharacteristic = await gattServer
    .getPrimaryService(UART_SERVICE)
    .then(service => service.getCharacteristic(UART_RX_CHARACTERISTIC));
  let txCharacteristic = await gattServer
    .getPrimaryService(UART_SERVICE)
    .then(service => service.getCharacteristic(UART_TX_CHARACTERISTIC));

  // And commit them to the store
  store.commit("setRxCharacteristic", rxCharacteristic);
  store.commit("setTxCharacteristic", txCharacteristic);

  // Start to listen for notifications on the GATT Server
  startNotificationListener(rxCharacteristic);
  // As well as request constant updates of data
  startRequesterTimer(txCharacteristic);
}

// Starts a timer which requests data from the scooter periodically
// Must be called only after a connection is successfully established
export function startRequesterTimer(txChar) {
  if (refreshTimer != null) {
    clearInterval(refreshTimer);
  }

  // Main timer that refreshes my data.
  try {
    refreshTimer = setInterval(
      async characteristic => {
        // Refresh every 250ms
        await characteristic.writeValue(cmd.GET_BATTERY_LEVEL);
        await sleep(BLE_REQUEST_DELAY);
        await characteristic.writeValue(cmd.GET_KM_SESSION);
        await sleep(BLE_REQUEST_DELAY);
        await characteristic.writeValue(cmd.GET_KM_TOTAL);
        await sleep(BLE_REQUEST_DELAY);
        await characteristic.writeValue(cmd.GET_TEMPERATURE);
        await sleep(BLE_REQUEST_DELAY);
        await characteristic.writeValue(cmd.GET_LOCK_STATUS);
        await sleep(BLE_REQUEST_DELAY);
        await characteristic.writeValue(cmd.GET_CC_STATUS);
        await sleep(BLE_REQUEST_DELAY);
      },
      350,
      txChar
    );
  } catch (error) {
    clearInterval(refreshTimer);
    store.commit("setConnected", false);
    store.commit("setErrorFlag", true);
  }
}

// Starts a timer which listens for scooter notifications
export function startNotificationListener(rxChar) {
  rxChar
    .startNotifications()
    .then(characteristic => {
      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleRxMessage
      );
    })
    .catch(error => store.commit("setErrorFlag", true));
}

// Function to handle incoming UART data
function handleRxMessage(event) {
  let bytes = new Uint8Array(event.target.value.buffer);
  let type = bytes[5];
  let value;

  // Battery
  if (type == 0xb4) {
    value = bytes[6];
    store.commit("setBatteryLevel", value);
    store.commit("setKmRemaining", (value / 100) * 30);
  }
  // KM this session
  else if (type == 0xb9) {
    value = (bytes[6] + bytes[7] * 256) / 100;
    store.commit("setKmTraveled", value);
  }
  // Total KMs
  else if (type == 0xb7) {
    value = (bytes[6] + bytes[7] * 256 + bytes[8] * 256) / 1000;
    store.commit("setKmTotal", value);
  }
  // Temperature
  else if (type == 0xbb) {
    value = bytes[6] / 10;
    store.commit("setVehicleTemperature", value);
  }
  // Lock/unlock status
  else if (type == 0xb2) {
    // True if locked
    value = Boolean(bytes[6] & 0x0007);
    store.commit("setStateLocked", value);
  }
  // Cruise control status
  else if (type == 0x7c) {
    // True if on
    value = Boolean(bytes[6]);
    store.commit("setStateCC", value);
  }
}

// Executed when bluetooth connection is lost.
function onDisconnected(event) {
  if (refreshTimer != null) clearInterval(refreshTimer);
  console.log("disconnected");
  store.commit("setConnected", false);
}
