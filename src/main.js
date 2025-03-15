import useLifecycle from "@/composables/useLIfecycle.js";
import { deleteLocalStorageInformation } from "@/utility/functions.js";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import "element-plus/dist/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import posthogPlugin from "./plugins/posthog"; //import the plugin.
import router from "./router/index.js";
import store from "./store/index.js";
import "./style.css";
import "./theme.css";
import api from "./utility/api.js";

api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("authData"));

  if (authData?.access) {
    config.headers.Authorization = authData?.access
      ? "Bearer " + authData?.access
      : ""; //else
  }
  return config;
});
api.interceptors.response.use(undefined, function (err) {
  return new Promise(function () {
    console.log("status", err.response.status);
    if (err.response.status === 401) {
      ElNotification({
        title: "Error",
        type: "error",
        position: "top-right",
        message: "Session Expired",
      });
      deleteLocalStorageInformation();

      router.push({ name: "login" });
    } else if (err.response.status === 403) {
      ElNotification({
        title: "Error",
        type: "error",
        position: "top-right",
        message: "Permission Denied",
      });
    }
    throw err;
  });
});

const app = createApp(App);
app.use(posthogPlugin); //install the plugin
// posthog.capture("my event", { property: "value" });
app.use(router);
app.use(useLifecycle);
app.use(store);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
