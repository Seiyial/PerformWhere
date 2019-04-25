// Concert Hall IDs
const CHIDs = [
	// 'EspCH', 'EspRS', 'NAFALFT', 'SCH', 'SCCC', 'SOTA', 'VCH'
	'EspCH', 'EspRS', 'VCH', 'SOTA', 'NAFALFT', 'SCH', 'SCCC'
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