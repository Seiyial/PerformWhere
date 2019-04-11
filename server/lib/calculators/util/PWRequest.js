// PerformWhere Request Object API

class PWRequest {
	// 'eventType', 'duration', 'soundcheckDuration',
	//	'date', 'numDarkDays', 'numTechCrew', 'numUshers'
	constructor(params) {
		const {
			eventType, duration, soundcheckDuration, date, numDarkDays, numTechCrew, numUshers,
			lxDate, peakTypes, errors
		} = params
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
		return this
	}

	// test if PWRequest date fulfills at least one of the specified (flagged) peak conditions (e.g. PH)
	// eg usage: if (request.isPk('Friday', 'Eve of PH', 'PH')) { ... }
	// Accepted Peak Types
	isPk(...flaggedPeaks) {
		let match = null
		flaggedPeaks.forEach((flaggedPeak) => {
			if (this.peakTypes.includes(flaggedPeak)) {
				match = match || []
				match.push(flaggedPeak)
			}
		})
		return match
	}

	calc(factor, { min, rate }) {
		if (this[factor] === undefined) {
			this.errors.push(`There was an error calculating ${factor}. Min: ${min}, Rate: ${rate}. Please submit a bug (link at bottom). Thanks for your help!`)
		}
		let val = this[factor]
		if (val < min) { val = min }
		return val * rate
	}
}

module.exports = PWRequest