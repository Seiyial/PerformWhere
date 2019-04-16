// Concert Hall IDs
const CHIDs = [
	// 'EspCH', 'EspRS', 'NAFALFT', 'SCC', 'SCCC', 'SOTA', 'VCH'
	'EspCH', 'EspRS'
]

// Concert Hall Data
const CHData = {}
CHIDs.forEach((chID) => {
	CHData[chID] = require(`./${chID}`)
})

module.exports = {
	CHIDs,
	CHData
}