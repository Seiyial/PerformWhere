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
		this.rehDur = soundcheckDuration
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
	// eg usage: if (request.isPk(['Friday', 'Eve of PH', 'PH'])) { ... }
	// Accepted Peak Types
	isPeak(specifiedPeaks) {
		let match = null
		specifiedPeaks.forEach((flaggedPeak) => {
			if (this.peakTypes.includes(flaggedPeak)) {
				match = match || []
				match.push(flaggedPeak)
			}
		})
		return match
	}

	addCH(chID, info) {
		this.results[chID] = {
			info,
			fees: []
		}
		return this
	}

	recordFees(chID, feesCompilerFunction) {
		console.log("FCF", feesCompilerFunction);
		
		const fees = feesCompilerFunction(this)
		this.results[chID].fees = fees
	}

	calc({ label, description, rate, min, qty }) {
		const calcItem = {
			label, description, rate,
			qty: null,
			usedMin: null,
			result: null,
			error: false
		}
		
		if (qty === undefined) {
			this.errors.push(`There was an error calculating ${factor}. Min: ${min}, Rate: ${rate}. Please submit a bug (link at bottom). Thanks for your help!`)
			calcItem.result = 0
			calcItem.error = true
			return this.results[ch]
		}

		let actualQty
		if (min && qty < min) {
			actualQty = min
			calcItem.usedMin = true
		} else {
			actualQty = qty
		}
		calcItem.qty = actualQty
		calcItem.result = qty * rate

		return calcItem
	}

	calcBaseRate({ label, description, rate, baseHrs }) {
		const calcItem = { description, rate }
		calcItem.label = label || 'Base Rate'
		if (label === 'Concert' || label === 'Soundcheck') {
			calcItem.label = `${label} Base Rate`
		}
		calcItem.qty = `${baseHrs}h`
		calcItem.usedMin = true
		calcItem.result = rate
		return calcItem
	}

	// Calculator for additional hrs
	// IF you'd like to round the qty up or down, do it before sending it into this function
	// rate and qty MUST NOT be string
	calcAddHrs({ label, description, rate, qty }) {
		const calcItem = { description, rate }
		calcItem.label = label || 'Additional Hrs'
		if (label === 'Concert' || label === 'Soundcheck') {
			calcItem.label = `${label} Additional Hrs`
		}
		calcItem.usedMin = false // if true, there'd be no addHr
		calcItem.result = rate * qty
		return calcItem
	}

	// creates a peak surcharge calcItem.
	// > label: feel free to input 'Concert' or 'Soundcheck' or nothing at all, and it will prefill for you.
	// rate and qty MUST NOT be string
	calcPeakSurcharge({ label, description, rate, qty }) {
		const calcItem = { description, rate }
		calcItem.qty = qty || 1
		calcItem.label = label || 'Peak Surcharge'
		if (label === 'Concert' || label === 'Soundcheck') {
			calcItem.label = `${label} Peak Surcharge`
		}
		calcItem.result = calcItem.qty * rate
		return calcItem
	}

	calcManHr({ label, description, hrs, pax, rate }) {
		const calcItem = { label, description, rate }
		calcItem.qtyB = pax + ' pax'
		calcItem.qty = hrs + ' h'
		calcItem.result = rate * pax * hrs
		return calcItem
	}
}

module.exports = PWRequest