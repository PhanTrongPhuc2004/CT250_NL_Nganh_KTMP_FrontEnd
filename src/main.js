import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 👈 thêm dòng này
import * as bootstrap from "bootstrap"; // 👈 thêm dòng này
window.bootstrap = bootstrap; // 👈 và dòng này
import BootstrapVue3 from "bootstrap-vue-3";

import App from "./App.vue";
import router from "./router";

// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAngleRight,
  faAngleDown,
  faEllipsis,
  faEllipsisV,
  faTrophy,
  faBackspace,
  faAngleLeft,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

// Pinia
import { createPinia } from "pinia";

// --- App setup ---
const app = createApp(App);

// FontAwesome
library.add(
  faAngleRight,
  faAngleDown,
  faEllipsisV,
  faAngleLeft,
  faTrash,
  faPen
);
app.component("FontAwesomeIcon", FontAwesomeIcon);

// Plugins
app.use(BootstrapVue3);
app.use(createPinia());
app.use(router);

app.mount("#app");
