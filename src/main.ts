import { createApp } from 'vue';
import router from './infrastructure/router';
import vuetify from './infrastructure/plugins/vuetify';
import './assets/styles/main.scss';

import App from './App.vue';

const app = createApp(App);

app.use(vuetify);
app.use(router);

app.mount('#app');
