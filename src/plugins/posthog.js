//./plugins/posthog.js
import posthog from "posthog-js";

export default {
  install(app) {
    app.config.globalProperties.$posthog = posthog.init(
      'phc_6qETCWfYxqLlXqOghGuNRTlvKxika0GM8gvkdWWzSjM',
      {
        api_host: 'https://us.i.posthog.com',
      }
    );
  },
};