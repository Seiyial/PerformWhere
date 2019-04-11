// LIST of Concert Halls that're calculated:-
const CONCERT_HALLS = [
	require('./halls/EspCH'),
	require('./halls/EspRS'),
	require('./halls/VCH'),
	require('./halls/SCCC'),
	require('./halls/SCC'),
	require('./halls/StarTheatre'),
	require('./halls/SOTA'),
	require('./halls/NAFALFT')
]

const concertHallList = CONCERT_HALLS.map(({ name, abbr, location, seating }) => ({ name, abbr, location, seating }))

module.exports = {
	list_concert_halls_query: ({ resolve }) => resolve({ success: true, data: concertHallList }),
	// calculate_by_reqs_query: getRatesForReqs['all'] 
}