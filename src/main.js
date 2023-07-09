import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import TDesign from 'tdesign-vue-next';
import { createPinia } from "pinia";

import 'tdesign-vue-next/es/style/index.css';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(TDesign);
app.mount("#app");

//Initialize Arduino information 
import { useBoardStore } from "./stores/board";
import { usePortStore } from "./stores/port";
useBoardStore().updateList();
usePortStore().updateList();