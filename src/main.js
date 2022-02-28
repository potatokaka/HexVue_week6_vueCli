import { createApp } from 'vue'
// Bootstrap
import 'bootstrap'
// Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// Vee Validate
// Vee Validate－Global Validator
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
// Vee Validate－規則
import { required, email, min } from '@vee-validate/rules'
// Vee Validate－多國語系
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import App from './App.vue'
import router from './router'

// Vee Validate－規則
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: false
})
setLocale('zh_TW')

const app = createApp(App)
app.component('Form', Form)
app.component('Field', Field)
app.component('ErrorMessage', ErrorMessage)

app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
