import 'virtual:uno.css'
import { createApp } from "vue"
import "./style.scss"
import App from "./App.vue"
import dayjs from './utils/dayjs'

const app = createApp(App)

// Make dayjs available globally in Vue 3
app.provide('$dayjs', dayjs)

app.mount("#app")
