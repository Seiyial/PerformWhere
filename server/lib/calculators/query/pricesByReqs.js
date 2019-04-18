const formatRequest = require('../util/formatRequest')
const { CHIDs, CHData } = require('../halls/all')

module.exports = (Context) => {
	const Request = formatRequest(Context.params)

	CHIDs.forEach((chID) => {
		Request.addCH(chID, CHData[chID].info)
	})

	CHIDs.forEach((chID) => {
		Request.setNowCalculating(chID)
		CHData[chID].calculateFees(Request)
		// Request.recordFees(chID, CHData[chID].feeCalculator)
	})

	Context.resolve({
		success: true,
		data: Request.results,
		errors: Request.errors,
		peakTypes: Request.peakTypes
	})
}
