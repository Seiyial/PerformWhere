const { queryListConcertHalls } = require('./lib/calculators')

const apiGateway = (conn) => {

	// set response Content-Type
	conn.type('application/json')
	conn.parse({
		json: (err, incoming) => {
			if (err) {
				conn.send(JSON.stringify({ success: false, errMsg: 'Issue handling your request' }))
			} else {
				// Package Query as a single object so that Query modules will be able to resolve the API on their own
				const resolve = (result, statusCode = 200) => resoveAPI(conn, result, statusCode)
				const Context = (({ query, params, auth }) => ({ query, params, auth, resolve }))(incoming)

				performQuery(query, Context)
			}
		}
	})
}

const resolveAPI = (conn, result, statusCode = 200) => {
	conn.status(statusCode)
	conn.send(JSON.stringify(result))
}

const performQuery = (query, Context) => {
	switch (query) {
		case 'list_concert_halls': queryListConcertHalls(Context)
		// case 'calc_': 
	}
}

module.exports = apiGateway