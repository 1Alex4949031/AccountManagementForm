import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

// Pinia
import {createPinia} from 'pinia';
import piniaPlugin from 'pinia-plugin-persistedstate';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

createApp(App)
    .use(createPinia().use(piniaPlugin))
    .mount('#app');
