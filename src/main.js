import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

import './assets/scss/main.scss'

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import {
	faSort,
	faSortUp,
	faSortDown,
	faPlus,
	faXmark,
} from '@fortawesome/free-solid-svg-icons'

import {faTrashCan} from '@fortawesome/free-regular-svg-icons'
library.add(faSort, faSortUp, faSortDown, faTrashCan, faPlus, faXmark)

const app = createApp(App)

app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
