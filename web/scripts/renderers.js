import Handlebars from 'handlebars'

Handlebars.registerHelper('if_eq', function (a, b, opts) {
	if (a == b) // Or === depending on your needs
		return opts.fn(this);
	else
		return opts.inverse(this);
});

const resultHeaders = Handlebars.compile(`
	<h3 class="subtitle is-6 has-text-info has-text-centered" style="width: 100%;">
		{{{ peaks }}}
	</h3>

	<ul class="pw-errors">
		<li class="is-size-7">
			<b class="has-text-grey-dark">We have no official contact with the concert halls</b> and PerformWhere is just a tool made based on publicly available information. They may update their prices anytime; results here should only serve as estimates. Do take note ☺️
		</li>

		{{#if errors}}
			{{#each errors}}
				<li class="has-text-danger is-size-7">
					{{ this }}
				</li>
			{{/each}}
		{{/if}}
		
		<li class="is-size-7">
			Please <a href="mailto:sayhao@seiyianworks.com">let me know</a> if anything can be improved or worked on. Thanks!
		</li>
	</ul>
`)

const resultItem = Handlebars.compile(`
	<div class="pw-result-item">
		<h1 class="title is-2 has-text-weight-bold has-text-info has-text-centered">
			<small class="has-text-weight-normal title is-4 has-text-info">≈ </small>$\{{ total }}
		</h1>

		<h1 class="mb-1 subtitle is-5 has-text-centered">
			{{ CH.info.name }}
		</h1>

		<p class="heading has-text-centered">
			{{ CH.info.seating }}<br>
			<a class="ch-link has-text-weight-bold" href="/CH-{{ id }}.pdf" target="_blank">
				Rates Document we used
			</a>
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

					<div class="item-mid has-text-weight-bold has-text-primary">
						<div class="item-qty">× {{ qty }}</div>
					</div>

					{{#if qtyB}}
						<div class="item-mid has-text-weight-bold has-text-primary">
							<div class="item-qty">× {{ qtyB }}</div>
						</div>
					{{/if}}

					<div class="item-right">
						<div class="item-result">
							{{#if_eq result 0}}
								Free
							{{else}}
								$\{{ result }}
							{{/if_eq}}
						</div>
					</div>
				</div>
			{{/CH.fees}}

			{{#if CH.info.extraInfo}}
				<div class="pw-fee-item">
					<div class="item-left">
						<div class="item-description">
							{{CH.info.extraInfo}}
						</div>
					</div>
				</div>
			{{/if}}
		</div>
	</div>
`)

const renderResults = ({ data, peakTypes, errors }) => {
	let result = ''

	// Insert Headers
	result += resultHeaders({ errors, peaks: renderPeaks(peakTypes) })

	// Insert Results
	Object.keys(data).map((id) => {
		const CH = data[id]
		console.log(id)
		
		const total = calculateTotals(CH.fees)
		result += resultItem({ id, CH, total })
	})

	document.getElementById('pw-result-list').innerHTML = result
}

const renderPeaks = (peakTypes) => {
	if (peakTypes.includes('Invalid DateTime')) {
		document.getElementById('date-error').innerText = 'Invalid Date'
		document.getElementById('input-date').classList.add('is-danger')
		return "(!) Please check your date and try again."
	} else {
		return `Your date is a: <b>${peakTypes.join('; ')}</b>`
	}
}

const calculateTotals = (fees) => fees.reduce((acc, fee) => {
	console.log('fee', fee.result);
	return acc + fee.result;
}, 0).toFixed(2)

module.exports = { renderResults }