// PerformWhere Request Object API

class PWRequest {
	// Constructor makes pre-existing properties accessible and attaches a results object
	// PWRequest class attaches instance methods to the request data, and wraps results within itself,
	// allowing for easy calculation.
	constructor(reqData) {
		const {
			eventType, duration, soundcheckDuration, date, numDarkDays, numTechCrew, numUshers,
			lxDate, peakTypes, errors
		} = reqData
		this.evType = eventType
		this.dur = duration
		this.scDur = soundcheckDuration
		this.isoDate = date
		this.numDD = numDarkDays
		this.numTC = numTechCrew
		this.numUsh = numUshers
		this.lxDate = lxDate
		this.peakTypes = peakTypes
		this.errors = errors
		this.results = {}
		return this
	}

	// test if PWRequest date fulfills at least one of the specified peak conditions (e.g. PH)
	// eg usage: if (request.isPk('Friday', 'Eve of PH', 'PH')) { ... }
	// Accepted Peak Types
	isPeak(...specifiedPeaks) {
		let match = null
		specifiedPeaks.forEach((flaggedPeak) => {
			if (this.peakTypes.includes(flaggedPeak)) {
				match = match || []
				match.push(flaggedPeak)
			}
		})
		return match
	}

	includeCH(chID, info) {
		this.results[chID] = {
			info,
			fees: []
		}
		return this
	}

	calc(chID, factor, { label, description, rate, min }) {
		const calcItem = { label, description, rate, qty: this[factor], useMin: null, result: null, error: false }
		
		if (this[factor] === undefined) {
			this.errors.push(`There was an error calculating ${factor}. Min: ${min}, Rate: ${rate}. Please submit a bug (link at bottom). Thanks for your help!`)
			calcItem.result = 0
			calcItem.error = true
			return this.results[ch]
		}

		let qty = this[factor]
		if (qty < min) { qty = min }
		calcItem.label = label
		calcItem.description = description
		calcItem.result = qty * rate

		this.results[chID].fees.push(calcItem)
		return this
	}
}

module.exports = PWRequest