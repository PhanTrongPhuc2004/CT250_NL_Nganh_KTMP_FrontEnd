import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import BootstrapVue3 from "bootstrap-vue-3";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

//import icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const app = createApp(App);
library.add(faAngleRight);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(BootstrapVue3);
app.use(router);
app.mount("#app");
