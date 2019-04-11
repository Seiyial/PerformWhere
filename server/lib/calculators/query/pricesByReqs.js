const formatRequest = require('../util/formatRequest')
const { CHIDs, CHData } = require('../halls/all')

module.exports = (Context) => {
	const Request = formatRequest(Context.params)

	CHIDs.forEach((chID) => {
		Request.addCH(chID, CHData[chID].info)
	})

	CHIDs.forEach((chID) => {
		Request.recordReceipt(chID, CHData[chID].resolveFees)
	})
	console.log('REQUEST', Request)
}