// Before calculation, we should know:-
// No. of dark days => number
// No. of ushers => number
// Date => Luxon DateTime
// Date occasions (weekday name, PH and/or Eve)

const { DateTime, Interval } = require('luxon')
const PH = require('../../../../env/ph')
const PWRequest = require('./PWRequest')

const formatDate = (obj) => {
	obj.lxDate = DateTime.fromISO(date)
	return obj
}

const includeWeekday = (obj) => obj.peakTypes.push(obj.lxDate.toFormat('EEEE'))

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
}

const formatParams = (Context) => {
	let reqData = Context.params
	reqData.peakTypes = []
	reqData.errors = []
	reqData = formatDate(reqData)
	reqData = includeWeekday(reqData)
	reqData = includePH(reqData)
	Context.Request = new PWRequest(reqData)
	
	return Context
}

module.exports = formatParams