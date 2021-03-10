import "./global.css";

import App from "./App.svelte";

const app = new App({
  target: document.getElementById("root"), // entry point in ../public/index.html
  props: {
    name: "world",
  },
});

export default app;
