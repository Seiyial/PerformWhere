// Before calculation, we should know:-
// No. of dark days => number
// No. of ushers => number
// Date => Luxon DateTime
// Date occasions (weekday name, PH and/or Eve)

// Also attach class methods (see PWRequest)

const { DateTime, Interval } = require('luxon')
const PH = require('../../../../env/ph')
const PWRequest = require('./PWRequest')

// Attach a better-featured DateTime object (powered by luxon) to easily handle the datetime logic
const formatDate = (obj) => {
	obj.lxDate = DateTime.fromISO(obj.date)
	return obj
}

// Function to attach info on the weekday of the requested date to the request object.
// Most Concert Halls have different rates for some days of the week such as Friday and the weekends.
const includeWeekday = (obj) => {
	obj.peakTypes.push(obj.lxDate.toFormat('EEEE'))
	return obj
}

// Function to check for and attach the info on whether the date lies on a PH or Eve.
// Most Concert Halls have different rates for PH and PH Eve.
const includePH = (obj) => {
	const { info: { coverage, lastUpdated }, list } = PH

	// Check if date submitted is not within our PH checking range
	if (!Interval.fromISO(`${coverage.start}/${coverage.end}`).contains(obj.lxDate)) {
		obj.errors.push(`We're unable to tell if there'll be a PH on your specified date as it's outside our checkable range (${coverage.start} ~ ${coverage.end}). PHs are only officially released by MOM for this and next year. If they're out already (ie. we've not been updating), please file an issue (link at bottom of page) and I'll update it :) If you're planning an event that's after next year, take care that additional PH rates may apply later on.`)
		obj.peakTypes.push('Outside PH known range')
	}

	// Insert PH if there is
	const phEvent = list[obj.date]
	if (phEvent) {
		const phEventType = phEvent.split(' ')[-1]

		if (phEventType === '(Eve)') {
			obj.peakTypes.push('PH Eve')
		} else if (phEventType == '(Observed)') {
			obj.peakTypes.push('PH Observed')
		} else {
			obj.peakTypes.push('PH')
		}
		obj.peakOccasion = phEvent
	}
	return obj
}

// Convert string data of certain fields into integers
const formatNumbers = (obj) => {
	[
		'duration', 'soundcheckDuration',
		'numDarkDays', 'numTechCrew', 'numUshers'
	].forEach((c) => {
		if (obj[c] === '' || !obj[c]) {
			obj[c] = 0
		} else {
			obj[c] = parseInt(obj[c])
		}
	})
	return obj
}

// Macro-function to properly deliver the processed request
// Usage from outside:
// const formatRequest = require('../path/to/formatRequest')
// Context.request = formatRequest(Context.params)
const formatRequest = (params) => {
	let reqData = params
	reqData.peakTypes = []
	reqData.errors = []
	reqData = formatDate(reqData)
	reqData = includeWeekday(reqData)
	reqData = includePH(reqData)
	reqData = formatNumbers(reqData)
	
	// Attach calculation logic by wrapping the PWRequest class
	// for easier calculation later on
	return new PWRequest(reqData)
}

module.exports = formatRequest
