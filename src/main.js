// Store init
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Styles init
import "./styles.css";
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';

// Start Blockly
import * as Blockly from "blockly";
import './blockly/blocks/index';
import * as spanishLang from "blockly/msg/es";
Blockly.setLocale(spanishLang);

// Start App
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.use(pinia);
app.use(TDesign);
app.mount("#app");

// Finish start
import {useAppStore} from "./stores/app";
useAppStore().startApp();