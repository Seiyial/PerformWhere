// LIST of Concert Halls that're calculated:-
const CONCERT_HALLS = [
	require('./EspCH'),
	require('./EspRS'),
	require('./VCH'),
	require('./SCCC'),
	require('./SCC'),
	require('./StarTheatre'),
	require('./SOTA'),
	require('./NAFALFT')
]

const concertHallList = CONCERT_HALLS.map(({ name, abbr, location, seating }) => ({ name, abbr, location, seating }))

module.exports = {
	list_concert_halls_query: ({ resolve }) => resolve({ success: true, data: concertHallList })
}