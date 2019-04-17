import Handlebars from 'handlebars'

const errorItem = Handlebars.compile(`
	<div class="pw-errors">
		Error box
	</div>
`)

const resultItem = Handlebars.compile(`
	<div class="pw-result-item">
		<h1 class="title is-2 has-text-weight-bold has-text-info has-text-centered">
			$\{{ total }}
		</h1>

		<h1 class="mb-1 subtitle is-5 has-text-centered">
			<a class="ch-link" href="/CH-{{ id }}.pdf" target="_blank">
				{{ CH.info.name }}
			</a>
		</h1>

		<p class="heading has-text-centered">
			{{ CH.info.seating }}
		</p>

		<div class="pw-result-fee-list">
			{{#CH.fees}}
				<div class="pw-fee-item">
					<div class="item-left">
						<div class="item-label">
							{{ label }}
							
							{{#if min}}
								<superscript class="has-text-success">Min</superscript>
							{{/if}}
						</div>
						<div class="item-description">{{ description }}</div>
					</div>

					<div class="item-mid">
						<div class="item-rate">$\{{ rate }}</div>
					</div>

					<div class="item-mid">
						<div class="item-qty">× {{ qty }}</div>
					</div>

					{{#if qtyB}}
						<div class="item-mid">
							<div class="item-qty">× {{ qtyB }}</div>
						</div>
					{{/if}}

					<div class="item-right">
						<div class="item-result">$\{{ result }}</div>
					</div>
				</div>
			{{/CH.fees}}
		</div>
	</div>
`)

const renderResults = (data) => {
	let result = ''

	Object.keys(data).map((id) => {
		const CH = data[id]
		console.log(id)
		
		const total = calculateTotals(CH.fees)
		result += resultItem({ id, CH, total })
	})
	console.log('RESULTs', result)

	document.getElementById('pw-result-list').innerHTML = result
}

const calculateTotals = (fees) => fees.reduce((acc, fee) => {
	console.log('fee', fee.result);
	return acc + fee.result;
}, 0).toFixed(2)

module.exports = { renderResults }