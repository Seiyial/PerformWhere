import './app.scss'
import axios from 'axios'
import { MDCRipple } from '@material/ripple'
import { sk } from '../env/sessionSecret'
import { renderResults } from './scripts/renderers'
import $ from 'jquery'

// Ripple
// const ripples = [
// 	document.querySelector('.pw-interface--clickable')
// ].map((e) => new MDCRipple(e))
// console.log('sk', sk)

const submitForm = () => {
	setLoading()

	document.getElementById('input-date').classList.remove('is-danger')

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
	.then(handleResults)
	.catch(console.warn)
	.finally(() => setTimeout(() => setLoading(false), 500))
}

const handleResults = ({ data: { success, data, errMsg, errors, peakTypes }}) => {
	console.log('(*) get_prices_by_reqs', { success, data, errMsg, errors, peakTypes })

	if (success) {
		renderResults({ data, errors, peakTypes })
		document.getElementById('pw-results-area').classList.add('show')
		setTimeout(() => $('html, body').animate({
			scrollTop: $('#pw-results-area').offset().top
		}), 200)
	}
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
