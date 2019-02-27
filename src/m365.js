import * as cmd from "@/scooterCommands.js";

import store from "@/store.js";

const UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

// List of commands to execute
const commandList = [
  [0xb6, cmd.GET_AVG_SPEED],
  [0xb4, cmd.GET_BATTERY_LEVEL],
  [0x7c, cmd.GET_CC_STATUS],
  [0xb9, cmd.GET_KM_SESSION],
  [0xb7, cmd.GET_KM_TOTAL],
  [0xbb, cmd.GET_TEMPERATURE],
  [0x3b, cmd.GET_UPTIME],
  [0xb2, cmd.GET_LOCK_STATUS]
];
// Keeps track which commands were executed
let commandListIndices = new Array(commandList.length).fill(0);

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

  // Main timer that refreshes my data. Approx 3 times per second suffices.
  try {
    refreshTimer = setInterval(async function() {
      let sentItem = false;
      // Keep sending same command until I get an answer.
      for (let index = 0; index < commandList.length; index++) {
        const command = commandList[index][1];
        const flag = commandListIndices[index];
        if (flag) continue;

        await txChar.writeValue(command);
        sentItem = true;
      }
      // Once I got through every command, clear array and repeat
      if (sentItem == false)
        commandListIndices = new Array(commandList.length).fill(0);
    }, 300);
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
  // Average speed
  else if (type == 0xb6) {
    value = (bytes[6] + bytes[7] * 256) / 1000;
    store.commit("setAvgSpeed", value);
  }
  // Uptime
  else if (type == 0x3b) {
    // Uptime in seconds. Convert it to minutes for now.
    // TODO: Convert to nicer format eg. 1h39m
    value = (bytes[6] + bytes[7] * 256) / 60;
    store.commit("setUptime", value);
  }

  // Announce that this command was executed
  const commandIndex = commandList.findIndex(cmd => cmd[0] == type);
  commandListIndices[commandIndex] = 1;
}

// Locks the scooter and immediately updates.
export async function lockScooter(txChar) {
  await txChar.writeValue(cmd.CMD_LOCK_SCOOTER);

  const commandIndex = commandList.findIndex(cmd => cmd[0] == 0xb2);
  commandListIndices = new Array(commandList.length).fill(1);
  commandListIndices[commandIndex] = 1;
}

// Unlocks the scooter and immediately updates.
export async function unlockScooter(txChar) {
  await txChar.writeValue(cmd.CMD_UNLOCK_SCOOTER);

  const commandIndex = commandList.findIndex(cmd => cmd[0] == 0xb2);
  commandListIndices = new Array(commandList.length).fill(1);
  commandListIndices[commandIndex] = 1;
}

// Executed when bluetooth connection is lost.
function onDisconnected(event) {
  if (refreshTimer != null) clearInterval(refreshTimer);
  console.log("disconnected");
  store.commit("setConnected", false);
}
