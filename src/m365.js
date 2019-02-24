import store from '@/store.js'

const UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const UART_RX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

// Time in ms to wait between requests
const BLE_REQUEST_DELAY = 35;

// Requests
const GET_BATTERY_LEVEL =
    Uint8Array.from([0x55, 0xaa, 0x03, 0x20, 0x01, 0xb4, 0x02, 0x25, 0xff])
        .buffer;
const GET_KM_SESSION =
    Uint8Array.from([0x55, 0xaa, 0x03, 0x20, 0x01, 0xb9, 0x02, 0x20, 0xff])
        .buffer;
const GET_KM_TOTAL =
    Uint8Array.from([0x55, 0xaa, 0x03, 0x20, 0x01, 0xb7, 0x04, 0x20, 0xff])
        .buffer;
const GET_TEMPERATURE =
    Uint8Array.from([0x55, 0xaa, 0x03, 0x20, 0x01, 0xbb, 0x02, 0x1e, 0xff])
        .buffer;

const GET_LOCK_STATUS =
    Uint8Array.from([0x55, 0xaa, 0x03, 0x20, 0x01, 0xb2, 0x02, 0x27, 0xFF])
        .buffer
const GET_CC_STATUS =
    Uint8Array.from([0x55, 0xaa, 0x03, 0x20, 0x01, 0x7c, 0x02, 0x5d, 0xFF])
        .buffer

// Commands
const CMD_LOCK_SCOOTER =
    Uint8Array
        .from([0x55, 0xaa, 0x04, 0x20, 0x03, 0x70, 0x01, 0x00, 0x67, 0xff])
        .buffer;
const CMD_UNLOCK_SCOOTER =
    Uint8Array
        .from([0x55, 0xaa, 0x04, 0x20, 0x03, 0x71, 0x01, 0x00, 0x66, 0xff])
        .buffer;
const CMD_ENABLE_CC =
    Uint8Array
        .from([0x55, 0xaa, 0x04, 0x20, 0x03, 0x7C, 0x01, 0x00, 0x5b, 0xff])
        .buffer;
const CMD_DISABLE_CC =
    Uint8Array
        .from([0x55, 0xaa, 0x04, 0x20, 0x03, 0x7C, 0x00, 0x00, 0x5c, 0xff])
        .buffer;

const options = {
  filters: [
    {namePrefix: 'MIScooter'},
    {services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']}
  ]
};

let refreshTimer;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Starts a scan and returns a promise
export function searchScooter() {
  // if(window.localStorage.getItem('scooter') != null){
  //   let device = window.localStorage.getItem('scooter');
  //   return Promise(() => device);
  // }
  return navigator.bluetooth.requestDevice(options);
}

export function connectScooter(device) {
  // TODO Save device to local storage.
  device.addEventListener('gattserverdisconnected', onDisconnected);
  return device.gatt.connect().then((server) => {
    store.commit('setConnected', true);
    store.commit('setDevice', server);
    return server;
  });
}

// Starts a timer which requests data from the scooter periodically
// Must be called only after a connection is successfully established
export function startRequesterTimer(gattServer) {
  if (refreshTimer != null) {
    clearInterval(refreshTimer);
  }
  gattServer.getPrimaryService(UART_SERVICE)
      .then(service => service.getCharacteristic(UART_TX_CHARACTERISTIC))
      // Ask for all necessary info
      .then(characteristic => {
        refreshTimer = setInterval(async (characteristic) => {
          // Refresh every 250ms
          await characteristic.writeValue(GET_BATTERY_LEVEL);
          await sleep(BLE_REQUEST_DELAY);
          await characteristic.writeValue(GET_KM_SESSION);
          await sleep(BLE_REQUEST_DELAY);
          await characteristic.writeValue(GET_KM_TOTAL);
          await sleep(BLE_REQUEST_DELAY);
          await characteristic.writeValue(GET_TEMPERATURE);
          await sleep(BLE_REQUEST_DELAY);
          await characteristic.writeValue(GET_LOCK_STATUS);
          await sleep(BLE_REQUEST_DELAY);
          await characteristic.writeValue(GET_CC_STATUS);
          await sleep(BLE_REQUEST_DELAY);
        }, 500, characteristic);
      })
      .catch(error => {
        clearInterval(refreshTimer);
        store.commit('setConnected', false)
      })
}

// Starts a timer which listens for scooter notifications
export function startNotificationListener(gattServer) {
  return gattServer.getPrimaryService(UART_SERVICE)
      .then(service => service.getCharacteristic(UART_RX_CHARACTERISTIC))
      .then(characteristic => characteristic.startNotifications())
      .then(characteristic => {
        characteristic.addEventListener(
            'characteristicvaluechanged', handleRxMessage);
      })
      .catch(error => console.log(error));
}

export function lockScooter(gattServer){
  return gattServer.getPrimaryService(UART_SERVICE)
      .then(service => service.getCharacteristic(UART_TX_CHARACTERISTIC))
      .then(characteristic => characteristic.writeValue(CMD_LOCK_SCOOTER))
      .catch(error => console.log(error));
}

export function unlockScooter(gattServer){
  return gattServer.getPrimaryService(UART_SERVICE)
      .then(service => service.getCharacteristic(UART_TX_CHARACTERISTIC))
      .then(characteristic => characteristic.writeValue(CMD_UNLOCK_SCOOTER))
      .catch(error => console.log(error));
}
export function enableCC(gattServer){
  return gattServer.getPrimaryService(UART_SERVICE)
      .then(service => service.getCharacteristic(UART_TX_CHARACTERISTIC))
      .then(characteristic => characteristic.writeValue(CMD_ENABLE_CC))
      .catch(error => console.log(error));
}

export function disableCC(gattServer){
  return gattServer.getPrimaryService(UART_SERVICE)
      .then(service => service.getCharacteristic(UART_TX_CHARACTERISTIC))
      .then(characteristic => characteristic.writeValue(CMD_DISABLE_CC))
      .catch(error => console.log(error));
}

// Function to handle incoming UART data
function handleRxMessage(event) {
  let bytes = new Uint8Array(event.target.value.buffer);
  let type = bytes[5];
  let value;
  // Battery
  if (type == 0xB4) {
    value = bytes[6]
    store.commit('setBatteryLevel', value)
    store.commit('setKmRemaining', (value / 100) * 30)
  }
  // KM this session
  else if (type == 0xB9) {
    value = (bytes[6] + bytes[7] * 256) / 10
    store.commit('setKmTraveled', value)
  }
  // Total KMs
  else if (type == 0xB7) {
    value = (bytes[6] + bytes[7] * 256 + bytes[8] * 256) / 1000
    store.commit('setKmTotal', value)
  }
  // Temperature
  else if (type == 0xBB) {
    value = bytes[6] / 10;
    store.commit('setVehicleTemperature', value)
  }
  // Lock/unlock status
  else if (type == 0xB2) {
    // True if locked
    value = Boolean(bytes[6] & 0x0007)
    store.commit('setStateLocked', value)
  }
  // Cruise control status
  else if (type == 0x7C) {
    // True if on
    value = Boolean(bytes[6])
    store.commit('setStateCC', value)
  }
}


function onDisconnected(event) {
  if (refreshTimer != null) clearInterval(refreshTimer)
}