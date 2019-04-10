import './app.scss'
import axios from 'axios'
import { MDCRipple } from '@material/ripple'

const ripples = [
	document.querySelector('.pw-interface--clickable')
].map((e) => new MDCRipple(e))

// Ripple



axios
.post('/api', { 'name': 'list_concert_halls' })
.then((reply) => console.log('REply', reply))
.catch(console.warn)
