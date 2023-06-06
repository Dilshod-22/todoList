import { createApp } from 'vue'
import App from './components/App/App.vue'
import "./index.css"
import uiComponents from './components/ui-components'

const app = createApp(App)

uiComponents.map(component => app.component(component.name,component))

app.mount('#app')
