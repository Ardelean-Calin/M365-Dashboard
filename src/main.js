// Service worker
import "./registerServiceWorker";

// Font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBatteryFull,
  faRoad,
  faTachometerAlt,
  faThermometerHalf,
  faWifi,
  faLock,
  faUnlock,
  faFireAlt,
  faLeaf
} from "@fortawesome/free-solid-svg-icons";
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
library.add(faWifi);
library.add(faLock);
library.add(faUnlock);
library.add(faFireAlt);
library.add(faLeaf);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({ router, store, render: h => h(App) }).$mount("#app");
