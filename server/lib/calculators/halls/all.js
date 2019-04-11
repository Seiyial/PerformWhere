// Concert Hall IDs
const CHIDs = [
	'EspCH', 'EspRS', 'NAFALFT', 'SCC', 'SCCC', 'SOTA', 'VCH'
]

// Concert Hall Data
const CHData = {}
chIDList.forEach((chID) => {
	CHData[chID] = require(`./${chID}`)
})

module.exports = {
	CHIDs,
	CHData
}