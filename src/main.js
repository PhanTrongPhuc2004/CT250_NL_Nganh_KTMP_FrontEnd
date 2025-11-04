import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

import BootstrapVue3 from "bootstrap-vue-3";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// ✅ FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Solid icons
import {
  faAngleRight,
  faAngleDown,
  faEllipsisV,
  faAngleLeft,
  faTrash,
  faPen,
  faPlus,
  faClose,
  faTachometerAlt,
  faShieldAlt,
  faUser,
  faTrophy,
  faUsers,
  faNewspaper,
  faGift,
  faBoxOpen,
  faTicketAlt,
  faChartBar,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";

// Regular icons
import {
  faUser as farUser,
  faCalendar as farCalendar,
  faFile as farFile,
} from "@fortawesome/free-regular-svg-icons";

// Brands (nếu có)
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

// Add vào library
library.add(
  // Solid
  faAngleRight,
  faAngleDown,
  faEllipsisV,
  faAngleLeft,
  faTrash,
  faPen,
  faPlus,
  faClose,
  faTachometerAlt,
  faShieldAlt,
  faUser,
  faTrophy,
  faUsers,
  faNewspaper,
  faGift,
  faBoxOpen,
  faTicketAlt,
  faChartBar,
  faFileContract,
  // Regular
  farUser,
  farCalendar,
  farFile,
  // Brands
  faFacebook,
  faTwitter
);

// Tạo app
const app = createApp(App);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(BootstrapVue3);
app.use(createPinia());
app.use(router);
app.use(LoadingPlugin);
app.mount("#app");
