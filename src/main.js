// Service worker
import "./registerServiceWorker";

// Font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBatteryFull,
  faRoad,
  faTachometerAlt,
  faThermometerHalf,
  faLock,
  faUnlock,
  faCompass
} from "@fortawesome/free-solid-svg-icons";
import { faBluetoothB } from "@fortawesome/free-brands-svg-icons";
import { faCompass as farCompass } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

// Add only the icons we plan to use
library.add(faThermometerHalf);
library.add(faBatteryFull);
library.add(faRoad);
library.add(faTachometerAlt);
library.add(faBluetoothB);
library.add(faLock);
library.add(faUnlock);
library.add(faCompass);
library.add(farCompass);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({ router, store, render: h => h(App) }).$mount("#app");
