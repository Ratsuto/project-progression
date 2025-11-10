import 'primeicons/primeicons.css'
import '@/assets/main.css'
import '@/assets/custom.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import KeyFilter from 'primevue/keyfilter';


const app = createApp(App);
app.directive('keyfilter', KeyFilter);
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
});
app.mount('#app');