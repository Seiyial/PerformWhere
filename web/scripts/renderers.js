import Handlebars from 'handlebars'

const resultItem = Handlebars.compile(`
	<div class="pw-result-item">
		<h1 class="title is-2 has-text-weight-bold has-text-info has-text-centered">
			{{ total }}
		</h1>

		<h1 class="subtitle is-4 has-text-centered">
			{{ CH.info.name }}
		</h1>

	</div>
`)

const renderResults = (data) => {
	let result = ''

	Object.keys(data).map((id) => {
		const CH = data[id]
		console.log(id)
		
		const total = calculateTotals(CH.fees)
		result += resultItem({ CH, total })
	})

	document.getElementById('pw-result-list').innerHTML = result
}

const calculateTotals = (fees) => fees.map((acc, fee) => {
	console.log(fee);
	acc + fee.result;
})

module.exports = { renderResults }