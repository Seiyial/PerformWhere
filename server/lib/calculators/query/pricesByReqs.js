const formatRequest = require('../util/formatRequest')
const { CHIDs, CHData } = require('../halls/all')

module.exports = (Context) => {
	const Request = formatRequest(Context.params)

	CHIDs.forEach((chID) => {
		Request.addCH(chID, CHData[chID].info)
	})

	CHIDs.forEach((chID) => {
		console.log(chID, CHData[chID]);
		
		Request.recordFees(chID, CHData[chID].feeCalculator)
	})
	console.log('REQUEST', Request)

	Context.resolve({
		success: true,
		data: Request.results
	})
}
