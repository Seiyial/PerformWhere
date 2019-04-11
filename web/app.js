import './app.scss'
import axios from 'axios'
import { MDCRipple } from '@material/ripple'
import { sk } from '../env/sessionSecret'

// Ripple
// const ripples = [
// 	document.querySelector('.pw-interface--clickable')
// ].map((e) => new MDCRipple(e))
// console.log('sk', sk)

const submitForm = () => {
	setLoading()
	const params = {}
	const fields = [
		'eventType', 'duration', 'soundcheckDuration',
		'date', 'numDarkDays', 'numTechCrew', 'numUshers'
	]
	
	fields.forEach((i) => {
		params[i] = document.getElementById(`input-${i}`).value
	})

	console.log('Params', params)
	
	axios.post('/api', { params, query: 'get_prices_by_reqs', auth: sk })
	.then((reply) => console.log('(*) get_prices_by_reqs', reply.data))
	.catch(console.warn)
	.finally(() => setLoading(false))
}

const setLoading = (bool = true) => {
	if (bool) {
		document.getElementById('submit-button').classList.add('is-loading')
	} else {
		document.getElementById('submit-button').classList.remove('is-loading')
	}
}

// axios
// .post('/api', { 'name': 'list_concert_halls' })
// .then((reply) => console.log('REply', reply))
// .catch(console.warn)

window.syxPW = { submitForm }
